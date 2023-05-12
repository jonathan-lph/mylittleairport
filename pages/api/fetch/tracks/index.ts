import mongoosePromise from '@lib/mongoose'
import { TrackModel } from '@database/models'
import type { NextApiRequest, NextApiResponse } from 'next'

mongoosePromise

export default async function getAlbums(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const albums = await TrackModel
    .findOne()
    .populate({
      path: 'album',
      select: '-artists -genres -__v',
      populate: {
        path: 'tracks',
        select: '-has_lyrics -lyrics -album -artists -__v'
      }
    })
    .populate({
      path: 'artists',
      populate: {
        path: 'members',
        select: '-external_social_urls -images -__v'
      }
    })
    .exec()

  res.status(200).json(albums)
}