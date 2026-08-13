import { getDb } from "./client"
import { ResourceType } from "@__types/common"

import type { ImageObject, ExternalUrlOrigin, DatePrecision } from "@__types/common"
import type { AlbumObject, AlbumType, EditionType } from "@__types/Album"
import type { SimplifiedAlbumObject } from "@__types/Album"
import type { SimplifiedArtistObject } from "@__types/Artist"
import type { SimplifiedTrackObject, TrackArtistRole } from "@__types/Track"

export type AlbumRow = {
  id: number
  slug: string
  name: string
  name_en: string | null
  album_type: string
  album_edition: string
  label: string
  label_en: string | null
  release_date: string
  release_date_precision: string
  is_live: number
}

type TrackRow = {
  id: number
  slug: string
  name: string
  name_en: string | null
  album_id: number
  disc_number: number
  track_number: number
  duration_s: number | null
  has_lyrics: number
  lyrics: string | null
  is_live: number
  is_playable: number
  preview_url: string | null
}

export function getImages(
  table: "album_images" | "artist_images",
  idColumn: "album_id" | "artist_id",
  entityId: number
): ImageObject[] {
  return getDb()
    .prepare(`SELECT url, type, height, width FROM ${table} WHERE ${idColumn} = ? ORDER BY position`)
    .all(entityId) as ImageObject[]
}

export function getExternalUrls(
  entityType: "album" | "track" | "artist",
  entityId: number
): Record<ExternalUrlOrigin, string> {
  const rows = getDb()
    .prepare(`SELECT origin, url FROM external_urls WHERE entity_type = ? AND entity_id = ?`)
    .all(entityType, entityId) as { origin: ExternalUrlOrigin, url: string }[]
  return Object.fromEntries(rows.map((r) => [r.origin, r.url])) as Record<ExternalUrlOrigin, string>
}

export function getExternalSocialUrls(artistId: number) {
  const rows = getDb()
    .prepare(`SELECT origin, url FROM external_social_urls WHERE artist_id = ?`)
    .all(artistId) as { origin: string, url: string }[]
  return Object.fromEntries(rows.map((r) => [r.origin, r.url]))
}

export function getGenres(
  table: "album_genres" | "track_genres",
  idColumn: "album_id" | "track_id",
  entityId: number
): string[] {
  return getDb()
    .prepare(`
      SELECT g.name AS name FROM ${table} j
      JOIN genres g ON g.id = j.genre_id
      WHERE j.${idColumn} = ?
    `)
    .all(entityId)
    .map((r) => (r as { name: string }).name)
}

export function getArtistAliases(artistId: number): string[] {
  return getDb()
    .prepare(`SELECT alias FROM artist_aliases WHERE artist_id = ? ORDER BY position`)
    .all(artistId)
    .map((r) => (r as { alias: string }).alias)
}

export function getAlbumRowBySlug(slug: string): AlbumRow | undefined {
  return getDb().prepare(`SELECT * FROM albums WHERE slug = ?`).get(slug) as AlbumRow | undefined
}

export function getTrackRowBySlug(slug: string): TrackRow | undefined {
  return getDb().prepare(`SELECT * FROM tracks WHERE slug = ?`).get(slug) as TrackRow | undefined
}

export function getAlbumTrackIds(albumId: number): number[] {
  return getDb()
    .prepare(`SELECT id FROM tracks WHERE album_id = ? ORDER BY disc_number, track_number`)
    .all(albumId)
    .map((r) => (r as { id: number }).id)
}

export function getAlbumArtistIds(albumId: number): number[] {
  return getDb()
    .prepare(`SELECT artist_id FROM album_artists WHERE album_id = ? ORDER BY position`)
    .all(albumId)
    .map((r) => (r as { artist_id: number }).artist_id)
}

function mapAlbumBase(row: AlbumRow, totalTracks: number) {
  return {
    type: ResourceType.ALBUM as ResourceType.ALBUM,
    slug: row.slug,
    name: row.name,
    // AlbumObject.name_en is typed non-nullable (unlike Track/Artist); the
    // SQLite column is nullable TEXT, but no album row has ever had null here.
    name_en: row.name_en as string,
    href: `/album/${row.slug}`,
    total_tracks: totalTracks,
    album_type: row.album_type as AlbumType,
    album_edition: row.album_edition as EditionType,
    label: row.label,
    label_en: row.label_en,
    release_date: row.release_date,
    release_date_precision: row.release_date_precision as DatePrecision,
    is_live: !!row.is_live
  }
}

