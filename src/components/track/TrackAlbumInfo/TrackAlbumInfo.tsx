import { Album, Track, TrackAlbumRef } from "@src/common/asset/mla"
import { FC, Fragment } from "react"
import styles from './TrackAlbumInfo.module.sass'
import clsx from 'clsx'
import Link from 'next/link'
import { Icon } from "@src/common/components/Icon"
import { AlbumDiv } from "@src/components/albums/AlbumList"
import { AlbumObject, SimplifiedAlbumObject } from "@src/common/asset/types/Album"
import { ExpandedTrackObject, TrackObject } from "@src/common/asset/types/Track"

interface TrackAlbumInfoProps {
  album: SimplifiedAlbumObject
  track: ExpandedTrackObject
  tracksWithSameName: ExpandedTrackObject[]
  locale: string
  translation: any
}

export const TrackAlbumInfo: FC<TrackAlbumInfoProps> = ({ 
  album, 
  track, 
  tracksWithSameName, 
  locale,
  translation
}) => {
  return (
    <div className={styles.root}>

      <div className={styles.album}>
        <h3 className={styles.title}>
          <Link href={`/${locale}/${album.slug}`}>
            {album.name}
          </Link>
        </h3>
        <div className={styles.tracklist}>
          {album.tracks.map((_track, idx) => 
            <Fragment key={idx}>
              <div className={clsx({
                [styles.track]: true,
                [styles.selected]: track.slug === _track.slug
              })}>
                  <Link href={`/${locale}/${album.slug}/${_track.slug}`}>
                    {_track.name}
                  </Link>
              </div>
              <span className={styles.divider}>
                {idx !== album.tracks.length-1 && '／'}
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
                href={`/${locale}/${_track.album.slug}/${_track.slug}`} 
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
                    [styles.current]: _track.album.slug === album.slug
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