import Head from 'next/head'
import { TrackInfo } from '@components/track/TrackInfo'
import { TrackAlbumInfo } from '@components/track/TrackAlbumInfo'
import { fetchExpandedTrackFromFiles, searchTracksFromFiles } from '@database/track'
import metadata from '@consts/metadata.json'
import { Locales, locales } from '@consts/definitions'
import { mapMetaTags, injectObjectToString } from '@utils/index'
import translationJSON from '@translations/track.json'
import styles from '@components/track/index.module.sass'

import type { ParsedUrlQuery } from 'querystring'
import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import type { ExpandedTrackObject, TocTrackObject } from '@__types/Track'

const TrackDetails: NextPage<TrackDetailsProps> = ({ 
  track,
  tracksWithSameName,
  locale,
  translation,
  metaTags,
  ...props 
}) => {
  return (<>
    <Head>
      <title>{injectObjectToString(translation.meta.title, track)}</title>
      {mapMetaTags(metaTags)}
    </Head>

    <div className={styles.root}>
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
    </div>
  </>)
}


export const getStaticPaths: GetStaticPaths = async () => {
  const tracksToc = require('src/__data/toc/tracks.json')
  return {
    paths: tracksToc.flatMap((track : TocTrackObject) => 
      locales.map(({ locale }) => ({
        params: {
          track: track.slug,
          locale: locale,
        }
      }))
    ),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { track: trackSlug, locale } = context.params as IParams
  const track = fetchExpandedTrackFromFiles(trackSlug)
  const tracksWithSameName = searchTracksFromFiles({name: track.name})
  const translation = translationJSON[locale]

  const jpg = track.album.images.find(_image => _image.type === 'jpg')!
  const desc = injectObjectToString(translation.meta.og_description, track)
    + track.lyrics?.replaceAll('\n\n', '\n').replaceAll('\n', '／').slice(0,100)
  const metaTags = {
    'description': desc,
    'og:title': injectObjectToString(translation.meta.og_title, track),
    'og:type': 'music.song',
    'og:url': `${metadata.base_url}/${locale}/track/${trackSlug}`,
    'og:site_name': metadata.title,
    'og:description': desc,
    'og:locale': locale,
    'og:locale:alternate': Object.values(Locales).filter(_loc => _loc !== locale),
    'og:image': jpg.url,
    'og:image:type': `image/${jpg.type}`,
    'og:image:width': jpg.width,
    'og:image:height': jpg.height,
    'og:image:alt': track.album.name,
    'music:duration': track.duration_s,
    'music:album': `${metadata.base_url}/${locale}/album/${track.album.slug}`,
    'music:album:disc': track.disc_number,
    'music:album:track': track.track_number,
    'music:musician': Array.from(
      new Set(track.artists.flatMap(
        _artist => _artist.members.flatMap(
          _member => `${metadata.base_url}/${locale}/artist/${_member.slug}`
    ))))
  }

  return {
    props: { 
      track, 
      tracksWithSameName,
      locale,
      metaTags,
      translation
    }
  }
}

export default TrackDetails

type TrackDetailsProps = {
  track: ExpandedTrackObject
  tracksWithSameName: TocTrackObject[]
  locale: Locales
  translation: (typeof translationJSON)[Locales.EN]
  metaTags: Record<string, string[] | string>
  props: any
}

interface IParams extends ParsedUrlQuery {
  track: string
  album: string
  locale: Locales
}