import { writeFileSync } from "fs"
import mongoosePromise from '@lib/mongoose'
import { TrackModel } from '@database/models'
import type { NextApiRequest, NextApiResponse } from 'next'

mongoosePromise

export default async function exportTrackList(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const tracks = await TrackModel
    .find()
    .select('-_id slug name name_en lyrics')
    .populate('album', '-_id slug name name_en images.url images.height images.width')
    .exec()

  writeFileSync(
    `src/__data/toc/tracks.json`,
    JSON.stringify(tracks, null, 2),
    'utf-8'
  )

  res.status(200).json(tracks)
}