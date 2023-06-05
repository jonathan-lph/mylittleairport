import type { NextApiRequest, NextApiResponse } from 'next'
import tracksToc from '@src/__data/toc/tracks.json'
import albumsToc from '@src/__data/toc/albums.json'
import { Locales } from '@src/consts/definitions'
import metadata from '@consts/metadata.json'

function objToXml(obj: Record<string, any>) {
  let acc = ''
  Object.entries(obj).forEach(([prop, val]) => {
    acc += Array.isArray(val) ? '' : `<${prop}>`
    if (Array.isArray(val)) {
      for (let entry of val) {
        acc += `<${prop}>`
        acc += objToXml(entry)
        acc += `</${prop}>`
      }
    } else if (typeof val === 'object') {
      acc += objToXml(val)
    } else {
      acc += val
    }
    acc += Array.isArray(val) ? '' : `</${prop}>`
  })
  return acc
}

export default async function generateSitemap(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const currDate = new Date().toLocaleDateString('sv')
  const obj = Object.values(Locales).flatMap(locale => [
    {
      loc: `${metadata.base_url}/${locale}/albums`,
      lastmod: currDate
    }, {
      loc: `${metadata.base_url}/${locale}/tracks`,
      lastmod: currDate
    },
    ...albumsToc.map(album => ({
      loc: `${metadata.base_url}/${locale}/album/${album.slug}`,
      lastmod: currDate
    })),
    ...tracksToc.map(track => ({
      loc: `${metadata.base_url}/${locale}/track/${track.slug}`,
      lastmod: currDate
    }))
  ])

  // res.status(200).json(obj)
  res.status(200).json(
    '<?xml version="1.0" encoding="UTF-8"?>'+
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+
    objToXml({url: obj})+
    '</urlset>'
  )
}