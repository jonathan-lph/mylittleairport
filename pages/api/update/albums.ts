import mongoosePromise from '@lib/mongoose'
import { AlbumModel, TrackModel } from '@database/models'
import type { NextApiRequest, NextApiResponse } from 'next'
import { HydratedDocument } from 'mongoose'
import { AlbumObject } from '@__types/Album'
import is from "image-size"

mongoosePromise

export default async function getAlbums(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const albums : HydratedDocument<AlbumObject>[] = await AlbumModel.find().exec()

  const promises = albums.map(album => new Promise((res, rej) => {
    const _slug = album.slug.slice(0, -7)
    const jpg = is(`public/album-artwork/${_slug}.jpg`)
    const webp = is(`public/album-artwork/${_slug}.webp`)
    return res(AlbumModel.findOneAndUpdate({
      _id: album.id
    }, {
      images: [{
        url: `/album-artwork/${_slug}.webp`,
        type: 'webp',
        height: webp.height ?? null,
        width: webp.width ?? null,
      }, {
        url: `/album-artwork/${_slug}.jpg`,
        type: 'jpg',
        height: jpg.height ?? null,
        width: jpg.width ?? null,
      }]
    }).exec())
  }))

  const _res = await Promise.all(promises)
  

  res.status(200).json(_res)
}