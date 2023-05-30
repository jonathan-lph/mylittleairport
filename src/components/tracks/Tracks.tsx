import { useState } from 'react'
import { TrackList } from '.'
import { Icon } from '@components/Icon'
import styles from './Tracks.module.sass'

import type { TocTrackObject } from '@__types/Track'

export const Tracks = ({
  tracks,
  locale,
  translation,
}: TracksProps): JSX.Element => {
  const [filters, setFilters] = useState({
    lyrics: true,
    thumbnail: true,
    list: false,
  })

  const toggleFilter = (cat: keyof typeof filters) => () => {
    setFilters((_filters) => ({
      ..._filters,
      [cat]: !_filters[cat],
      list: false,
    }))
  }

  const toggleList = () => {
    setFilters((_filter) => {
      if (_filter.list)
        return {
          lyrics: true,
          thumbnail: true,
          list: false,
        }
      return {
        lyrics: false,
        thumbnail: false,
        list: true,
      }
    })
  }

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>{translation.page_title}</h1>
      <section className={styles.filters}>
        <button
          onClick={toggleFilter('lyrics')}
          className={styles.toggleButton}
        >
          {translation.filters.lyrics}
          {filters.lyrics && <Icon icon="tick" />}
        </button>
        <button
          onClick={toggleFilter('thumbnail')}
          className={styles.toggleButton}
        >
          {translation.filters.thumbnail}
          {filters.thumbnail && <Icon icon="tick" />}
        </button>
        <button onClick={toggleList} className={styles.toggleButton}>
          {translation.filters.list_view}
          {filters.list && <Icon icon="tick" />}
        </button>
      </section>
      <TrackList
        locale={locale}
        tracks={tracks}
        filters={filters}
      />
    </div>
  )
}

interface TracksProps {
  tracks: Array<TocTrackObject>
  locale: string
  translation: any
}