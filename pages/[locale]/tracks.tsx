import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import tracks from "src/__data/toc/tracks.json"
import { ParsedUrlQuery } from 'querystring'
import translationJSON from '@translations/tracks.json'
import { TrackList } from '@src/components/tracks/TrackList'
import { Locales, locales } from '@consts/definitions'
import { TocTrackObject } from '@src/types/Track'

const Tracks: NextPage<TracksProps> = ({ tracks, translation, locale, ...props }) => {
  return (<>
    <Head>
      <title>{translation.page_title} - my little airport</title>
    </Head>

    <TrackList
      tracks={tracks}
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
      tracks, 
      locale, 
      translation 
    }
  }
}

export default Tracks

type TracksProps = {
  tracks: TocTrackObject[]
  locale: Locales
  translation: typeof translationJSON[Locales.EN]
  props: any
}

interface IParams extends ParsedUrlQuery {
  locale: Locales
}