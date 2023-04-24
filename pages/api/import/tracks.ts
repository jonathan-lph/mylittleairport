import mongoosePromise from '@lib/mongoose'
import { ResourceType } from '@src/common/asset/types/common'
import type { NextApiRequest, NextApiResponse } from 'next'
import tracks from '@common/asset/tracks.json'
import { AlbumModel, ArtistModel, TrackModel } from 'models'
import { HydratedDocument } from 'mongoose'
import { AlbumObject } from '@src/common/asset/types/Album'
import crypto from 'crypto'
import { ArtistObject } from '@src/common/asset/types/Artist'
import { TrackArtist, TrackArtistRole } from '@src/common/asset/types/Track'
import { TrackCreditsCategory } from '@src/common/asset/mla'

mongoosePromise

const getRandomBytes = (length: number = 6) => {
  const allowedCharacters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  return Array
    .from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => allowedCharacters[x % allowedCharacters.length])
    .join('')
}

const convertRole = (oldRoleName: TrackCreditsCategory) => {
  switch (oldRoleName) {
    case "composer": return TrackArtistRole.COMPOSER
    case "lyricist": return TrackArtistRole.LYRICIST
    case "arranger": return TrackArtistRole.ARRANGER
    case "lead_vocal": return TrackArtistRole.LEAD_VOCAL
    case "backup_vocal": return TrackArtistRole.BACKUP_VOCAL
    case "poem": return TrackArtistRole.POET
    case "recite": return TrackArtistRole.RECITER
    case "bass": return TrackArtistRole.BASS
    default: return TrackArtistRole.OTHER
  }
}

export default async function importAllTracks(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const albums: HydratedDocument<AlbumObject>[] = await AlbumModel.find().exec()
  const artists: HydratedDocument<ArtistObject>[] = await ArtistModel.find().exec()

  const arr = tracks.flatMap(track =>
    track.album.map(album => {
      const _album : HydratedDocument<AlbumObject> = 
        albums.find(a => a.name === album.name)!
      const randomBytes = getRandomBytes()
      const _artists = Object
        .entries(track.credits)
        .flatMap(([role, names]) => {
          if (names === null || names.length === 0) return null;
          return {
            role: convertRole(role as unknown as TrackCreditsCategory),
            artist: names
              .map((name: string | null) => {
                if (name === null || name === '') return null
                return artists.find(a => a.name === name)!._id
              })
              .filter((a: string | null) => a !== null)
          }
        })
        .filter(a => a !== null)
      return {
        slug: `${track.slug}-${randomBytes}`,
        name: track.name,
        name_en: track.translation.en.name,
        href: `/track/${track.slug}-${randomBytes}`,
        disc_number: album.disc,
        track_number: album.track,
        duration_s: track.duration,
        has_lyrics: track.lyrics !== null,
        lyrics: track.lyrics?.join('/n'),
        album: _album._id,
        artists: _artists,
        genres: [],
        is_playable: false,
        preview_url: null,
        external_urls: {}
      }
    })
  )

  const _res = TrackModel.insertMany(arr)
  // const albums: HydratedDocument<AlbumObject>[] = await AlbumModel.find().exec()

  // const arr = tracks.flatMap(track =>
  //   track.album.map(album => {
  //     const _album : HydratedDocument<AlbumObject> = 
  //       albums.find(a => a.name === album.name)!
  //     const randomBytes = getRandomBytes()
  //     return {
  //       slug: `${track.slug}-${randomBytes}`,
  //       name: track.name,
  //       name_en: track.translation.en.name,
  //       href: `/track/${track.slug}-${randomBytes}`,
  //       disc_number: album.disc,
  //       track_number: album.track,
  //       duration_s: track.duration,
  //       has_lyrics: track.lyrics !== null,
  //       lyrics: track.lyrics?.join('/n'),
  //       album: _album._id,
  //       artists: [],
  //       genres: [],
  //       is_playable: false,
  //       preview_url: null,
  //       external_urls: {}
  //     }
  //   })
  // )

  // const _res = TrackModel.insertMany(arr)

  res.status(200).json(_res)
}