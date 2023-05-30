import { usePortal } from '@hooks/index'
import metadata from '@consts/metadata.json'
import styles from './SharePreview.module.sass'

import type { RefObject } from 'react'
import type { ExpandedTrackObject } from '@__types/Track'

export const SharePreview = ({
  track,
  lines,
  parentRef,
}: SharePreviewProps): JSX.Element => {
  const [portal, createPortal] = usePortal()

  if (!portal) return <></>
  return createPortal(
    <section className={styles.root}>
      <article ref={parentRef} className={styles.export}>
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
      </article>
    </section>,
    portal
  )
}

interface SharePreviewProps {
  track: ExpandedTrackObject
  lines: number[]
  parentRef: RefObject<HTMLElement>
}