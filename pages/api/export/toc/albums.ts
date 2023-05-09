import mongoosePromise from '@lib/mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'
import { AlbumModel, TrackModel } from 'models'
import fs from "fs"

mongoosePromise

export default async function exportAlbumList(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const albums = await AlbumModel
    .find()
    .select('-_id slug name name_en')
    .exec()

  fs.writeFileSync(`_data/toc/albums.json`, JSON.stringify(albums), 'utf-8')

  res.status(200).json(albums)
}