import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import albums from "@common/asset/albums.json"
import tracks from "@common/asset/tracks.json"
import { Album, Track, TrackAlbumRef } from '@src/common/asset/mla'
import { ParsedUrlQuery } from 'querystring'
import { TrackInfo } from '@src/components/track/TrackInfo'
import translationJSON from '@common/translation/track.json'
import { TrackAlbumInfo } from '@src/components/track/TrackAlbumInfo'
import { Locales, locales } from '@src/common/definitions'
import mongoosePromise from '@lib/mongoose'
import { TrackModel } from 'models'
import { ExpandedTrackArtist, ExpandedTrackObject, ExportedTrackObject, TrackObject } from '@src/common/asset/types/Track'
import { ExportedAlbumObject, SimplifiedAlbumObject } from '@src/common/asset/types/Album'
import { ExportedArtistObject } from '@src/common/asset/types/Artist'
import { fetchExpandedTrackFromFiles } from 'services/database/track'

const TrackDetails: NextPage<TrackDetailsProps> = ({ 
  track,
  tracksWithSameName,
  album,
  locale,
  translation, 
  ...props 
}) => {
  return (<>
    <Head>
      <title>{track.name} - {album.name} - my little airport</title>
    </Head>

    <>
      <TrackInfo
        album={album}
        track={track} 
        translation={translation}
      />
      <TrackAlbumInfo 
        album={album}
        track={track}
        tracksWithSameName={tracksWithSameName}
        translation={translation}
        locale={locale}
      />
    </>
  </>)
}


export const getStaticPaths: GetStaticPaths = async () => {
  mongoosePromise
  const tracks = JSON.parse(JSON.stringify(
    await TrackModel
      .find()
      .select('-_id slug')
      .populate('album', '-_id slug')
      .exec()
  ))

  return {
    paths: tracks.flatMap((track: ExpandedTrackObject) => 
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

  const track = await fetchExpandedTrackFromFiles(_trackSlug, album)

  const tracksWithSameName: TrackObject[] = JSON.parse(JSON.stringify(
    await TrackModel
      .find({name: track.name})
      .populate({
        path: 'album',
        select: '-artists -genres -__v'
      })
      .populate({
        path: 'artists.members',
        select: '-external_social_urls -images -__v'
      })
      .exec()
  ))
  // @ts-ignore
  const translation = translationJSON[locale]
  return {
    props: { 
      track: track, 
      album: track.album,
      tracksWithSameName,
      locale,
      translation
    }
  }
}

export default TrackDetails

type TrackDetailsProps = {
  track: ExpandedTrackObject
  album: SimplifiedAlbumObject
  tracksWithSameName: ExpandedTrackObject[]
  locale: string
  translation: any
  props: any
}

interface IParams extends ParsedUrlQuery {
  track: string
  album: string
  locale: Locales
}