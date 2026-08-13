// One-off migration: drops the redundant "tracks" slug array from
// src/__data/albums/*.json. An album's track list is fully derivable from
// tracks/*.json's "album" ref (ordered by disc_number/track_number), and
// buildDatabase.mjs never reads album.tracks — it was write-only duplicate
// data that could drift out of sync with the real source of truth.
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

function dropAlbumTracksRef() {
  const dir = path.join(DATA_DIR, 'albums')
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file)
    const { tracks, ...rest } = readJson(filePath)
    writeJson(filePath, rest)
  }
}

dropAlbumTracksRef()

console.log('Dropped redundant tracks[] ref from src/__data/albums/*.json')
