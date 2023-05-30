import fs from 'fs/promises'
import mongoosePromise from '@lib/mongoose'
import { AlbumModel } from '@database/models'

import type { ExportedAlbumObject } from '@__types/Album'
import type { NextApiRequest, NextApiResponse } from 'next'

mongoosePromise

export default async function importAllAlbums(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const dir = await fs.readdir('src/__data/albums')
  const albums = dir.map((file) => {
    const album : ExportedAlbumObject = require(`src/__data/albums/${file}`)
    album.tracks = []
    album.artists = []
    return album
  })
  const _res = await AlbumModel.insertMany(albums)
  res.status(200).json(_res)
}