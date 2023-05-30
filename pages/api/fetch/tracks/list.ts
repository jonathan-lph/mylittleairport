import mongoosePromise from '@lib/mongoose'
import { TrackModel } from '@database/models'
import type { NextApiRequest, NextApiResponse } from 'next'

mongoosePromise

export default async function getAlbums(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const tracks = await TrackModel
    .find()
    .select('-_id slug name')
    .populate('album', '-_id slug name')
    .exec()

  res.status(200).json(tracks)
}