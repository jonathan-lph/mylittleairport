import { SimplifiedAlbumObject } from "./Album"
import { SimplifiedArtistObject } from "./Artist"
import {
  ExternalUrlOrigin,
  ResourceType
} from "./common"

export interface TrackObject {
  type: ResourceType.TRACK
  slug: string
  name: string
  nane_en: string | null

  href: string
  disc_number: number
  track_number: number
  duration_s: number | null

  has_lyrics: boolean
  lyrics: string | null
  album: string // ref
  artists: TrackArtist[]
  genres: string[]

  is_playable: boolean
  preview_url: string | null
  external_urls: Record<ExternalUrlOrigin, string>
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
  artists: ExpandedTrackArtist
}

export type TrackArtist = {
  role: TrackArtistRole
  artist: string[] // ref
}

export type ExpandedTrackArtist = Omit<TrackArtist,
  | 'artist'
> & {
  artist: SimplifiedArtistObject
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