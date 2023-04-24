import { Track } from "@src/common/asset/mla"
import styles from "./TrackList.module.sass"
import clsx from "clsx"

interface TrackListProps {
  tracks: Array<Track>
  locale: string
  translation: any
}

export const TrackList = ({
  tracks,
  locale,
  translation
}: TrackListProps) : JSX.Element => {
  return (
    <div className={styles.root}>
      <div></div>
      <ul className={styles.list}>
        {tracks
          .sort((a,b) => a.name.localeCompare(b.name, 'zh-Hant'))
          .flatMap(t => t.album.map(_t => ({...t, album: _t})))
          .map((track, trackIdx) => 
              // <li className={clsx({
              //   [styles.track]: true,
              //   [styles.variation]: idx !== 0
              // })} key={track.slug}>
              //   {idx === 0 && 
              //     <div className={styles.name} style={{gridRow: `span ${track.album.length}`}}>
              //       {track.name}
              //     </div>
              //   }
              //   <div className={styles.album}>
              //     {album.name}
              //   </div>
              // </li>  
              <li className={styles.track} key={track.slug}>
                <div className={styles.index}>
                  {trackIdx+1}
                </div>
                <div className={styles.album}>
                  {track.album.name}
                </div>
                <div className={styles.name}>
                  {track.name}
                </div>
                <img
                  src={`/album_artwork/${track.album.slug}.jpg`}
                  className={styles.img}
                />
              </li>
            )
        }
      </ul>
    </div>
  )
}