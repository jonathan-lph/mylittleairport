import { writeFileSync } from 'fs'
import mongoosePromise from '@lib/mongoose'
import { ArtistModel } from '@database/models'
import type { NextApiRequest, NextApiResponse } from 'next'

mongoosePromise

export default async function exportAlbums(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const artists = await ArtistModel
    .find()
    .select('-_id -__v -images._id -external_urls._id -external_social_urls._id')
    .exec()

  for (let artist of artists) {
    writeFileSync(
      `src/__data/artists/${artist.slug}.json`, 
      JSON.stringify(artist, null, 2), 
      'utf-8'
    )
  }

  res.status(200).json(artists)
}