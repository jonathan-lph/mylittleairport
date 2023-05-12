import { AlbumObject, SimplifiedAlbumObject } from "./Album"
import { ArtistObject, SimplifiedArtistObject } from "./Artist"
import {
  ExternalUrlOrigin,
  ResourceType
} from "./common"

export interface TrackObject {
  type: ResourceType.TRACK
  slug: string
  name: string
  name_en: string | null

  href: string
  disc_number: number
  track_number: number
  duration_s: number | null

  has_lyrics: boolean
  lyrics: string | null
  album: string // ref
  artists: TrackArtist[]
  genres: string[]

  is_live: boolean
  is_playable: boolean
  preview_url: string | null
  external_urls: Record<ExternalUrlOrigin, string>
}

export interface TocTrackObject extends Pick<TrackObject,
  | 'slug'
  | 'name'
  | 'name_en'
  | 'lyrics'
> {
  album: Pick<AlbumObject, 
    | 'slug'
    | 'name'
    | 'name_en'
    | 'images'
  >
}

export interface SimplifiedTrackObject extends Omit<TrackObject,
  | 'has_lyrics'
  | 'lyrics'
  | 'album'
  | 'artists'
> { }

export interface ExpandedTrackObject extends Omit<TrackObject,
  | 'album'
  | 'artists'
> {
  album: SimplifiedAlbumObject
  artists: ExpandedTrackArtist[]
}

export interface ExportedTrackObject extends Omit<TrackObject,
  | 'album'
  | 'artists'
> {
  album: Pick<AlbumObject, 'slug' | 'name' | 'name_en'>[]
  artists: ExportedTrackArtist[]
}

export type TrackArtist = {
  role: TrackArtistRole
  members: string[] // ref
}

export type ExpandedTrackArtist = Omit<TrackArtist,
  | 'members'
> & {
  members: SimplifiedArtistObject[]
}

export type ExportedTrackArtist = Omit<TrackArtist,
  | 'members'
> & {
  members: Pick<ArtistObject, 'slug' | 'name' | 'name_en'>[]
}

export enum TrackArtistRole {
  COMPOSER = "composer",
  LYRICIST = "lyricist",
  ARRANGER = "arranger",
  LEAD_VOCAL = "lead_vocal",
  POET = "poet",
  RECITER = "reciter",
  BACKUP_VOCAL = "backup_vocal",
  BASS = "bass",
  OTHER = "other"
}