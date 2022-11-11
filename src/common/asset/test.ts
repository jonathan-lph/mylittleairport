export enum AlbumType {
  ALBUM = "album",
  SINGLE = "single",
  COMPILATION = "compilation"
}

export enum AlbumCategory {
  EP = "ep",
  LIVE = "live",
  COLLABORATION = "collaboration",
  ONLINE = "online",
}

export enum ObjectType {
  ALBUM = "album",
  SONG = "song",
  ARTIST = "artist",
  JUNCTION = "junction"
}

export enum SupportedLocales {
  ENGLISH = 'en',
  CHINESE = 'zh',
}

export type ExternalUrls = {
  official: string,
  youtube: string,
  youtube_music: string,
  spotify: string,
  apple_music: string,
  joox: string,
  kkbox: string,
  moov: string,
}

export type ExternalSocialUrls = {
  facebook: string,
  instagram: string,
  weibo: string,
}

export type Album = {
  id: string,
  // slug: string,
  type: ObjectType.ALBUM,
  name: string,
  release_date: string,
  external_urls: ExternalUrls
  album_type: AlbumType,
  album_category: AlbumCategory,
  track_count: number,
  // href: string,
  artwork: string, // URL
  record_label: string,
  copyright: string,
  editorial_notes: string | null,
  country: string,
  localization: Partial<Record<
    SupportedLocales, 
    {
      name: string,
      recordLabel: string,
      copyright: string,
      editorial_notes: string | null,
    }
  >>
}

export type Song = {
  id: string,
  // slug: string,
  type: ObjectType.SONG,
  name: string,
  release_date: string,
  external_urls: ExternalUrls,
  lyrics: string,
  duration_s: number,
  editorial_notes: string | null,
  localization: Partial<Record<
    SupportedLocales, 
    {
      name: string,
      lyrics: string,
      editorial_notes: string | null,
    }
  >>
}

export type Artist = {
  id: string,
  type: ObjectType.ARTIST,
  name: string,
  nickname: string[],
  image: string, // URL
  externalUrls: ExternalSocialUrls,
}

export type AlbumSongRelationship = {
  id: string,
  song_id: string,
  album_id: string,
  disc_number: number,
  track_number: number
}

export type ArtistArtworkRelationship = {
  id: string,
  artist_id: string,
  roles: string
} & (
  | { song_id: string, album_id?: never }
  | { song_id?: never, album_id: string }
)

export type SongSongRelationship = {
  id: string,
  song1Id: string,
  song2Id: string,
  relationship: string,
}