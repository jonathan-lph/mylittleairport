import { writeFileSync } from "fs"
import mongoosePromise from '@lib/mongoose'
import { AlbumModel } from '@database/models'
import type { NextApiRequest, NextApiResponse } from 'next'

mongoosePromise

export default async function exportAlbumList(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const albums = await AlbumModel
    .find()
    .select('-_id slug name name_en')
    .exec()

  writeFileSync(
    `src/__data/toc/albums.json`, 
    JSON.stringify(albums, null, 2), 
    'utf-8'
  )

  res.status(200).json(albums)
}