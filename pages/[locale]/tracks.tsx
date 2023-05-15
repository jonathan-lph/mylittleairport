import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import tracks from "src/__data/toc/tracks.json"
import { ParsedUrlQuery } from 'querystring'
import translationJSON from '@translations/tracks.json'
import { TrackList } from '@src/components/tracks/TrackList'
import { Locales, locales } from '@consts/definitions'
import { TocTrackObject } from '@src/types/Track'
import { injectObjectToString } from '@src/utils/helper'
import metadata from "@consts/metadata.json"
import mapMetaTags from '@src/utils/mapMetaTags'
import is from "image-size"

const Tracks: NextPage<TracksProps> = ({
  tracks,
  locale,
  translation,
  metaTags,
  ...props
}) => {
  return (<>
    <Head>
      <title>{translation.meta.title}</title>
      {mapMetaTags(metaTags)}
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

  const isJpg = is('public/icons/icon-512.png')
  const metaTags = {
    'og:title': `${translation.meta.og_title}`,
    'og:type': 'website',
    'og:url': `${metadata.base_url}/${locale}/tracks`,
    'og:site_name': metadata.title,
    'og:description': injectObjectToString(translation.meta.og_description, {}),
    'og:locale': locale,
    'og:locale:alternate': Object.values(Locales).filter(_loc => _loc !== locale),
    'og:image': `${metadata.base_url}/icons/icon-512.png`,
    'og:image:type': `image/${isJpg.type}`,
    'og:image:width': isJpg.width,
    'og:image:height': isJpg.height,
    'og:image:alt': 'my little airport'
  }

  return {
    props: { 
      tracks, 
      locale,
      translation,
      metaTags
    }
  }
}

export default Tracks

type TracksProps = {
  tracks: TocTrackObject[]
  locale: Locales
  translation: typeof translationJSON[Locales.EN]
  metaTags: Record<string, string | string[] | Record<string, string>[]>
  props: any
}

interface IParams extends ParsedUrlQuery {
  locale: Locales
}