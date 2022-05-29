import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import albums from "@common/asset/albums.json"
import { Album } from '@src/common/asset/mla'
import { ParsedUrlQuery } from 'querystring'
import { AlbumInfo } from '@src/components/album/AlbumInfo'
import translationJSON from '@common/translation/albums.json'
import { AlbumList } from '@src/components/albums/Albums'

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
    paths: albums.map((album: Album) => ({ 
      params: { 
        locale: 'zh'
      }
    })),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context.params as IParams
  const translation = translationJSON[locale]
  return {
    props: { 
      albums, 
      locale, 
      translation 
    }
  }
}

export default Albums

type AlbumsProps = {
  albums: Array<Album>
  locale: string
  translation: any
  props: any
}

interface IParams extends ParsedUrlQuery {
  locale: string
}