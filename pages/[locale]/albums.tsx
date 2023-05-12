import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { ParsedUrlQuery } from 'querystring'
import * as translationJSON from '@translations/albums.json'
import { AlbumList } from '@src/components/albums/AlbumList'
import { locales, Locales } from '@consts/definitions'
import fs from "fs"
import { AlbumObject } from '@src/types/Album'

const Albums: NextPage<AlbumsProps> = ({ albums, translation, locale, ...props }) => {
  return (<>
    <Head>
      <title>{translation.page_title} - my little airport</title>
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
  return {
    props: { 
      albums: fs.readdirSync('src/__data/albums')
        .map(file => require('src/__data/albums/'+file)),
      locale,
      translation
    }
  }
}

export default Albums

type AlbumsProps = {
  albums: AlbumObject[]
  locale: Locales
  translation: typeof translationJSON[Locales.EN]
  props: any
}

interface IParams extends ParsedUrlQuery {
  locale: Locales
}