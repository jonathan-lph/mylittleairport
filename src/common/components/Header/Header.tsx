import styles from './Header.module.sass'
import translationJSON from '@common/translation/common.json'
import { Icon, Logo } from '@common/components/Icon'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Track } from '@src/common/asset/mla'
import { useRef, useState, useEffect, FormEvent } from 'react'
import { SearchBar } from './SearchBar'
import clsx from 'clsx'

interface HeaderProps {
  locale: string
}

export const Header = ({ 
  locale,
}: HeaderProps) : JSX.Element => {
  
  const router = useRouter()
  const [searchMode, setSearchMode] = useState(false)

  // @ts-ignore
  const translation = translationJSON[locale ?? 'zh'].header

  const handleRandomRedirect = () => {
    const getRandom = <T,>(arr : Array<T>) => arr[Math.floor(Math.random() * arr.length)]
    const tracks : Array<Track> = require('@common/asset/tracks.json')
    const track = getRandom(tracks)
    router.push({
      pathname: '/[locale]/[album]/[track]',
      query: {
        locale: locale,
        album: getRandom(track.album).slug,
        track: track.slug
      }
    })
  }

  const handleSwitchMode = () => {
    if (!searchMode) setSearchMode(true)
  }
  
  return (
    <header className={clsx({
      [styles.root]: true,
      [styles.searchMode]: searchMode
    })}>
      <nav className={styles.nav}>
        <Link href={`/`}>
          <a>
            <Logo className={styles.logo}/>
          </a>
        </Link>
        <div className={styles.actionButtons}>
          <button className={styles.actionButton} onClick={handleRandomRedirect}>
            <Icon
              icon='shuffle'
              className={styles.icon}
            />
            {translation.shuffle}
          </button>
          {!searchMode &&
            <button className={styles.actionButton} onClick={handleSwitchMode}>
              <Icon
                icon='search'
                className={styles.icon}
              />
              {translation.search}
            </button>
          }
        </div>
      </nav>
      {searchMode && 
        <SearchBar
          open={searchMode}
          setOpen={setSearchMode}
          locale={locale}
        />
      }
    </header>
  )
}