import { useEffect, useState } from "react"
import styles from './AlbumInfo.module.sass'
import Link from 'next/link'
import { Icon } from "@components/Icon"
import type { ExpandedAlbumObject } from "@src/types/Album"

interface AlbumInfoProps {
  album: ExpandedAlbumObject
  locale: string
  translation: any
}

export const AlbumInfo = ({
  album,
  locale,
  translation
}: AlbumInfoProps) : JSX.Element => {
  return (
    <div className={styles.root}>

      <div className={styles.meta}>
        <span className={styles.year}>
          {album.release_date}
        </span>
        <h1 className={styles.title}>
          {album.name}
        </h1>
      </div>
      <img
        src={album.images[0].url}
        className={styles.img}
      />
      <div/>

      <div className={styles.list}>
        {album.tracks.map((track) =>
          <div className={styles.track} key={track.slug}>
            <div className={styles.icon}>
              <Icon icon="arrow_forward"/>
            </div>
            <Link href={{
              pathname: `/[locale]/track/[track]`,
              query: { 
                locale: locale,
                track: track.slug
              }
            }}>
              <a className={styles.name}>
                {track.name}
              </a>
            </Link>
            <span className={styles.trackIdx}>
              {track.disc_number !== 1 ? `${track.disc_number}-` : ''}
              {track.track_number}
            </span>
          </div>
        )}
      </div>

    </div>
  )
}