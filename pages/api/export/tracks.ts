import { mkdirSync, writeFileSync } from 'fs'
import mongoosePromise from '@lib/mongoose'
import { TrackModel } from '@database/models'
import type { NextApiRequest, NextApiResponse } from 'next'

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
    // mkdirSync(`src/__data/tracks/${track.album.slug}`, {recursive: true})
    writeFileSync(
      `src/__data/tracks/${track.slug}.json`,
      JSON.stringify(track, null, 2),
      'utf-8'
    )
  }

  if (!tracks) return res.status(200).json('None.')
  res.status(200).json(tracks)
}