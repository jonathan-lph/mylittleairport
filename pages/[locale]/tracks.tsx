import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import tracks from "@common/asset/tracks.json"
import { Track } from '@src/common/asset/mla'
import { ParsedUrlQuery } from 'querystring'
import translationJSON from '@common/translation/tracks.json'
import { TrackList } from '@src/components/tracks/TrackList'
import { locales } from '@src/common/definitions'

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
    paths: locales.map(({locale}) => ({ 
      params: { 
        locale: locale
      }
    })),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context.params as IParams
  // @ts-ignore
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
  tracks: Array<Track>
  locale: string
  translation: any
  props: any
}

interface IParams extends ParsedUrlQuery {
  locale: string
}