import { Album, Track, TrackAlbumRef } from "@src/common/asset/mla"
import { FC } from "react"
import styles from './TrackAlbumInfo.module.sass'
import clsx from 'clsx'
import Link from 'next/link'
import { Icon } from "@src/common/components/Icon"

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
        <h2 className={styles.title}>
          <Link href={`/${locale}/${album.slug}`}>
            {album.name}
          </Link>
        </h2>
        <div className={styles.tracklist}>
          {album.tracks.map((_track, idx) => 
            <div className={clsx({
              [styles.track]: true,
              [styles.selected]: track.slug === _track.slug
            })}>
                <span className={styles.trackIdx}>
                  {_track.disc !== 1 ? `${_track.disc}-` : ''}
                  {_track.track}
                </span>
                <Link href={`/${locale}/${album.slug}/${_track.slug}`}>
                  {_track.name}
                </Link>
            </div>
          )}
        </div>
      </div>

      <div className={styles.artworks}>
        <img 
          src={`/album_artwork/${album.slug}.jpg`}
          className={styles.img}
        />
        <div className={styles.otherAlbums}>
          {trackAlbums.map(trackAlbum => {
            if (trackAlbum.slug === album.slug) return null
            return (
              <Link href={`/${locale}/${trackAlbum.slug}/${track.slug}`} scroll={false}>
                <div className={styles.otherAlbum}>
                  <img
                    src={`/album_artwork/${trackAlbum.slug}.jpg`}
                    className={styles.img}
                  />
                  <div className={styles.albumInfo}>
                    <div className={styles.albumName}>
                      {trackAlbum.name}
                    </div>
                    <div className={styles.albumTrack}>
                      <Icon icon="album"/>
                      {trackAlbum.disc}
                      <Icon icon="music_note"/>
                      {trackAlbum.track}
                    </div>
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