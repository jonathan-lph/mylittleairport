// One-off migration: reshapes src/__data/{albums,tracks,artists}/*.json from the
// denormalized "exported from MongoDB" shape (shallow-ref objects like
// { slug, name, name_en }) into a flat, normalized shape (plain slug strings),
// and deletes the now-superseded src/__data/toc/*.json index files.
//
// Run once. Kept committed for posterity/auditability, not wired into any script.
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'src/__data')

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n')
}

function migrateAlbums() {
  const dir = path.join(DATA_DIR, 'albums')
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file)
    const album = readJson(filePath)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructured only to exclude from rest
    const { href, total_tracks, artists, tracks, ...rest } = album
    writeJson(filePath, {
      ...rest,
      artists: artists.map((_artist) => _artist.slug),
      tracks: tracks.map((_track) => _track.slug),
    })
  }
}

function migrateTracks() {
  const dir = path.join(DATA_DIR, 'tracks')
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file)
    const track = readJson(filePath)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructured only to exclude from rest
    const { href, album, artists, ...rest } = track
    writeJson(filePath, {
      ...rest,
      album: album.slug,
      artists: artists.map((_artist) => ({
        role: _artist.role,
        members: _artist.members.map((_member) => _member.slug),
      })),
    })
  }
}

function migrateArtists() {
  const dir = path.join(DATA_DIR, 'artists')
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file)
    const artist = readJson(filePath)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructured only to exclude from rest
    const { href, ...rest } = artist
    writeJson(filePath, rest)
  }
}

function deleteToc() {
  const tocDir = path.join(DATA_DIR, 'toc')
  fs.rmSync(tocDir, { recursive: true, force: true })
}

migrateAlbums()
migrateTracks()
migrateArtists()
deleteToc()

console.log('Migrated src/__data to flat/normalized shape and removed toc/*.json')
