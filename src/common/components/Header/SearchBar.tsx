import styles from './SearchBar.module.sass'
import translationJSON from '@common/translation/common.json'
import { Icon, Logo } from '@common/components/Icon'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Track } from '@src/common/asset/mla'
import { useRef, useState, useEffect, } from 'react'
import type { Dispatch, SetStateAction, FormEvent } from 'react'
import { SearchBarResult } from './SearchBarResult'

interface SearchBarProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  locale: string
}

interface SearchResult extends Pick<Track, 
  'name' | 
  'slug' | 
  'lyrics' | 
  'album'
> {
  line: number | null
}

export const SearchBar = ({ 
  open,
  setOpen,
  locale,
}: SearchBarProps) : JSX.Element => {

  const ref = useRef<HTMLDivElement>(null)
  const [searchInput, setSearchInput] = useState('')
  const [searchResult, setSearchResult] = useState<Array<SearchResult> | null>(null)
  const loadedTracks = useRef<Track[] | null>(null)

  const handleInputChange = (e: FormEvent<HTMLInputElement>) => {
    setSearchInput(e.currentTarget.value)
  }

  useEffect(() => {
    const check = (e : Event) => {
      if (
        open && 
        ref.current && 
        !ref.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', check)
    return () => document.removeEventListener('mousedown', check)
  }, [open])

  useEffect(() => {

    if (!searchInput) {
      if (searchResult) setSearchResult(null);
      return;
    }

    const debouncer = setTimeout(() => {
      // Load Tracks
      if (!loadedTracks.current) {
        loadedTracks.current = require('@src/common/asset/tracks.json')
      }
      // Find matching name or lyrics tracks
      const _result : Array<SearchResult> = loadedTracks.current!
        .reduce((acc : Array<SearchResult>, _track: Track) => {
          const { name, slug, lyrics, album } = _track
          if (name.includes(searchInput)) 
            return [...acc, {
              line: null,
              name, slug, lyrics, album
            }]
          const lineIndex = lyrics?.findIndex(_line => _line.includes(searchInput))
          if (lineIndex !== undefined && lineIndex !== -1)
            return [...acc, {
              line: lineIndex,
              name, slug, lyrics, album
            }]
          return acc
        }, [])
      setSearchResult(_result)
      
    }, 500)
    return () => clearTimeout(debouncer)
  }, [searchInput])

  return (
    <div className={styles.inputWrapper} ref={ref}>
      <input 
        name="search" 
        type="text" 
        className={styles.input} 
        value={searchInput}
        onChange={handleInputChange}
      />
      <Icon icon="search" className={styles.icon}/>
      {searchResult && 
        <SearchBarResult
          result={searchResult}
          input={searchInput}
          locale={locale}
          setOpen={setOpen}
        />
      }
    </div>
  )
}