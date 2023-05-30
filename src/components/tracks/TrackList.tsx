import clsx from 'clsx'
import Link from 'next/link'
import { Icon } from '@components/Icon'
import styles from './TrackList.module.sass'

import type { TocTrackObject } from '@__types/Track'

export const TrackList = ({
  tracks,
  locale,
  filters,
}: TrackListProps): JSX.Element => {
  return (
    <ul
      className={clsx({
        [styles.root]: true,
        [styles.compact]: filters.list,
      })}
    >
      {tracks
        .sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant'))
        .map((track, trackIdx) => (
          <Link
            key={track.slug}
            href={{
              pathname: `/[locale]/track/[track]`,
              query: {
                locale: locale,
                track: track.slug,
              },
            }}
          >
            <li className={styles.track} key={track.slug}>
              <div className={styles.index}>
                <span className={styles.number}>{trackIdx + 1}</span>
                <Icon icon="arrow_forward" className={styles.arrow} />
              </div>
              <div className={styles.meta}>
                <div className={styles.name}>{track.name}</div>
                <div className={styles.album}>{track.album.name}</div>
              </div>
              <img
                src={track.album.images[0]?.url}
                className={clsx({
                  [styles.img]: true,
                  [styles.hidden]: !filters.thumbnail,
                })}
              />
              <p
                className={clsx({
                  [styles.lyrics]: true,
                  [styles.hidden]: !filters.lyrics,
                })}
              >
                {track.lyrics?.replaceAll('\n\n', '\n').replaceAll('\n', '／')}
              </p>
            </li>
          </Link>
        ))}
    </ul>
  )
}

interface TrackListProps {
  tracks: Array<TocTrackObject>
  locale: string
  filters: Record<string, boolean>
}
