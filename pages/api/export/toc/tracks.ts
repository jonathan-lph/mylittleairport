import mongoosePromise from '@lib/mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'
import { AlbumModel, TrackModel } from 'models'
import fs from "fs"

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

  fs.writeFileSync(`_data/toc/tracks.json`, JSON.stringify(tracks), 'utf-8')

  res.status(200).json(tracks)
}