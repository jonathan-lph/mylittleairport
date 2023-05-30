import fs from 'fs/promises'
import mongoosePromise from '@lib/mongoose'
import { ArtistModel } from '@database/models'

import type { NextApiRequest, NextApiResponse } from 'next'

mongoosePromise

export default async function importAllArtists(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const dir = await fs.readdir('src/__data/artists')
  const artists = dir.map((file) =>
    require(`src/__data/artists/${file}`))
  const _res = await ArtistModel.insertMany(artists)
  res.status(200).json(_res)
}