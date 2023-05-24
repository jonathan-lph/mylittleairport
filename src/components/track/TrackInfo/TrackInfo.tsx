import { useEffect, useRef, useState, MouseEvent } from "react"
import styles from './TrackInfo.module.sass'
import { ExpandedTrackObject } from "@src/types/Track"
import { ShareExport } from "./ShareExport"
import type translationJSON from '@translations/track.json'
import { Locales } from "@src/consts/definitions"
import { Icon } from "@src/components/Icon"
import { useDelayUnmount } from "@hooks/index"

interface TrackInfoProps {
  track: ExpandedTrackObject
  translation: typeof translationJSON[Locales.ZH]
}

export const TrackInfo = ({ track, translation }: TrackInfoProps) : JSX.Element => {
  const { name } = track
  const [openExport, setOpenExport] = useState(false)
  const shouldRenderExportDialog = useDelayUnmount(openExport, 250)

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
        <button className={styles.shareLyrics} onClick={() => setOpenExport(true)}>
          {translation.export.button}
          <Icon icon="arrow_forward" className={styles.forward}/>
        </button>
      </div>

      {shouldRenderExportDialog && 
        <ShareExport
          translation={translation}
          track={track}
          open={openExport}
          setOpen={setOpenExport}
        />}

    </div>
  )
}
