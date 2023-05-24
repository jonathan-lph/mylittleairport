import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import styles from './ShareExport.module.sass'
import { ExpandedTrackObject } from '@src/types/Track'
import h2c from 'html2canvas'
import clsx from 'clsx'
import { SharePreview } from './SharePreview'
import type translationJSON from '@translations/track.json'
import { Locales } from '@src/consts/definitions'
import { Icon } from '@src/components/Icon'

interface TrackInfoProps {
  translation: (typeof translationJSON)[Locales.ZH]
  track: ExpandedTrackObject
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export const ShareExport = ({
  translation,
  track,
  open,
  setOpen,
}: TrackInfoProps): JSX.Element => {
  const exportRef = useRef<HTMLDivElement | null>(null)
  const [selectedLyrics, setSelectedLyrics] = useState<number[]>([])
  const [imgUrl, setImgUrl] = useState<string | null>(null)

  const selectLyrics = (line: number) => () => {
    setSelectedLyrics((_selectedLyrics) => {
      if (_selectedLyrics.length === 0) return [line]
      const firstLine = _selectedLyrics[0]
      const lastLine  = _selectedLyrics[_selectedLyrics.length - 1]
      return !_selectedLyrics.includes(line)
        ?   firstLine === line+1 ? [line, ..._selectedLyrics]
          : lastLine  === line-1 ? [..._selectedLyrics, line]
          : [line]
        :   firstLine === line ? _selectedLyrics.slice(1)
          : lastLine  === line ? _selectedLyrics.slice(0,-1)
          : [line]
    })
  }

  const exportPng = async () => {
    const url = await h2c(exportRef.current!)
    setImgUrl(url.toDataURL())
  }

  const returnToSelect = () => {
    setImgUrl(null)
  }

  const handleClose = (e: MouseEvent) => {
    if (e.currentTarget === e.target) setOpen(false)
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  })

  return (
    <div className={clsx({
      [styles.backdrop]: true,
      [styles.unmount]: !open,
      [styles.mount]: open,
    })} onClick={handleClose}>
      <dialog className={styles.dialog} open={open}>
        <div className={styles.inner}>
          <div className={styles.titleDiv}>
            <div className={styles.title}>
              {!imgUrl
                ? translation.export.pre.title
                : translation.export.post.title}
            </div>
            <button className={styles.closeDiv} onClick={() => setOpen(false)}>
              <Icon icon="close" className={styles.close}/>
            </button>
          </div>
          {!imgUrl ? (
            <>
              <div className={styles.selectLyrics}>
                {track.lyrics?.split('\n').map((line, index) => (
                  <p
                    key={index}
                    onClick={selectLyrics(index)}
                    className={clsx({
                      [styles.selected]: selectedLyrics.includes(index),
                    })}
                  >
                    {line !== '' ? line : '\u00A0'}
                  </p>
                ))}
              </div>
              <button
                onClick={exportPng}
                className={clsx({
                  [styles.button]: true,
                  [styles.forward]: true,
                  [styles.enabled]: selectedLyrics.length !== 0,
                })}
                disabled={selectedLyrics.length === 0}
              >
                {translation.export.pre.action}
                <Icon icon="arrow_forward" className={styles.arrow} />
              </button>
            </>
          ) : (
            <>
              <figure className={styles.figure}>
                <img src={imgUrl} className={styles.exportImg} />
                <figcaption className={styles.caption}>
                  {translation.export.post.tooltip}
                </figcaption>
              </figure>
              <button
                onClick={returnToSelect}
                className={clsx(styles.button, styles.backward)}
              >
                <Icon icon="arrow_back" className={styles.arrow} />
                {translation.export.post.action}
              </button>
            </>
          )}
        </div>
      </dialog>
      <SharePreview
        track={track}
        lines={selectedLyrics}
        parentRef={exportRef!}
      />
    </div>
  )
}
