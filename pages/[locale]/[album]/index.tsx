import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { Album } from '@src/common/asset/mla'
import { ParsedUrlQuery } from 'querystring'
import { AlbumInfo } from '@src/components/album/AlbumInfo'
import translationJSON from '@common/translation/album.json'
import { Locales, locales } from '@src/common/definitions'
import { AlbumModel } from 'models'
import { AlbumObject, ExpandedAlbumObject, ExportedAlbumObject, TocAlbumObject } from '@src/common/asset/types/Album'
import mongoosePromise from '@lib/mongoose'
import { ExportedTrackObject } from '@src/common/asset/types/Track'
import { ExportedArtistObject } from '@src/common/asset/types/Artist'

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
  const albumsToc = require('_data/toc/albums.json')
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

  const exportedAlbum : ExportedAlbumObject = require(`_data/albums/${album}`)
  const expandedAlbum : ExpandedAlbumObject = {
    ...exportedAlbum,
    tracks: exportedAlbum.tracks.map((_track) => {
      const track : ExportedTrackObject = require(`_data/tracks/${exportedAlbum.slug}/${_track.slug}`)
      const removingKeys : Array<keyof ExportedTrackObject> = [
        "has_lyrics",  "lyrics", "album", "artists"
      ]
      for (let key of removingKeys) delete track[key]
      return track
    }),
    artists: exportedAlbum.artists.map((_artist) => {
      const artist : ExportedArtistObject = require(`_data/artists/${_artist.slug}`)
      const removingKeys : Array<keyof ExportedArtistObject> = [
        "external_social_urls", "images"
      ]
      for (let key of removingKeys) delete artist[key]
      return artist
    })
  }

  return {
    props: { 
      album: expandedAlbum, 
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