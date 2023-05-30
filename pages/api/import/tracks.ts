import fs from 'fs/promises'
import mongoosePromise from '@lib/mongoose'
import { AlbumModel, ArtistModel, TrackModel } from '@database/models'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { HydratedDocument } from 'mongoose'
import type { AlbumObject } from '@__types/Album'
import type { ArtistObject } from '@__types/Artist'
import type { DbTrackObject, ExportedTrackObject } from '@__types/Track'

mongoosePromise

export default async function importAllTracks(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const albums: HydratedDocument<AlbumObject>[] = await AlbumModel.find().exec()
  const artists: HydratedDocument<ArtistObject>[] =
    await ArtistModel.find().exec()

  if (albums.length === 0 || artists.length === 0)
    res.status(400).json('Import albums and artists before importing tracks.')

  const dir = await fs.readdir('src/__data/tracks')
  const tracks = dir.map((file) => {
    const track: ExportedTrackObject = require(`src/__data/tracks/${file}`)
    let injectedTrack: DbTrackObject = {
      ...track,
      album: albums.find((_album) => _album.slug === track.album.slug)!._id,
      artists: track.artists.map((_role) => ({
        role: _role.role,
        members: _role.members.map((_member) =>
          artists.find((_artist) => _artist.slug === _member.slug)!._id),
      })),
    }
    return injectedTrack
  })
  const _res = await TrackModel.insertMany(tracks)
  res.status(200).json(_res)
}
