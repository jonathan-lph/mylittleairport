// Generates public/search-index.json: the client-facing search/shuffle data
// asset used by SearchBar.tsx and Header.tsx. SQLite can't be queried from a
// static-exported browser bundle, so this build-time step produces a static
// JSON file (same shape as the old src/__data/toc/tracks.json) instead.
import fs from 'fs'
import path from 'path'
import Database from 'better-sqlite3'

const ROOT = process.cwd()
const DB_PATH = path.join(ROOT, 'src/__data/.generated/content.sqlite')
const OUT_PATH = path.join(ROOT, 'public/search-index.json')

function buildSearchIndex() {
  const db = new Database(DB_PATH, { readonly: true, fileMustExist: true })

  const tracks = db.prepare(`SELECT id, slug, name, name_en, lyrics, album_id FROM tracks`).all()
  const getAlbumRef = db.prepare(`SELECT slug, name, name_en FROM albums WHERE id = ?`)
  const getAlbumImages = db.prepare(
    `SELECT url, type, height, width FROM album_images WHERE album_id = ? ORDER BY position`
  )

  const searchIndex = tracks.map((track) => {
    const album = getAlbumRef.get(track.album_id)
    return {
      slug: track.slug,
      name: track.name,
      name_en: track.name_en,
      lyrics: track.lyrics,
      album: {
        slug: album.slug,
        name: album.name,
        name_en: album.name_en,
        images: getAlbumImages.all(track.album_id)
      }
    }
  })

  db.close()
  fs.writeFileSync(OUT_PATH, JSON.stringify(searchIndex))
  console.log(`Built ${OUT_PATH} — ${searchIndex.length} tracks`)
}

buildSearchIndex()
