import { useEffect, useRef, useState, MouseEvent } from "react"
import styles from './TrackInfo.module.sass'
import { ExpandedTrackObject } from "@src/types/Track"
import type translationJSON from '@translations/track.json'
import { Locales } from "@src/consts/definitions"

interface TrackInfoProps {
  track: ExpandedTrackObject
  translation: typeof translationJSON[Locales.ZH]
}

const getTimestamp = (time: number): string => {
  const min = Math.floor(time / 60)
  const sec = Math.floor(time % 60).toString().padStart(2, '0')
  return `${min}:${sec}`
}

export const TrackInfo = ({ track, translation }: TrackInfoProps) : JSX.Element => {
  const { name } = track
  const [playing, setPlaying] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const timestamp   = useRef<HTMLSpanElement | null>(null)
  const progressBar = useRef<HTMLDivElement | null>(null)

  const playAudio = () => {
    if (audio) {
      setPlaying(!playing)
      if (!playing) audio.play()
      else audio.pause()
    }
  }

  const handleJump = (e: MouseEvent<HTMLElement>) => {
    if (!audio) return
    const elem = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
    const y = (e.clientY - elem.top) / elem.height
    audio.currentTime = audio.duration * y
    if (!playing) {
      audio.play()
      setPlaying(true)
    }
  }

  const handleLoadedMetadata = (_audio: HTMLAudioElement | null) => (e: Event) => {
    if (!_audio) return
    setAudio(_audio)
    if (!timestamp.current) return
    timestamp.current.innerText = getTimestamp(_audio.duration)
  }

  const handleError = (e: Event) => {
    setAudio(null)
  }

  const handleTimeUpdate = (e: Event) => {
    if (!timestamp.current || !progressBar.current || !audio) return
    timestamp.current.innerText = getTimestamp(audio.currentTime)
    progressBar.current.style.height = (audio.currentTime / audio.duration) * 100 + '%'
  }

  const handleEnded = (e: Event) => {
    setPlaying(false)
  }

  useEffect(() => {
    const _audioFile = new Audio(`/track_file/${track.slug}.mp3`)
    _audioFile.addEventListener('error', handleError)
    _audioFile.addEventListener('loadedmetadata', handleLoadedMetadata(_audioFile))
    return () => {
      _audioFile.pause()
      _audioFile.removeEventListener('error', handleError)
      _audioFile.removeEventListener('loadedmetadata', handleLoadedMetadata(_audioFile))
      setAudio(null)
      setPlaying(false)
      if (progressBar.current)
        progressBar.current.style.height = '0%'
    }
  }, [track])

  useEffect(() => {
    if (!audio) return;
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [audio])

  return (
    <div className={styles.root}>
        
      <div className={styles.imgBorder}>
        <img
          src={track.album.images[0].url}
          className={styles.img}
        />
        <div className={styles.albumName}>
          {track.album.name}
        </div>
        <div className={styles.trackNo}>
          {track.track_number}
        </div>
      </div>

      <h1 className={styles.title}>
        {name}
      </h1>

      <dl className={styles.infosheet}>
        {track.artists.map(artist =>
          <div className={styles.category} key={artist.role}>
            <dt>
              {translation.credits[artist.role]}
            </dt>
            <dd>
              {artist.members.map(member => 
                <div key={member.name}>
                  {member.name}
                </div>
              )}
            </dd>
          </div>
        )}
      </dl>

      <div className={styles.hr}>
        <div className={styles.name}>
          {track.name}
        </div>
      </div>

      <div className={styles.lyrics}>
        {track.lyrics
          ? track.lyrics.split('\n').map((line, index) => 
              line !== ''
                ? <p key={index}>{line}</p>
                : <br key={index}/>
            )
          : <p>{translation.no_lyrics}</p>
        }
      </div>
    </div>
  )
}
