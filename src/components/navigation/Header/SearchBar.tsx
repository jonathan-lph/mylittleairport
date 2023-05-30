import { useRef, useState, useEffect } from 'react'
import { Icon } from '@components/Icon'
import { SearchBarResult } from '.'
import styles from './SearchBar.module.sass'

import type { MutableRefObject, FormEvent } from 'react'
import type { TocTrackObject } from '@__types/Track'
import type { Locales } from '@consts/definitions'
import type translationJSON from '@translations/common.json'

export const SearchBar = ({
  open,
  toggleOpen,
  locale,
  searchButtonRef,
  translation
}: SearchBarProps): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')
  const [result, setResult] = useState<SearchResult[] | null>(null)
  const loadedTracks = useRef<TocTrackObject[] | null>(null)

  const handleInputChange = (e: FormEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value)
  }

  // Turn off search mode if unfocused
  useEffect(() => {
    const check = (e: Event) => {
      if (
        open &&
        ref.current &&
        searchButtonRef.current &&
        !ref.current.contains(e.target as Node) &&
        !searchButtonRef.current.contains(e.target as Node)
      ) {
        toggleOpen()
      }
    }
    document.addEventListener('mousedown', check)
    return () => document.removeEventListener('mousedown', check)
  }, [open, searchButtonRef, toggleOpen])

  // Handle input change 
  useEffect(() => {
    if (!input) {
      if (result) setResult(null)
      return
    }
    const debouncer = setTimeout(() => {
      // Load Tracks
      if (!loadedTracks.current) {
        loadedTracks.current = require('src/__data/toc/tracks.json')
      }
      // Find matching name or lyrics tracks
      const _result : SearchResult[] = loadedTracks.current!
        .reduce((acc : SearchResult[], _track: TocTrackObject) => {
          if (_track.name.includes(input)) 
            return [...acc, {
              line: null,
              ..._track
            }]
          const lineIndex = _track.lyrics?.split('\n').findIndex(_line => _line.includes(input))
          if (lineIndex !== undefined && lineIndex !== -1)
            return [...acc, {
              line: lineIndex,
              ..._track
            }]
          return acc
        }, [])
      setResult(_result)
    }, 500)
    return () => clearTimeout(debouncer)
  }, [input, result])

  return (
    <div className={styles.inputWrapper} ref={ref}>
      <input
        name="search"
        type="text"
        className={styles.input}
        value={input}
        onChange={handleInputChange}
        autoFocus
      />
      <Icon icon="search" className={styles.icon} />
      {result && (
        <SearchBarResult
          result={result}
          input={input}
          locale={locale}
          toggleOpen={toggleOpen}
          translation={translation}
        />
      )}
    </div>
  )
}

interface SearchBarProps {
  open: boolean
  toggleOpen: () => void
  locale: Locales
  searchButtonRef: MutableRefObject<HTMLButtonElement | null>
  translation: (typeof translationJSON)[Locales.EN]['header']
}

interface SearchResult extends TocTrackObject {
  line: number | null
}