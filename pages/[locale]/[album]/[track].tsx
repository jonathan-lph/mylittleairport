import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { ParsedUrlQuery } from 'querystring'
import { TrackInfo } from '@src/components/track/TrackInfo'
import translationJSON from '@translations/track.json'
import { TrackAlbumInfo } from '@src/components/track/TrackAlbumInfo'
import { Locales, locales } from '@consts/definitions'
import { ExpandedTrackObject, TocTrackObject } from '@src/types/Track'
import { fetchExpandedTrackFromFiles, searchTracksFromFiles } from '@database/track'

const TrackDetails: NextPage<TrackDetailsProps> = ({ 
  track,
  tracksWithSameName,
  locale,
  translation, 
  ...props 
}) => {
  return (<>
    <Head>
      <title>{track.name} - {track.album.name} - my little airport</title>
    </Head>

    <TrackInfo
      track={track} 
      translation={translation}
    />
    <TrackAlbumInfo 
      track={track}
      tracksWithSameName={tracksWithSameName}
      translation={translation}
      locale={locale}
    />
  </>)
}


export const getStaticPaths: GetStaticPaths = async () => {
  const tracksToc = require('src/__data/toc/tracks.json')
  return {
    paths: tracksToc.flatMap((track : TocTrackObject) => 
      locales.map(({ locale }) => ({
        params: {
          album: track.album.slug,
          track: track.slug,
          locale: locale,
        }
      }))
    ),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { track: _trackSlug, album, locale } = context.params as IParams
  const track = fetchExpandedTrackFromFiles(_trackSlug, album)
  const tracksWithSameName = searchTracksFromFiles({name: track.name})
  const translation = translationJSON[locale]
  return {
    props: { 
      track, 
      tracksWithSameName,
      locale,
      translation
    }
  }
}

export default TrackDetails

type TrackDetailsProps = {
  track: ExpandedTrackObject
  tracksWithSameName: TocTrackObject[]
  locale: Locales
  translation: typeof translationJSON[Locales.EN]
  props: any
}

interface IParams extends ParsedUrlQuery {
  track: string
  album: string
  locale: Locales
}