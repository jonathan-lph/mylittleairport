import { getDb } from "./client"
import {
  getAlbumRowBySlug,
  getAlbumArtistIds,
  getSimplifiedAlbum,
  getSimplifiedArtist,
  mapFullAlbum,
  getGenres
} from "./rows"

import type { AlbumRow } from "./rows"
import type { AlbumObject, ExpandedAlbumObject, TocAlbumObject } from "@__types/Album"

export function fetchExpandedAlbum(albumSlug: string): ExpandedAlbumObject {
  const row = getAlbumRowBySlug(albumSlug)
  if (!row) throw new Error(`Album not found: ${albumSlug}`)

  return {
    ...getSimplifiedAlbum(row.id),
    genres: getGenres("album_genres", "album_id", row.id),
    artists: getAlbumArtistIds(row.id).map(getSimplifiedArtist)
  }
}

export function fetchAllAlbums(): AlbumObject[] {
  const rows = getDb().prepare(`SELECT * FROM albums`).all() as AlbumRow[]
  return rows.map(mapFullAlbum)
}

export function fetchAllAlbumSlugs(): string[] {
  return getDb()
    .prepare(`SELECT slug FROM albums`)
    .all()
    .map((r) => (r as { slug: string }).slug)
}

export function searchAlbums(query: Partial<TocAlbumObject>, expand?: false): TocAlbumObject[]
export function searchAlbums(query: Partial<TocAlbumObject>, expand: true): ExpandedAlbumObject[]
export function searchAlbums(query: Partial<TocAlbumObject>, expand?: boolean) {
  const keys = Object.keys(query) as (keyof TocAlbumObject)[]
  const where = keys.length ? `WHERE ${keys.map((key) => `${key} = @${key}`).join(" AND ")}` : ""
  const matches = getDb()
    .prepare(`SELECT slug, name, name_en FROM albums ${where}`)
    .all(query as Record<string, unknown>) as TocAlbumObject[]

  return expand ? matches.map((match) => fetchExpandedAlbum(match.slug)) : matches
}
