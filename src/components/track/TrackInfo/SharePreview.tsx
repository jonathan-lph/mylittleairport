import { RefObject, useEffect, useRef, useState } from 'react'
import styles from './SharePreview.module.sass'
import { ExpandedTrackObject } from '@src/types/Track'
import metadata from '@consts/metadata.json'
import reactDom from 'react-dom'

interface SharePreviewProps {
  track: ExpandedTrackObject
  lines: number[]
  parentRef: RefObject<HTMLDivElement>
}

export const SharePreview = ({ 
  track,
  lines,
  parentRef
}: SharePreviewProps): JSX.Element => {
  const portalRef = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    portalRef.current = document.getElementById('portal')
    setMounted(true)
  }, [])

  if (!mounted || !portalRef.current) return <></>;
  return reactDom.createPortal(
    <div className={styles.root}>
      <div ref={parentRef} className={styles.export}>
        <div className={styles.track}>{track.name}</div>
        <div className={styles.lyrics}>
          {track.lyrics
            ?.split('\n')
            .splice(lines[0], lines.length)
            .map((line, index) =>
              line !== '' ? <p key={index}>{line}</p> : <br key={index} />
            )}
        </div>
        <img src={track.album.images[0].url} className={styles.img} />
        <div className={styles.info}>
          <div className={styles.album}>{track.album.name}</div>
          <div className={styles.mla}>my little airport</div>
        </div>
        <div className={styles.credits}>{`${metadata.base_url.slice(8)}`}</div>
      </div>
    </div>
    ,portalRef.current
  )
}
