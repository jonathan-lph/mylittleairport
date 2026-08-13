import { getDb } from "./client"
import {
  getTrackRowBySlug,
  getSimplifiedAlbum,
  mapTrackArtistsByRole,
  getGenres,
  getExternalUrls,
  getTocAlbumRef
} from "./rows"
import { ResourceType } from "@__types/common"

import type { ExpandedTrackObject, TocTrackObject } from "@__types/Track"

export function fetchExpandedTrack(trackSlug: string): ExpandedTrackObject {
  const row = getTrackRowBySlug(trackSlug)
  if (!row) throw new Error(`Track not found: ${trackSlug}`)

  return {
    type: ResourceType.TRACK,
    slug: row.slug,
    name: row.name,
    name_en: row.name_en,
    href: `/track/${row.slug}`,
    disc_number: row.disc_number,
    track_number: row.track_number,
    duration_s: row.duration_s,
    has_lyrics: !!row.has_lyrics,
    lyrics: row.lyrics,
    genres: getGenres("track_genres", "track_id", row.id),
    is_live: !!row.is_live,
    is_playable: !!row.is_playable,
    preview_url: row.preview_url,
    external_urls: getExternalUrls("track", row.id),
    album: getSimplifiedAlbum(row.album_id),
    artists: mapTrackArtistsByRole(row.id)
  }
}

export function fetchAllTrackSlugs(): string[] {
  return getDb()
    .prepare(`SELECT slug FROM tracks`)
    .all()
    .map((r) => (r as { slug: string }).slug)
}

export function searchTracks(query: Partial<Pick<TocTrackObject, "slug" | "name" | "name_en">>, expand?: false): TocTrackObject[]
export function searchTracks(query: Partial<Pick<TocTrackObject, "slug" | "name" | "name_en">>, expand: true): ExpandedTrackObject[]
export function searchTracks(query: Partial<Pick<TocTrackObject, "slug" | "name" | "name_en">>, expand?: boolean) {
  const keys = Object.keys(query) as (keyof typeof query)[]
  const where = keys.length
    ? `WHERE ${keys.map((key) => `t.${String(key)} = @${String(key)}`).join(" AND ")}`
    : ""
  const rows = getDb()
    .prepare(`SELECT t.slug, t.name, t.name_en, t.lyrics, t.album_id FROM tracks t ${where}`)
    .all(query as Record<string, unknown>) as {
      slug: string
      name: string
      name_en: string | null
      lyrics: string | null
      album_id: number
    }[]

  const matches: TocTrackObject[] = rows.map((row) => ({
    slug: row.slug,
    name: row.name,
    name_en: row.name_en,
    lyrics: row.lyrics,
    album: getTocAlbumRef(row.album_id)
  }))

  return expand ? matches.map((match) => fetchExpandedTrack(match.slug)) : matches
}

export function fetchAllTracksToc(): TocTrackObject[] {
  return searchTracks({})
}
