import mongoosePromise from '@lib/mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'
import { AlbumModel, TrackModel } from 'models'
import fs from "fs"

mongoosePromise

export default async function exportTracks(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const tracks = await TrackModel
    .find()
    .select('-_id -artists._id -__v')
    .populate({
      path: 'album',
      select: '-_id slug name name_en',
    })
    .populate({
      path: 'artists.members',
      select: '-_id slug name name_en'
    })
    .exec()

  for (let track of tracks) {
    fs.mkdirSync(`_data/tracks/${track.album.slug}`, {recursive: true})
    fs.writeFileSync(
      `_data/tracks/${track.album.slug}/${track.slug}.json`, 
      JSON.stringify(track, null, 2),
      'utf-8'
    )
  }

  if (!tracks) return res.status(200).json('None.')
  res.status(200).json(tracks)
}