import mongoosePromise from '@lib/mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'
import { AlbumModel, TrackModel } from 'models'
import fs from "fs"

mongoosePromise

export default async function exportAlbums(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const albums = await AlbumModel
    .find()
    .select('-_id -__v -images._id')
    .populate('tracks', 'slug name name_en -_id')
    .populate('artists', 'slug name name_en -_id')
    .exec()

  for (let album of albums) {
    fs.writeFileSync(
      `_data/albums/${album.slug}.json`, 
      JSON.stringify(album, null, 2), 
      'utf-8'
    )
  }

  res.status(200).json(albums)
}