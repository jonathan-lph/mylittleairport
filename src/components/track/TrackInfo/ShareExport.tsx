import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import h2c from 'html2canvas'
import { SharePreview } from '.'
import { Icon } from '@src/components/Icon'
import { usePortal } from '@hooks/index'
import styles from './ShareExport.module.sass'

import type { MouseEvent } from 'react'
import type { ExpandedTrackObject } from '@__types/Track'
import type translationJSON from '@translations/track.json'
import type { Locales } from '@consts/definitions'

const LyricsSelectionPanel = ({
  lyrics,
  translation,
  lines,
  buttonAction,
  selectLyrics,
}: LyricsSelectionPanelProps): JSX.Element => {
  return (
    <>
      <header className={styles.header}>
        <h4 className={styles.title}>{translation.title}</h4>
      </header>
      <div className={styles.selectLyrics}>
        {lyrics?.split('\n').map((line, index) => (
          <p
            key={index}
            onClick={selectLyrics(index)}
            className={clsx(lines.includes(index) && styles.selected)}
          >
            {line !== '' ? line : '\u00A0'}
          </p>
        ))}
      </div>
      <footer className={clsx(styles.footer, styles.forward)}>
        <button
          onClick={buttonAction}
          className={clsx({
            [styles.button]: true,
            [styles.enabled]: lines.length !== 0,
          })}
          disabled={lines.length === 0}
        >
          {translation.action}
          <Icon icon="arrow_forward" className={styles.arrow} />
        </button>
      </footer>
    </>
  )
}

const PreviewPanel = ({
  imgUrl,
  translation,
  buttonAction,
}: PreviewPanelProps): JSX.Element => {
  return (
    <>
      <header className={styles.header}>
        <h4 className={styles.title}>{translation.title}</h4>
      </header>
      <figure className={styles.figure}>
        <img
          src={imgUrl}
          alt="Export image."
          className={styles.exportImg}
        />
        <figcaption className={styles.caption}>
          {translation.tooltip}
        </figcaption>
      </figure>
      <footer className={clsx(styles.footer, styles.backward)}>
        <button
          onClick={buttonAction}
          className={clsx(styles.button, styles.backward)}
        >
          <Icon icon="arrow_back" className={styles.arrow} />
          {translation.action}
        </button>
      </footer>
    </>
  )
}

export const ShareExport = ({
  translation,
  track,
  open,
  closeSelf,
}: TrackInfoProps): JSX.Element => {
  const exportRef = useRef<HTMLElement | null>(null)
  const [selectedLines, setSelectedLines] = useState<number[]>([])
  const [imgUrl, setImgUrl] = useState<string | null>(null)
  const [portal, createPortal] = usePortal()

  const selectLyrics = (line: number) => () => {
    setSelectedLines((_selectedLines) => {
      if (_selectedLines.length === 0) return [line]
      const firstLine = _selectedLines[0]
      const lastLine = _selectedLines[_selectedLines.length - 1]
      return !_selectedLines.includes(line)
        ?   firstLine === line + 1 ? [line, ..._selectedLines]
          : lastLine  === line - 1 ? [..._selectedLines, line]
          : [line]
        :   firstLine === line ? _selectedLines.slice(1)
          : lastLine  === line ? _selectedLines.slice(0, -1)
          : [line]
    })
  }

  const handleClose = (e: MouseEvent) => {
    if (e.currentTarget === e.target) closeSelf()
  }

  const exportPng = async () => {
    const url = await h2c(exportRef.current!)
    setImgUrl(url.toDataURL())
  }

  const returnToSelect = () => setImgUrl(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  })

  if (!portal) return <></>
  return createPortal(
    <>
      <div
        className={clsx({
          [styles.backdrop]: true,
          [styles.unmount]: !open,
          [styles.mount]: open,
        })}
        onClick={handleClose}
      >
        <dialog className={styles.dialog} open={open}>
          <button className={styles.close} onClick={closeSelf}>
            <Icon icon="close" />
          </button>
          {!imgUrl ? (
            <LyricsSelectionPanel
              lyrics={track.lyrics}
              lines={selectedLines}
              selectLyrics={selectLyrics}
              buttonAction={exportPng}
              translation={translation.export.pre}
            />
          ) : (
            <PreviewPanel
              imgUrl={imgUrl}
              buttonAction={returnToSelect}
              translation={translation.export.post}
            />
          )}
        </dialog>
      </div>
      <SharePreview
        track={track}
        lines={selectedLines}
        parentRef={exportRef}
      />
    </>,
    portal
  )
}

interface TrackInfoProps {
  translation: ((typeof translationJSON))[Locales.ZH]
  track: ExpandedTrackObject
  open: boolean
  closeSelf: () => void
}

interface LyricsSelectionPanelProps {
  lyrics: ExpandedTrackObject['lyrics']
  lines: number[]
  buttonAction: () => void
  selectLyrics: (line: number) => () => void
  translation: (typeof translationJSON)[Locales.ZH]['export']['pre']
}

interface PreviewPanelProps {
  imgUrl: string
  buttonAction: () => void
  translation: (typeof translationJSON)[Locales.ZH]['export']['post']
}