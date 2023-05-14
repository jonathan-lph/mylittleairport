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

interface AlbumInfoState {
  track: string | null
  ref: HTMLAudioElement | null,
  playing: boolean
}

export const AlbumInfo = ({
  album,
  locale,
  translation
}: AlbumInfoProps) : JSX.Element => {

  const [play, setPlay] = useState<AlbumInfoState>({
    track: null,
    ref: null,
    playing: false
  })

  const handleLoadedMetadata = (audio: HTMLAudioElement, slug: string) => (e: Event) => {
    audio.play()
    setPlay({
      track: slug,
      ref: audio,
      playing: true
    })
  }
  const handleError = (slug: string) => (e: Event) => {
    setPlay({
      track: slug,
      ref: null,
      playing: false
    })
  }

  const playAudio = (slug: string) => () => {
    const hasPlaying = Boolean(play.track)
    const notSelfPlaying = play.track && play.track !== slug
    const hasAudio = Boolean(play.ref)

    if (notSelfPlaying && hasAudio) {
      play.ref!.pause()
    }
    if (!hasPlaying || notSelfPlaying) {
      const _audioFile = new Audio(`/track_file/${slug}.mp3`)
      _audioFile.addEventListener('loadedmetadata', handleLoadedMetadata(_audioFile, slug))
      _audioFile.addEventListener('error', handleError(slug))
    }
    
    // Pause or resume same song
    if (hasPlaying && hasAudio && slug === play.track) {
      if (play.playing) {
        play.ref!.pause()
        setPlay({...play, playing: false})
      } else {
        play.ref!.play()
        setPlay({...play, playing: true})
      }
    }
  }

  useEffect(() => {
    return () => {
      if (!play.ref || !play.track) return
      play.ref.pause()
      play.ref.removeEventListener('loadedmetadata', handleLoadedMetadata(play.ref, play.track))
      play.ref.removeEventListener('error', handleError(play.track))
    }
  }, [play])

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