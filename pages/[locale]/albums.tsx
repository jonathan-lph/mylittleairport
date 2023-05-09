import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
// import albums from "@common/asset/albums.json"
import { Album } from '@src/common/asset/mla'
import { ParsedUrlQuery } from 'querystring'
import { AlbumInfo } from '@src/components/album/AlbumInfo'
import * as translationJSON from '@common/translation/albums.json'
import { AlbumList } from '@src/components/albums/AlbumList'
import { locales, Locales } from '@src/common/definitions'
import { AlbumModel } from 'models'
import fs from "fs"
import { AlbumObject, ExpandedAlbumObject } from '@src/common/asset/types/Album'
import mongoosePromise from '@lib/mongoose'

const Albums: NextPage<AlbumsProps> = ({ albums, translation, locale, ...props }) => {
  return (<>
    <Head>
      <title>{translation.page_title} - my little airport</title>
    </Head>

    <main>
      <AlbumList
        albums={albums}
        translation={translation}
        locale={locale}
      />
    </main>
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
      albums: fs.readdirSync('_data/albums')
        .map(file => require('_data/albums/'+file)),
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