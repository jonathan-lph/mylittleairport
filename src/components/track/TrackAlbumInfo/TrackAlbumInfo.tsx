import { Album, Track, TrackAlbumRef } from "@src/common/asset/mla"
import { FC, Fragment } from "react"
import styles from './TrackAlbumInfo.module.sass'
import clsx from 'clsx'
import Link from 'next/link'
import { Icon } from "@src/common/components/Icon"
import { AlbumDiv } from "@src/components/albums/AlbumList"

interface TrackAlbumInfoProps {
  album: Album
  track: Track
  trackAlbums: Array<TrackAlbumRef>
  locale: string
  translation: any
}

export const TrackAlbumInfo: FC<TrackAlbumInfoProps> = ({ 
  album, 
  track, 
  trackAlbums, 
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
          {trackAlbums.map(trackAlbum => {
            // if (trackAlbum.slug === album.slug) return null
            return (
              <Link 
                href={`/${locale}/${trackAlbum.slug}/${track.slug}`} 
                scroll={false}
                key={trackAlbum.slug}
              >
                <div className={styles.otherAlbum}>
                  <div className={styles.imgBorder}>
                    <img
                      src={`/album_artwork/${trackAlbum.slug}.jpg`}
                      className={styles.img}
                    />
                  </div>
                  <div className={clsx({
                    [styles.albumName]: true,
                    [styles.current]: trackAlbum.slug === album.slug
                  })}>
                    {trackAlbum.name}
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