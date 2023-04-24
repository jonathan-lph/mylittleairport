import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import albums from "@common/asset/albums.json"
import { Album } from '@src/common/asset/mla'
import { ParsedUrlQuery } from 'querystring'
import { AlbumInfo } from '@src/components/album/AlbumInfo'
import translationJSON from '@common/translation/album.json'
import { locales } from '@src/common/definitions'

const AlbumDetails: NextPage<AlbumDetailsProps> = ({ album, translation, locale, ...props }) => {
  return (<>
    <Head>
      <title>{album.name} - my little airport</title>
    </Head>

    <main>
      <AlbumInfo
        album={album}
        translation={translation}
        locale={locale}
      />
    </main>
  </>)
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: albums.flatMap((album: Album) => 
      locales.map(({ locale }) => ({ 
        params: { 
          album: album.slug,
          locale: locale
        }
      })
    )),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { album: _albumSlug, locale } = context.params as IParams
  const album: Album = albums.find(_album => _album.slug === _albumSlug) ?? albums[0]
  // @ts-ignore
  const translation = translationJSON[locale]
  return {
    props: { 
      album, 
      locale, 
      translation 
    }
  }
}

export default AlbumDetails

type AlbumDetailsProps = {
  album: Album
  locale: string
  translation: any
  props: any
}

interface IParams extends ParsedUrlQuery {
  album: string
  locale: string
}