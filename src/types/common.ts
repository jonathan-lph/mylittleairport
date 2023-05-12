export type ImageObject = {
  url: string
  height: number | null
  width: number | null
}

export enum ResourceType {
  ALBUM = "album",
  TRACK = "track",
  ARTIST = "artist"
}

export enum ExternalUrlOrigin {
  OFFICIAL = "official",
  APPLE_MUSIC = "apple_music",
  JOOX = "joox",
  KKBOX = "kkbox",
  MOOV = "moov",
  SPOTIFY = "spotify",
  YOUTUBE = "youtube",
  YOUTUBE_MUSIC = "youtube_music"
}

export enum ExternalSocialUrlOrigin {
  FACEBOOK = "facebook",
  INSTAGRAM = "instagram",
  WEIBO = "weibo"
}

export enum DatePrecision {
  YEAR = "year",
  MONTH = "month",
  DAY = "day"
}