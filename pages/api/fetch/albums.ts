import mongoosePromise from '@lib/mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'
import { AlbumModel, TrackModel } from 'models'

mongoosePromise

export default async function getAlbums(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const albums = await AlbumModel
    .find()
    .populate('tracks', '-has_lyrics -lyrics -album -artists -__v')
    .populate('artists', '-external_social_urls -images -__v')
    .exec()

  res.status(200).json(albums)
}