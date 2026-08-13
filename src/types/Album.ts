import { SimplifiedArtistObject } from "./Artist"
import { SimplifiedTrackObject } from "./Track"
import {
  ImageObject,
  ResourceType,
  ExternalUrlOrigin,
  DatePrecision
} from "./common"

export interface AlbumObject {
  type: ResourceType.ALBUM
  slug: string
  name: string
  name_en: string | null

  href: string
  total_tracks: number
  album_type: AlbumType
  album_edition: EditionType
  label: string
  label_en: string | null
  release_date: string
  release_date_precision: DatePrecision
  is_live: boolean

  artists: string[] // ref[]
  tracks: string[] // ref[]
  images: ImageObject[]
  genres: string[]
  external_urls: Record<ExternalUrlOrigin, string>
}

export type TocAlbumObject = Pick<AlbumObject,
  | 'slug'
  | 'name'
  | 'name_en'
>

export interface SimplifiedAlbumObject extends Omit<AlbumObject,
  | 'artists'
  | 'genres'
  | 'tracks'
> {
  tracks: SimplifiedTrackObject[]
}

export interface ExpandedAlbumObject extends Omit<AlbumObject,
  | 'artists'
  | 'tracks'
> {
  artists: SimplifiedArtistObject[]
  tracks: SimplifiedTrackObject[]
}

export enum AlbumType {
  ALBUM = "album",
  SINGLE = "single",
  COMPILATION = "compilation"
}

export enum AlbumEditionType {
  RETAIL = "retail",
  LIMITED = "limited",
  ONLINE = "online",
  COLLABORATION = "collaboration"
}

export enum SingleEditionType {
  PUBLISHED = "published",
  /* From official Youtube channel */
  PUBLIC = "public",
  /* From unofficial Youtube channels */
  UNLISTED = "unlisted"
}

export enum CompilationEditionType {
  HK = "hong_kong",
  TW = "taiwan",
  INTL = "international"
}

export const EditionType = {
  ...AlbumEditionType,
  ...SingleEditionType,
  ...CompilationEditionType
} 

export type EditionType = AlbumEditionType | SingleEditionType | CompilationEditionType

