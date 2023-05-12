import mongoosePromise from '@lib/mongoose'
import { ExternalUrlOrigin, ResourceType } from '@src/types/common'
import { AlbumModel } from '@database/models'
import type { NextApiRequest, NextApiResponse } from 'next'
import albums from '@assets/archive/albums.json'
import { AlbumEditionType, CompilationEditionType, SingleEditionType, AlbumType, AlbumObject } from '@src/types/Album'
import { DatePrecision } from '@src/types/common'
import is from 'image-size'
import { HydratedDocument } from 'mongoose'
import crypto from 'crypto'

mongoosePromise

const getEdition = (old : string) => {
  switch (old) {
    case "retail": return AlbumEditionType.RETAIL
    case "limited": return AlbumEditionType.LIMITED
    case "online": return AlbumEditionType.ONLINE
    case "collaboration": return AlbumEditionType.COLLABORATION
    case "published": return SingleEditionType.PUBLISHED
    case "public": return SingleEditionType.PUBLIC
    case "unlisted": return SingleEditionType.UNLISTED
    case "hk": return CompilationEditionType.HK
    case "tw": return CompilationEditionType.TW
    case "international": return CompilationEditionType.INTL
    default: return CompilationEditionType.HK
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
    const isLive = album.name.endsWith(' (Live)')
    const _slug = !isLive ? album.slug : album.slug.slice(0, -5)
    const img = is(`public/album-artwork/${_slug}.jpg`)
    const newAlbum: HydratedDocument<AlbumObject> = new AlbumModel({
      type: ResourceType.ALBUM,
      slug: `${_slug}-${randomBytes}`,
      name: !isLive ? album.name : album.name.slice(0, -7),
      name_en: !isLive ? album.translation.en.name : album.name.slice(0, -7),
      href: `/album/${_slug}-${randomBytes}`,
      total_tracks: album.track_no,
      // @ts-ignore
      album_type: album.type as AlbumType,
      // @ts-ignore
      album_edition: getEdition(album.edition),
      label: album.label,
      label_en: album.translation.en.label ?? null,
      release_date: album.date.toString(),
      release_date_precision: DatePrecision.YEAR,
      is_live: isLive,
      artists: [],
      tracks: [],
      images: [{
        url: `/album-artwork/${_slug}.jpg`,
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