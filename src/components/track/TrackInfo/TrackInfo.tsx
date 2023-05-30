import { useState } from 'react'
import { ShareExport } from '.'
import { Icon } from '@components/Icon'
import { useDelayUnmount } from '@hooks/index'
import styles from './TrackInfo.module.sass'

import type { ExpandedTrackObject } from '@__types/Track'
import type translationJSON from '@translations/track.json'
import type { Locales } from '@consts/definitions'

export const TrackInfo = ({
  track,
  translation,
}: TrackInfoProps): JSX.Element => {
  const [openExport, setOpenExport] = useState(false)
  const shouldRenderExportDialog = useDelayUnmount(openExport, 250)

  const closeExportDialog = () => setOpenExport(false)

  return (
    <div className={styles.root}>
      <figure className={styles.imgBorder}>
        <img src={track.album.images[0].url} className={styles.img} />
        <figcaption>
          <div className={styles.albumName}>{track.album.name}</div>
          <div className={styles.trackNo}>{track.track_number}</div>
        </figcaption>
      </figure>

      <h1 className={styles.title}>{track.name}</h1>

      <dl className={styles.infosheet}>
        {track.artists.map((artist) => (
          <div className={styles.category} key={artist.role}>
            <dt>{translation.credits[artist.role]}</dt>
            <dd>
              {artist.members.map((member) => (
                <div key={member.name}>{member.name}</div>
              ))}
            </dd>
          </div>
        ))}
      </dl>

      <div className={styles.vr}>
        <div className={styles.name}>{track.name}</div>
      </div>

      <div className={styles.lyrics}>
        {track.lyrics ? (
          track.lyrics
            .split('\n')
            .map((line, index) =>
              line !== '' ? <p key={index}>{line}</p> : <br key={index} />
            )
        ) : (
          <p>{translation.no_lyrics}</p>
        )}
        <button
          className={styles.shareLyrics}
          onClick={() => setOpenExport(true)}
        >
          {translation.export.button}
          <Icon icon="arrow_forward" className={styles.forward} />
        </button>
      </div>

      {shouldRenderExportDialog && (
        <ShareExport
          translation={translation}
          track={track}
          open={openExport}
          closeSelf={closeExportDialog}
        />
      )}
    </div>
  )
}

interface TrackInfoProps {
  track: ExpandedTrackObject
  translation: (typeof translationJSON)[Locales.ZH]
}