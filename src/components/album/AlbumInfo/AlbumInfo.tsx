import { Album, Track, AlbumTrackRef } from "@src/common/asset/mla"
import { FC } from "react"
import styles from './AlbumInfo.module.sass'
import clsx from 'clsx'
import Link from 'next/link'
import { Icon } from "@src/common/components/Icon"

interface AlbumInfoProps {
  album: Album
  locale: string
  translation: any
}

const AlbumTrack = ({
  track,
  srcLink,
} : {
  track: AlbumTrackRef
  srcLink: string
}) : JSX.Element => {
  return (
    <div className={styles.track}>
      <div className={styles.icon}>
        <Icon icon="play"/>
      </div>
      <Link href={srcLink}>
        <a className={styles.name}>
          {track.name}
        </a>
      </Link>
      <span className={styles.trackIdx}>
        {track.disc !== 1 ? `${track.disc}-` : ''}
        {track.track}
      </span>
    </div>
  )
}

export const AlbumInfo = ({
  album,
  locale,
  translation
}: AlbumInfoProps) : JSX.Element => {
  return (
    <div className={styles.root}>

      <h1 className={styles.title}>
        {album.name}
      </h1>
      <img
        src={`/album_artwork/${album.slug}.jpg`}
        className={styles.img}
      />
      <div/>

      <div className={styles.list}>
        {album.tracks.map((_track) => 
          <AlbumTrack 
            track={_track}
            srcLink={`/${locale}/${album.slug}/${_track.slug}`}
          />
        )}
      </div>

    </div>
  )
}