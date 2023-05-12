import { Track } from "@src/assets/archive/mla"
import styles from "./TrackList.module.sass"
import clsx from "clsx"
import { TocTrackObject } from "@src/types/Track"
import { useState } from "react"
import { Icon } from "@components/Icon"
import Link from "next/link"

interface TrackListProps {
  tracks: Array<TocTrackObject>
  locale: string
  translation: any
}

export const TrackList = ({
  tracks,
  locale,
  translation
}: TrackListProps) : JSX.Element => {

  const [filters, setFilters] = useState({
    lyrics: true,
    thumbnail: true,
    list: false
  })


  const toggleFilter = (cat: keyof typeof filters) => () => {
    setFilters(_filters => ({
      ..._filters,
      [cat]: !_filters[cat],
      list: false
    }))
  }

  const toggleList = () => {
    setFilters(_filter => {
      if (_filter.list) return {
        lyrics: true,
        thumbnail: true,
        list: false
      }
      return {
        lyrics: false,
        thumbnail: false,
        list: true
      }
    })
  }

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>
        {translation.page_title}
      </h1>
      <div className={styles.filters}>
        <button onClick={toggleFilter('lyrics')} className={styles.toggleButton}>
          {translation.filters.lyrics}
          {filters.lyrics && <Icon icon="tick"/>}
        </button>
        <button onClick={toggleFilter('thumbnail')} className={styles.toggleButton}>
          {translation.filters.thumbnail}
          {filters.thumbnail && <Icon icon="tick"/>}
        </button>
        <button onClick={toggleList} className={styles.toggleButton}>
          {translation.filters.list_view}
          {filters.list && <Icon icon="tick"/>}
        </button>
      </div>
      <ul className={clsx({
        [styles.list]: true,
        [styles.compact]: filters.list
      })}>
        {tracks
          .sort((a,b) => a.name.localeCompare(b.name, 'zh-Hant'))
          .map((track, trackIdx) => 
            <Link key={track.slug} href={{
              pathname: `/[locale]/[album]/[track]`,
              query: { 
                locale: locale,
                album: track.album.slug,
                track: track.slug
              }
            }}>
              <li 
                className={styles.track} 
                key={track.slug}
              >
                <div className={styles.index}>
                  <span className={styles.number}>{trackIdx+1}</span>
                  <Icon icon="arrow_forward" className={styles.arrow}/>
                </div>
                
                <div className={styles.content}>
                  <div className={styles.name}>
                    {track.name}
                  </div>
                  <div className={styles.album}>
                    {track.album.name}
                  </div>
                </div>
                <img
                  src={track.album.images[0]?.url}
                  className={clsx({
                    [styles.img]: true,
                    [styles.hidden]: !filters.thumbnail
                  })}
                />
                <div className={clsx({
                  [styles.lyrics]: true,
                  [styles.hidden]: !filters.lyrics
                })}>
                  {track.lyrics?.replaceAll('\n\n', '\n').replaceAll('\n', '／')}
                </div>
                
              </li>
            </Link>
          )
        }
      </ul>
    </div>
  )
}