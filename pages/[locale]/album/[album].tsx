import Head from 'next/head'
import { AlbumInfo } from '@components/album/AlbumInfo'
import { fetchExpandedAlbumFromFiles } from '@database/album'
import metadata from '@consts/metadata.json'
import { Locales, locales } from '@consts/definitions'
import { mapMetaTags, injectObjectToString } from '@utils/index'
import translationJSON from '@translations/album.json'

import type { ExpandedAlbumObject, TocAlbumObject } from '@__types/Album'
import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import type { ParsedUrlQuery } from 'querystring'

const AlbumDetails: NextPage<AlbumDetailsProps> = ({
  album,
  locale,
  translation,
  metaTags,
  ...props
}) => {
  return (<>
    <Head>
      <title>{injectObjectToString(translation.page_title, album)}</title>
      {mapMetaTags(metaTags)}
    </Head>

    <AlbumInfo
      album={album}
      translation={translation}
      locale={locale}
    />
  </>)
}

export const getStaticPaths: GetStaticPaths = async () => {
  const albumsToc = require('src/__data/toc/albums.json')
  return {
    paths: albumsToc.flatMap((album: TocAlbumObject) =>
      locales.map(({ locale }) => ({
        params: {
          album: album.slug,
          locale
        }
      })
      )),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { album: albumSlug, locale } = context.params as IParams
  const translation = translationJSON[locale]

  const album = fetchExpandedAlbumFromFiles(albumSlug)

  const jpg = album.images.find(_image => _image.type === 'jpg')!
  const desc = injectObjectToString(translation.og_description, album)
    + album.tracks.map(_t => _t.name).join('／').slice(0,100)
  const metaTags = {
    'description': desc,
    'og:title': injectObjectToString(translation.og_title, album),
    'og:type': 'music.album',
    'og:url': `${metadata.base_url}/${locale}/album/${albumSlug}`,
    'og:site_name': metadata.title,
    'og:description': desc,
    'og:locale': locale,
    'og:locale:alternate': Object.values(Locales).filter(_loc => _loc !== locale),
    'og:image': `${metadata.base_url}${jpg.url}`,
    'og:image:type': `image/${jpg.type}`,
    'og:image:width': jpg.width,
    'og:image:height': jpg.height,
    'og:image:alt': album.name,
    'music': album.tracks.map(_track => ({
      'song': `${metadata.base_url}/${locale}/track/${_track.slug}`,
      'song:disc': _track.disc_number,
      'song:track': _track.track_number
    })),
    'music:release_date': album.release_date,
    'music:musician': Array.from(new Set(album.artists.map(_artist => `${metadata.base_url}/${locale}/artist/${_artist.slug}`)))  
  }

  return {
    props: {
      album,
      locale,
      translation,
      metaTags
    }
  }
}

export default AlbumDetails

type AlbumDetailsProps = {
  album: ExpandedAlbumObject
  locale: Locales
  translation: (typeof translationJSON)[Locales.EN]
  metaTags: Record<string, string | string[] | Record<string, string>[]>
  props: any
}

interface IParams extends ParsedUrlQuery {
  album: string
  locale: Locales
}