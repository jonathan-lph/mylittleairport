import clsx from 'clsx'
import Link from 'next/link'
import { Fragment } from 'react'
import { Icon } from '@components/Icon'
import styles from './TrackAlbumInfo.module.sass'

import type { ExpandedTrackObject, TocTrackObject } from '@__types/Track'
import type translationJSON from '@translations/track.json'
import type { Locales } from '@consts/definitions'

const AlbumTrackList = ({
  track,
  locale,
  translation,
}: AlbumTrackListProps): JSX.Element => {
  return (
    <section className={styles.album}>
      <h3 className={styles.title}>{track.album.name}</h3>
      <div className={styles.trackList}>
        {track.album.tracks.map((_track, idx) => (
          <Fragment key={idx}>
            <Link
              href={{
                pathname: `/[locale]/track/[track]`,
                query: {
                  locale: locale,
                  track: _track.slug,
                },
              }}
            >
              <a
                className={clsx({
                  [styles.track]: true,
                  [styles.active]: track.slug === _track.slug,
                })}
              >
                {_track.name}
              </a>
            </Link>
            <span className={styles.divider}>
              {idx !== track.album.tracks.length - 1 && '／'}
            </span>
          </Fragment>
        ))}
      </div>
      <Link
        href={{
          pathname: `/[locale]/album/[album]`,
          query: {
            locale: locale,
            album: track.album.slug,
          },
        }}
      >
        <a className={styles.backButton}>
          <Icon icon="arrow_back" className={styles.back} />
          {translation.to_album}
        </a>
      </Link>
    </section>
  )
}

const AppearsOnAlbumList = ({
  currentAlbum,
  tracksWithSameName,
  locale,
  translation,
}: AppearsOnAlbumListProps): JSX.Element => {
  return (
    <section className={styles.artworks}>
      <h3 className={styles.title}>{translation.title.appears_on}</h3>
      <div className={styles.otherAlbums}>
        {tracksWithSameName.map((_track) => (
          <Link
            href={{
              pathname: `/[locale]/track/[track]`,
              query: {
                locale: locale,
                track: _track.slug,
              },
            }}
            scroll={false}
            key={_track.slug}
          >
            <figure className={styles.otherAlbum}>
              <div className={styles.imgBorder}>
                <img src={_track.album.images[0].url} className={styles.img} />
              </div>
              <figcaption
                className={clsx({
                  [styles.name]: true,
                  [styles.active]: _track.album.slug === currentAlbum,
                })}
              >
                {_track.album.name}
              </figcaption>
            </figure>
          </Link>
        ))}
      </div>
    </section>
  )
}

export const TrackAlbumInfo = ({
  track,
  tracksWithSameName,
  locale,
  translation,
}: TrackAlbumInfoProps): JSX.Element => {
  return (
    <div className={styles.root}>
      <AlbumTrackList
        track={track}
        locale={locale}
        translation={translation}
      />
      <AppearsOnAlbumList
        tracksWithSameName={tracksWithSameName}
        locale={locale}
        translation={translation}
        currentAlbum={track.album.slug}
      />
    </div>
  )
}

interface TrackAlbumInfoProps {
  track: ExpandedTrackObject
  tracksWithSameName: TocTrackObject[]
  locale: string
  translation: (typeof translationJSON)[Locales.ZH]
}

interface AlbumTrackListProps
  extends Pick<TrackAlbumInfoProps, 'track' | 'locale' | 'translation'> {}

interface AppearsOnAlbumListProps
  extends Pick<
    TrackAlbumInfoProps,
    'tracksWithSameName' | 'locale' | 'translation'
  > {
  currentAlbum: string
}
