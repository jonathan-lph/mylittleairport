import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import albums from "@common/asset/albums.json"
import tracks from "@common/asset/tracks.json"
import { Album, Track, TrackAlbumRef } from '@src/common/asset/mla'
import { ParsedUrlQuery } from 'querystring'
import { TrackInfo } from '@src/components/track/TrackInfo'
import translationJSON from '@common/translation/track.json'
import { TrackAlbumInfo } from '@src/components/track/TrackAlbumInfo'

const TrackDetails: NextPage<TrackDetailsProps> = ({ 
  track, 
  album,
  locale,
  translation, 
  ...props 
}) => {
  return (<>
    <Head>
      <title>{track.name} - {album.name} - my little airport</title>
    </Head>

    <main>
      <TrackInfo
        album={album}
        track={track} 
        translation={translation}
      />
      <TrackAlbumInfo 
        album={album}
        track={track}
        trackAlbums={track.album} 
        translation={translation}
        locale={locale}
      />
    </main>
  </>)
}


export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: tracks.map((track: Track) => {
      const albums = track.album
      return albums.map((album: TrackAlbumRef) => ({
        params: {
          album: album.slug,
          track: track.slug,
          locale: 'zh',
        }
      }))
    }).flat(),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { 
    track: _trackSlug,
    album: _albumSlug,
    locale 
  } = context.params as IParams
  const track: Track = tracks.find(_track => _track.slug === _trackSlug) ?? tracks[0]
  const album: Album = albums.find(_album => _album.slug === _albumSlug) ?? albums[0]
  const translation = translationJSON[locale]
  return {
    props: { 
      track, 
      album,
      locale,
      translation
    }
  }
}

export default TrackDetails

type TrackDetailsProps = {
  track: Track
  album: Album
  locale: string
  translation: any
  props: any
}

interface IParams extends ParsedUrlQuery {
  track: string,
  locale: string
}