export function getSimplifiedTrack(trackId: number): SimplifiedTrackObject {
  const row = getDb().prepare(`
    SELECT slug, name, name_en, disc_number, track_number, duration_s, is_live, is_playable, preview_url
    FROM tracks WHERE id = ?
  `).get(trackId) as Omit<TrackRow, "id" | "album_id" | "has_lyrics" | "lyrics">

  return {
    type: ResourceType.TRACK,
    slug: row.slug,
    name: row.name,
    name_en: row.name_en,
    href: `/track/${row.slug}`,
    disc_number: row.disc_number,
    track_number: row.track_number,
    duration_s: row.duration_s,
    genres: getGenres("track_genres", "track_id", trackId),
    is_live: !!row.is_live,
    is_playable: !!row.is_playable,
    preview_url: row.preview_url,
    external_urls: getExternalUrls("track", trackId)
  }
}

export function getSimplifiedArtist(artistId: number): SimplifiedArtistObject {
  const row = getDb()
    .prepare(`SELECT slug, name, name_en FROM artists WHERE id = ?`)
    .get(artistId) as { slug: string, name: string, name_en: string | null }

  return {
    type: ResourceType.ARTIST,
    slug: row.slug,
    name: row.name,
    name_en: row.name_en,
    href: `/artist/${row.slug}`,
    alias: getArtistAliases(artistId),
    external_urls: getExternalUrls("artist", artistId)
  }
}

export function getSimplifiedAlbum(albumId: number): SimplifiedAlbumObject {
  const row = getDb().prepare(`SELECT * FROM albums WHERE id = ?`).get(albumId) as AlbumRow
  const trackIds = getAlbumTrackIds(albumId)

  return {
    ...mapAlbumBase(row, trackIds.length),
    images: getImages("album_images", "album_id", albumId),
    external_urls: getExternalUrls("album", albumId),
    tracks: trackIds.map(getSimplifiedTrack)
  }
}

export function mapFullAlbum(row: AlbumRow): AlbumObject {
  const trackSlugs = getDb()
    .prepare(`SELECT slug FROM tracks WHERE album_id = ? ORDER BY disc_number, track_number`)
    .all(row.id)
    .map((r) => (r as { slug: string }).slug)
  const artistSlugs = getDb()
    .prepare(`
      SELECT a.slug FROM album_artists aa
      JOIN artists a ON a.id = aa.artist_id
      WHERE aa.album_id = ? ORDER BY aa.position
    `)
    .all(row.id)
    .map((r) => (r as { slug: string }).slug)

  return {
    ...mapAlbumBase(row, trackSlugs.length),
    artists: artistSlugs,
    tracks: trackSlugs,
    images: getImages("album_images", "album_id", row.id),
    genres: getGenres("album_genres", "album_id", row.id),
    external_urls: getExternalUrls("album", row.id)
  }
}

export function mapTrackArtistsByRole(trackId: number) {
  const roleRows = getDb()
    .prepare(`SELECT rowid, role, artist_id FROM track_artists WHERE track_id = ? ORDER BY rowid`)
    .all(trackId) as { rowid: number, role: TrackArtistRole, artist_id: number }[]

  const roles: { role: TrackArtistRole, members: SimplifiedArtistObject[] }[] = []
  const roleIndex = new Map<TrackArtistRole, number>()

  for (const { role, artist_id } of roleRows) {
    let index = roleIndex.get(role)
    if (index === undefined) {
      index = roles.length
      roles.push({ role, members: [] })
      roleIndex.set(role, index)
    }
    roles[index].members.push(getSimplifiedArtist(artist_id))
  }

  return roles
}

export function getTocAlbumRef(albumId: number) {
  const row = getDb()
    .prepare(`SELECT slug, name, name_en FROM albums WHERE id = ?`)
    .get(albumId) as { slug: string, name: string, name_en: string | null }

  return {
    slug: row.slug,
    name: row.name,
    // see mapAlbumBase: AlbumObject.name_en is non-nullable, unlike Track/Artist
    name_en: row.name_en as string,
    images: getImages("album_images", "album_id", albumId)
  }
}
