import {
  ExternalSocialUrlOrigin,
  ExternalUrlOrigin,
  ImageObject,
  ResourceType
} from "./common"

export interface ArtistObject {
  type: ResourceType.ARTIST
  href: string
  name: string
  name_en: string | null
  alias: string[]
  external_urls: Record<ExternalUrlOrigin, string>
  external_social_urls: Record<ExternalSocialUrlOrigin, string>
  images: ImageObject[]
}

export interface SimplifiedArtistObject extends Omit<ArtistObject,
  | 'external_social_urls'
  | 'images'
> { }