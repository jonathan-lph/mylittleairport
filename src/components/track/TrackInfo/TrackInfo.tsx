import { Track, Album } from "@src/common/asset/mla"
import { Icon } from "@src/common/components/Icon"
import { FC, useEffect, useMemo, useRef, useState, MouseEvent } from "react"
import styles from './TrackInfo.module.sass'

interface TrackInfoProps {
  album: Album
  track: Track
  translation: any
}

const getTimestamp = (time: number): string => {
  const min = Math.floor(time / 60)
  const sec = Math.floor(time % 60).toString().padStart(2, '0')
  return `${min}:${sec}`
}

export const TrackInfo = ({ album, track, translation }: TrackInfoProps) : JSX.Element => {
  const { name, credits, lyrics } = track
  const [playing, setPlaying] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const timestamp   = useRef<HTMLSpanElement | null>(null)
  const progressBar = useRef<HTMLDivElement | null>(null)

  const playAudio = () => {
    if (audio !== null) {
      setPlaying(!playing)
      if (!playing)
        audio.play()
      else
        audio.pause()
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

  useEffect(() => {
    // if (track.audio)
      const _audioFile = new Audio(`/track_file/${album.slug}/${track.slug}.mp3`)
      _audioFile.onerror = e => {
        setAudio(null)
      }
      _audioFile.onloadedmetadata = e => {
        setAudio(_audioFile)
        if (!timestamp.current) return
        timestamp.current.innerText = getTimestamp(_audioFile.duration)
      }
  }, [])

  useEffect(() => {
    if (audio && !playing) {
      audio.ontimeupdate = e => {
        if (!timestamp.current || !progressBar.current) return
        timestamp.current.innerText = getTimestamp(audio.currentTime)
        progressBar.current.style.height = (audio.currentTime / audio.duration) * 100 + '%'
      }
      audio.onended = e => {
        setPlaying(false)
      }
    }
  }, [audio])

  return (
    <div className={styles.root}>

      <div className={styles.info}>
        <h1 className={styles.title}>
          {name}
        </h1>
        <dt className={styles.infosheet}>
          {Object
          .entries(credits)
          .map(([_type, _names]) => 
            <>
              <dl>
                {translation.credits[_type]}
              </dl>
              <dd>
                {_names?.map((_name) => 
                  <>
                    {_name}<br/>
                  </>
                )}
              </dd>
            </>
          )}
        </dt>
      </div>

      <div className={styles.vr}>
        <div 
          className={styles.base}
          onClick={handleJump}
        />
        {audio && !audio.error && <>
          <Icon
            icon={playing ? "pause" : "play"}
            onClick={playAudio}
            className={styles.pbIcon}
          />
          <div 
            className={styles.progress}
            ref={progressBar}
          />
          <span 
            className={styles.duration} 
            ref={timestamp}
          />
        </>}
      </div>


      <p className={styles.lyrics}>
        {lyrics?.map((line) => 
          <>
            {line}<br/>
          </>
        )}
      </p>

    </div>
  )
}
