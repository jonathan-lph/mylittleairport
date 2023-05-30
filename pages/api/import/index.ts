import fs from 'fs/promises'
import mongoosePromise from '@lib/mongoose'
import { AlbumModel, ArtistModel, TrackModel } from '@database/models'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { HydratedDocument } from 'mongoose'
import type { ArtistObject } from '@__types/Artist'
import type { DbAlbumObject, ExportedAlbumObject } from '@__types/Album'
import type { DbTrackObject, ExportedTrackObject } from '@__types/Track'

mongoosePromise

export default async function importAllTracks(
  req: NextApiRequest,
  res: NextApiResponse
) {

  // Import artists
  const artistDir = await fs.readdir('src/__data/artists')
  const artistArr = artistDir.map((file) =>
    require(`src/__data/artists/${file}`)
  )
  const artists: HydratedDocument<ArtistObject>[] = await ArtistModel.insertMany(artistArr)

  // Import albums, with artists _id
  const albumDir = await fs.readdir('src/__data/albums')
  const albumArr: DbAlbumObject[] = albumDir.map((file) => {
    const album: ExportedAlbumObject = require(`src/__data/albums/${file}`)
    return {
      ...album,
      tracks: [],
      artists: album.artists.map(
        (artist) => artists.find((_artist) => _artist.slug === artist.slug)!._id
      ),
    }
  })
  const albums: HydratedDocument<DbAlbumObject>[] = await AlbumModel.insertMany(
    albumArr
  )

  // Import tracks, with albums and artists _id
  const trackDir = await fs.readdir('src/__data/tracks')
  const trackArr = trackDir.map((file) => {
    const track: ExportedTrackObject = require(`src/__data/tracks/${file}`)
    let injectedTrack: DbTrackObject = {
      ...track,
      album: albums.find((_album) => _album.slug === track.album.slug)!._id,
      artists: track.artists.map((_role) => ({
        role: _role.role,
        members: _role.members.map(
          (_member) =>
            artists.find((_artist) => _artist.slug === _member.slug)!._id
        ),
      })),
    }
    return injectedTrack
  })
  const tracks: HydratedDocument<DbTrackObject>[] = await TrackModel.insertMany(
    trackArr
  )

  // Inject tracks _id into albums
  const promises = albums.map(
    async (album) =>
      await AlbumModel.findOneAndUpdate(
        { _id: album._id },
        {
          tracks: tracks
            .filter((_track) => _track.album === album._id)
            .sort((a, b) => a.track_number - b.track_number)
            .map((_track) => _track._id),
        }
      )
  )
  await Promise.all(promises)

  // Resolve
  res.status(200).json('Done')
  
}
