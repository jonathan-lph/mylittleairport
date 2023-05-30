import Link from 'next/link'
import { Icon } from "@components/Icon"
import styles from './AlbumInfo.module.sass'

import type { ExpandedAlbumObject } from "@__types/Album"
import type { Locales } from '@consts/definitions'
import type translationJSON from "@translations/album.json"

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
        alt={album.name}
        className={styles.img}
      />
      <div/>

      <div className={styles.list}>
        {album.tracks.map((track) =>
          <Link key={track.slug} href={{
            pathname: `/[locale]/track/[track]`,
            query: { 
              locale: locale,
              track: track.slug
            }
          }}>
            <a className={styles.track} >
              <div className={styles.icon}>
                <Icon icon="arrow_forward"/>
              </div>
              <div className={styles.name}>
                {track.name}
              </div>
              <span className={styles.trackIdx}>
                {track.disc_number !== 1 ? `${track.disc_number}-` : ''}
                {track.track_number}
              </span>
            </a>
          </Link>
        )}
      </div>

    </div>
  )
}

interface AlbumInfoProps {
  album: ExpandedAlbumObject
  locale: string
  translation: ((typeof translationJSON))[Locales.EN]
}