import { FC, Fragment } from "react"
import styles from './TrackAlbumInfo.module.sass'
import clsx from 'clsx'
import Link from 'next/link'
import { ExpandedTrackObject, TocTrackObject } from "@src/types/Track"
import type translationJSON from '@translations/track.json'
import { Locales } from "@src/consts/definitions"

interface TrackAlbumInfoProps {
  track: ExpandedTrackObject
  tracksWithSameName: TocTrackObject[]
  locale: string
  translation: typeof translationJSON[Locales.ZH]
}

export const TrackAlbumInfo: FC<TrackAlbumInfoProps> = ({ 
  track, 
  tracksWithSameName, 
  locale,
  translation
}) => {
  return (
    <div className={styles.root}>

      <div className={styles.album}>
        <h3 className={styles.title}>
          <Link href={{
            pathname: `/[locale]/album/[album]`,
            query: { 
              locale: locale,
              album: track.album.slug
            }
          }}>
            {track.album.name}
          </Link>
        </h3>
        <div className={styles.tracklist}>
          {track.album.tracks.map((_track, idx) => 
            <Fragment key={idx}>
              <div className={clsx({
                [styles.track]: true,
                [styles.selected]: track.slug === _track.slug
              })}>
                  <Link href={{
                    pathname: `/[locale]/track/[track]`,
                    query: { 
                      locale: locale,
                      track: _track.slug
                    }
                  }}>
                    {_track.name}
                  </Link>
              </div>
              <span className={styles.divider}>
                {idx !== track.album.tracks.length-1 && '／'}
              </span>
            </Fragment>
          )}
        </div>
      </div>

      <div className={styles.artworks}>
        <h3 className={styles.title}>
          {translation.title.appears_on}
        </h3>
        <div className={styles.otherAlbums}>
          {tracksWithSameName.map(_track => {
            // if (trackAlbum.slug === album.slug) return null
            return (
              <Link 
                href={{
                  pathname: `/[locale]/track/[track]`,
                  query: { 
                    locale: locale,
                    track: _track.slug
                  }
                }} 
                scroll={false}
                key={_track.slug}
              >
                <div className={styles.otherAlbum}>
                  <div className={styles.imgBorder}>
                    <img
                      src={_track.album.images[0].url}
                      className={styles.img}
                    />
                  </div>
                  <div className={clsx({
                    [styles.albumName]: true,
                    [styles.current]: _track.album.slug === track.album.slug
                  })}>
                    {_track.album.name}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

    </div>
  )
}