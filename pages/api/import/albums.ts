import mongoosePromise from '@lib/mongoose'
import { ExternalUrlOrigin, ResourceType } from '@src/common/asset/types/common'
import TrackModel from 'models/Track.model'
import type { NextApiRequest, NextApiResponse } from 'next'
import albums from '@common/asset/albums.json'
import AlbumModel from 'models/Album.model'
import { AlbumEdition, AlbumType, AlbumObject } from '@src/common/asset/types/Album'
import { DatePrecision } from '@src/common/asset/types/common'
import is from 'image-size'
import { HydratedDocument } from 'mongoose'
import crypto from 'crypto'

mongoosePromise

const getEdition = (old : string) => {
  switch (old) {
    case "retail": return AlbumEdition.RETAIL
    case "limited": return AlbumEdition.LIMITED
    case "online": return AlbumEdition.ONLINE
    case "collaboration": return AlbumEdition.COLLABORATION
    case "published": return AlbumEdition.PUBLISHED
    case "public": return AlbumEdition.PUBLIC
    case "unlisted": return AlbumEdition.UNLISTED
    case "hk": return AlbumEdition.HK
    case "tw": return AlbumEdition.TW
    case "international": return AlbumEdition.INTL
    default: return AlbumEdition.HK
  }
}

const getRandomBytes = (length: number = 6) => {
  const allowedCharacters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  return Array
    .from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => allowedCharacters[x % allowedCharacters.length])
    .join('')
}

export default async function importAllAlbums(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const promises = albums.map(album => {
    const randomBytes = getRandomBytes()
    const img = is(`public/album-artwork/${_slug}.jpg`)
    const newAlbum: HydratedDocument<AlbumObject> = new AlbumModel({
      type: ResourceType.ALBUM,
      slug: `${album.slug}-${randomBytes}`,
      name: album.name,
      name_en: album.translation.en.name,
      href: `/album/${album.slug}-${randomBytes}`,
      total_tracks: album.track_no,
      // @ts-ignore
      album_type: album.type as AlbumType,
      // @ts-ignore
      album_edition: getEdition(album.edition),
      label: album.label,
      label_en: album.translation.en.label ?? null,
      release_date: album.date.toString(),
      release_date_precision: DatePrecision.YEAR,
      artists: [],
      tracks: [],
      images: [{
        url: `/album-artwork/${album.slug}.jpg`,
        height: img.height ?? null,
        width: img.width ?? null,
      }],
      genres: [],
      external_urls: {} as Record<ExternalUrlOrigin, string>
    })
    return newAlbum.save()
  })
  const _res = await Promise.all(promises)

  res.status(200).json(_res)
}