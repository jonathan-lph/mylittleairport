export type TrackAlbumRef = {
  slug: string
  name: string
  track: number
  disc: number
}

export type TrackCreditsCategory = 
  "composer"
  | "lyricist"
  | "arranger"
  | "lead_vocal"
  | "poem"
  | "recite"
  | "backup_vocal"
  | "bass"

export type TrackCredits = Partial<
  Record<
    TrackCreditsCategory, 
    Array<string> | null 
  >
>

export type Track = {
  name: string,
  slug: string,
  album: Array<TrackAlbumRef>,
  duration: number,
  credits: TrackCredits,
  lyrics?: Array<string> | null,
  translation: any
}

export type AlbumType = 
  "album"
  | "single"
  | "compilation"

export type AlbumEdition = 
  "retail"
  | "limited"
  | "online"
  | "collaboration"
  | "published"  // Single - published
  | "public"     // Youtube
  | "unlisted"   // Youtube - unofficial
  | "hk"
  | "tw"
  | "international"

export type AlbumTrackRef = {
  name: string
  slug: string
  disc: number
  track: number
}

export type Album = {
  name: string,
  slug: string,
  date: number,
  type: string, // AlbumType
  edition: string | null,
  track_no: number,
  tracks: Array<AlbumTrackRef>,
  translation: any
}