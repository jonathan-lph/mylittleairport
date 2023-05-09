import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import tracks from "_data/toc/tracks.json"
import { Track } from '@src/common/asset/mla'
import { ParsedUrlQuery } from 'querystring'
import translationJSON from '@common/translation/tracks.json'
import { TrackList } from '@src/components/tracks/TrackList'
import { Locales, locales } from '@src/common/definitions'
import { TocTrackObject } from '@src/common/asset/types/Track'

const Tracks: NextPage<TracksProps> = ({ tracks, translation, locale, ...props }) => {
  return (<>
    <Head>
      <title>{translation.page_title} - my little airport</title>
    </Head>

    <main>
      <TrackList
        tracks={tracks}
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