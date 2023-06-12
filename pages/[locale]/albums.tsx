import fs from "fs"
import is from "image-size"
import Head from 'next/head'

import { AlbumList } from '@components/albums'
import metadata from '@consts/metadata.json'
import { locales, Locales } from '@consts/definitions'
import { mapMetaTags, injectObjectToString } from '@utils/index'
import translationJSON from '@translations/albums.json'

import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import type { ParsedUrlQuery } from 'querystring'
import type { AlbumObject } from '@__types/Album'

const Albums: NextPage<AlbumsProps> = ({ 
  albums,
  locale,
  translation,
  metaTags,
  ...props
}) => {
  return (<>
    <Head>
      <title>{translation.meta.title}</title>
      {mapMetaTags(metaTags)}
    </Head>

    <AlbumList
      albums={albums}
      translation={translation}
      locale={locale}
    />
  </>)
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: locales.map(({ locale }) => ({ 
      params: { locale }
    })),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context.params as IParams
  const translation = translationJSON[locale]

  const isJpg = is('public/icons/icon-512.png')
  const metaTags = {
    'description': injectObjectToString(translation.meta.og_description, {}),
    'og:title': `${translation.meta.og_title}`,
    'og:type': 'website',
    'og:url': `${metadata.base_url}/${locale}/tracks`,
    'og:site_name': metadata.title,
    'og:description': injectObjectToString(translation.meta.og_description, {}),
    'og:locale': locale,
    'og:locale:alternate': Object.values(Locales).filter(_loc => _loc !== locale),
    'og:image': `${metadata.base_url}/icons/icon-512.png`,
    'og:image:type': `image/${isJpg.type}`,
    'og:image:width': isJpg.width,
    'og:image:height': isJpg.height,
    'og:image:alt': 'my little airport'
  }

  return {
    props: { 
      albums: fs.readdirSync('src/__data/albums')
        .map(file => require('src/__data/albums/'+file)),
      locale,
      translation,
      metaTags
    }
  }
}

export default Albums

type AlbumsProps = {
  albums: AlbumObject[]
  locale: Locales
  translation: (typeof translationJSON)[Locales.EN]
  metaTags: Record<string, string | string[] | Record<string, string>[]>
  props: any
}

interface IParams extends ParsedUrlQuery {
  locale: Locales
}