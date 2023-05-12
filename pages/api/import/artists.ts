import mongoosePromise from '@lib/mongoose'
import { ResourceType } from '@src/types/common'
import type { NextApiRequest, NextApiResponse } from 'next'
import tracks from '@assets/archive/tracks.json'
import { AlbumModel, ArtistModel, TrackModel } from '@database/models'
import { HydratedDocument } from 'mongoose'
import { AlbumObject } from '@src/types/Album'
import crypto from 'crypto'

mongoosePromise

const getRandomBytes = (length: number = 6) => {
  const allowedCharacters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  return Array
    .from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => allowedCharacters[x % allowedCharacters.length])
    .join('')
}

const slugify = (str: string) => {
  str = str.trim();
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from = "ｋｄｐ２åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
  const to   = "kdp2aaaaaaeeeeiiiioooouuuunc------";

  for (let i = 0; i < from.length; i++)
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));

  return str
    .replace(/[^a-z0-9_\u3400-\u9FBF\uFF0C -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g,  "-") // collapse dashes
    .replace(/^-+/,  "")  // trim - from start of text
    .replace(/-+$/,  "")  // trim - from end of text
    .replace(/\uFF0C/g, "-"); // replace ，
}

export default async function importAllArtists(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const artistNames = new Set(
    tracks.flatMap(track =>
      Object.values(track.credits)
    ).flat()
  )
  const artistNamesArr = Array.from(artistNames).filter(a => a !== null && a !== "")
  const arr = artistNamesArr.map(name => {
    const slug = slugify(name)
    const randomBytes = getRandomBytes()
    return {
      slug: `${slug}-${randomBytes}`,
      name: name,
      name_en: null,
      alias: [],
      href: `/artist/${slug}-${randomBytes}`,
      images: [],
      external_urls: {},
      external_social_urls: {}
    }
  })

  const _res = ArtistModel.insertMany(arr)

  res.status(200).json(_res)
}