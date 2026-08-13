// Rebuilds the SQLite content database from the human-edited JSON files in
// src/__data/{albums,tracks,artists}. This is a pure build artifact: never
// hand-edited, never committed, regenerated before every dev/build run.
import fs from 'fs'
import path from 'path'
import Database from 'better-sqlite3'

const ROOT = process.cwd()
const DATA_DIR = path.join(ROOT, 'src/__data')
const OUT_DIR = path.join(DATA_DIR, '.generated')
const DB_PATH = path.join(OUT_DIR, 'content.sqlite')
const SCHEMA_PATH = path.join(ROOT, 'src/services/database/schema.sql')

function readEntities(dir) {
  return fs
    .readdirSync(path.join(DATA_DIR, dir))
    .map((file) => JSON.parse(fs.readFileSync(path.join(DATA_DIR, dir, file), 'utf-8')))
}

function insertExternalUrls(db, entityType, entityId, externalUrls) {
  const insert = db.prepare(
    `INSERT INTO external_urls (entity_type, entity_id, origin, url) VALUES (?, ?, ?, ?)`
  )
  for (const [origin, url] of Object.entries(externalUrls ?? {})) {
    insert.run(entityType, entityId, origin, url)
  }
}

function getOrCreateGenreId(db, genreIdCache, name) {
  if (genreIdCache.has(name)) return genreIdCache.get(name)
  const existing = db.prepare(`SELECT id FROM genres WHERE name = ?`).get(name)
  const id = existing
    ? existing.id
    : db.prepare(`INSERT INTO genres (name) VALUES (?)`).run(name).lastInsertRowid
  genreIdCache.set(name, id)
  return id
}

function buildDatabase() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.rmSync(DB_PATH, { force: true })

  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = ON')
  db.exec(fs.readFileSync(SCHEMA_PATH, 'utf-8'))

  const genreIdCache = new Map()

  db.transaction(() => {
    // --- Artists ---
    const artistSlugToId = new Map()
    const insertArtist = db.prepare(
      `INSERT INTO artists (slug, name, name_en) VALUES (@slug, @name, @name_en)`
    )
    const insertArtistAlias = db.prepare(
      `INSERT INTO artist_aliases (artist_id, position, alias) VALUES (?, ?, ?)`
    )
    const insertArtistImage = db.prepare(
      `INSERT INTO artist_images (artist_id, position, url, type, height, width)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    const insertExternalSocialUrl = db.prepare(
      `INSERT INTO external_social_urls (artist_id, origin, url) VALUES (?, ?, ?)`
    )

    for (const artist of readEntities('artists')) {
      const artistId = insertArtist.run(artist).lastInsertRowid
      artistSlugToId.set(artist.slug, artistId)

      artist.alias.forEach((alias, position) => insertArtistAlias.run(artistId, position, alias))
      artist.images.forEach((image, position) =>
        insertArtistImage.run(artistId, position, image.url, image.type, image.height, image.width)
      )
      insertExternalUrls(db, 'artist', artistId, artist.external_urls)
      for (const [origin, url] of Object.entries(artist.external_social_urls ?? {})) {
        insertExternalSocialUrl.run(artistId, origin, url)
      }
    }

    // --- Albums ---
    const albumSlugToId = new Map()
    const insertAlbum = db.prepare(`
      INSERT INTO albums (
        slug, name, name_en, album_type, album_edition,
        label, label_en, release_date, release_date_precision, is_live
      ) VALUES (
        @slug, @name, @name_en, @album_type, @album_edition,
        @label, @label_en, @release_date, @release_date_precision, @is_live
      )
    `)
    const insertAlbumImage = db.prepare(
      `INSERT INTO album_images (album_id, position, url, type, height, width)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    const insertAlbumArtist = db.prepare(
      `INSERT INTO album_artists (album_id, artist_id, position) VALUES (?, ?, ?)`
    )
    const insertAlbumGenre = db.prepare(
      `INSERT INTO album_genres (album_id, genre_id) VALUES (?, ?)`
    )

    for (const album of readEntities('albums')) {
      const albumId = insertAlbum
        .run({ ...album, is_live: album.is_live ? 1 : 0 })
        .lastInsertRowid
      albumSlugToId.set(album.slug, albumId)

      album.images.forEach((image, position) =>
        insertAlbumImage.run(albumId, position, image.url, image.type, image.height, image.width)
      )
      album.artists.forEach((artistSlug, position) => {
        const artistId = artistSlugToId.get(artistSlug)
        if (!artistId) throw new Error(`Album ${album.slug}: unknown artist slug ${artistSlug}`)
        insertAlbumArtist.run(albumId, artistId, position)
      })
      album.genres.forEach((genreName) =>
        insertAlbumGenre.run(albumId, getOrCreateGenreId(db, genreIdCache, genreName))
      )
      insertExternalUrls(db, 'album', albumId, album.external_urls)
    }

    // --- Tracks ---
    const insertTrack = db.prepare(`
      INSERT INTO tracks (
        slug, name, name_en, album_id, disc_number, track_number,
        duration_s, has_lyrics, lyrics, is_live, is_playable, preview_url
      ) VALUES (
        @slug, @name, @name_en, @album_id, @disc_number, @track_number,
        @duration_s, @has_lyrics, @lyrics, @is_live, @is_playable, @preview_url
      )
    `)
    const insertTrackArtist = db.prepare(
      `INSERT INTO track_artists (track_id, artist_id, role, position) VALUES (?, ?, ?, ?)`
    )
    const insertTrackGenre = db.prepare(
      `INSERT INTO track_genres (track_id, genre_id) VALUES (?, ?)`
    )

    for (const track of readEntities('tracks')) {
      const albumId = albumSlugToId.get(track.album)
      if (!albumId) throw new Error(`Track ${track.slug}: unknown album slug ${track.album}`)

      const trackId = insertTrack.run({
        ...track,
        album_id: albumId,
        lyrics: track.lyrics ?? null,
        duration_s: track.duration_s ?? null,
        preview_url: track.preview_url ?? null,
        has_lyrics: track.has_lyrics ? 1 : 0,
        is_live: track.is_live ? 1 : 0,
        is_playable: track.is_playable ? 1 : 0,
      }).lastInsertRowid

      track.artists.forEach(({ role, members }) => {
        members.forEach((artistSlug, position) => {
          const artistId = artistSlugToId.get(artistSlug)
          if (!artistId)
            throw new Error(`Track ${track.slug}: unknown artist slug ${artistSlug} (role ${role})`)
          insertTrackArtist.run(trackId, artistId, role, position)
        })
      })
      track.genres.forEach((genreName) =>
        insertTrackGenre.run(trackId, getOrCreateGenreId(db, genreIdCache, genreName))
      )
      insertExternalUrls(db, 'track', trackId, track.external_urls)
    }
  })()

  const counts = {
    artists: db.prepare('SELECT COUNT(*) AS c FROM artists').get().c,
    albums: db.prepare('SELECT COUNT(*) AS c FROM albums').get().c,
    tracks: db.prepare('SELECT COUNT(*) AS c FROM tracks').get().c,
  }
  db.close()

  console.log(
    `Built ${DB_PATH} — ${counts.artists} artists, ${counts.albums} albums, ${counts.tracks} tracks`
  )
}

buildDatabase()
