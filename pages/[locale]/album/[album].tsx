import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { ParsedUrlQuery } from 'querystring'
import { AlbumInfo } from '@src/components/album/AlbumInfo'
import translationJSON from '@translations/album.json'
import { Locales, locales } from '@consts/definitions'
import { ExpandedAlbumObject, TocAlbumObject } from '@src/types/Album'
import { fetchExpandedAlbumFromFiles } from '@database/album'

const AlbumDetails: NextPage<AlbumDetailsProps> = ({ album, translation, locale, ...props }) => {
  return (<>
    <Head>
      <title>{album.name} - my little airport</title>
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
  const { album, locale } = context.params as IParams
  const translation = translationJSON[locale]
  return {
    props: {
      album: fetchExpandedAlbumFromFiles(album),
      locale,
      translation
    }
  }
}

export default AlbumDetails

type AlbumDetailsProps = {
  album: ExpandedAlbumObject
  locale: Locales
  translation: typeof translationJSON[Locales.EN]
  props: any
}

interface IParams extends ParsedUrlQuery {
  album: string
  locale: Locales
}