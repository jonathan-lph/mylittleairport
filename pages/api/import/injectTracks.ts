import mongoosePromise from '@lib/mongoose'
import { ResourceType } from '@src/types/common'
import type { NextApiRequest, NextApiResponse } from 'next'
import tracks from '@assets/archive/tracks.json'
import { AlbumModel, TrackModel } from '@database/models'
import { HydratedDocument } from 'mongoose'
import { AlbumObject } from '@src/types/Album'
import crypto from 'crypto'
import { TrackObject } from '@src/types/Track'

mongoosePromise

export default async function injectTracks(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const albums: HydratedDocument<AlbumObject>[] = await AlbumModel.find().exec()
  const promises = albums.map(album => {
    return new Promise(async (acc, rej) => {
      const tracks: HydratedDocument<TrackObject>[] = 
        await TrackModel.find({ album: album._id }).exec()
      const ids = tracks.sort((a,b) => a.track_number - b.track_number).map(t => t._id)
      await AlbumModel.findOneAndUpdate({
        _id: album._id
      }, {
        tracks: ids
      })
      acc(null)
    })
  })

  await Promise.allSettled(promises)

  res.status(200).json('Done.')
}