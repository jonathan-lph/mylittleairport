import mongoosePromise from '@lib/mongoose'
import { ResourceType } from '@src/types/common'
import type { NextApiRequest, NextApiResponse } from 'next'
import tracks from '@assets/archive/tracks.json'
import { AlbumModel, ArtistModel, TrackModel } from '@database/models'
import { HydratedDocument } from 'mongoose'
import { AlbumObject } from '@src/types/Album'
import crypto from 'crypto'
import { ArtistObject } from '@src/types/Artist'
import { TrackArtist, TrackArtistRole } from '@src/types/Track'
import { TrackCreditsCategory } from '@src/assets/archive/mla'

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
        albums.find(a => a.name === (album.name.endsWith(' (Live)') ? album.name.slice(0, -7) : album.name))!
      const randomBytes = getRandomBytes()
      const _artists = Object
        .entries(track.credits)
        .flatMap(([role, names]) => {
          if (names === null || names.length === 0) return null;
          return {
            role: convertRole(role as unknown as TrackCreditsCategory),
            members: names
              .map((name: string | null) => {
                if (name === null || name === '') return null
                return artists.find(a => a.name === name)!._id
              })
              .filter((a: string | null) => a !== null)
          }
        })
        .filter(a => a !== null)
      const isLive = track.name.endsWith(' - Live')
      const _slug = !isLive ? track.slug : track.slug.replace(/-live.*/, '')
      return {
        slug: `${_slug}-${randomBytes}`,
        name: !isLive ? track.name : track.name.slice(0, -7),
        name_en: !isLive ? track.translation.en.name : track.translation.en.name.slice(0, -7),
        href: `/track/${_slug}-${randomBytes}`,
        disc_number: album.disc,
        track_number: album.track,
        duration_s: track.duration,
        has_lyrics: track.lyrics !== null,
        lyrics: track.lyrics?.join('\n'),
        album: _album._id,
        artists: _artists,
        genres: [],
        is_live: isLive,
        is_playable: false,
        preview_url: null,
        external_urls: {}
      }
    })
  )

  const _res = TrackModel.insertMany(arr)

  res.status(200).json(_res)
}