import styles from './Header.module.sass'
import translationJSON from '@translations/common.json'
import { Icon, Logo } from '@components/Icon'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Track } from '@src/assets/archive/mla'
import { useRef, useState, useEffect, FormEvent } from 'react'
import { SearchBar } from './SearchBar'
import clsx from 'clsx'
import { TocTrackObject } from '@src/types/Track'

interface HeaderProps {
  locale: string
}

const LINKS = ["albums", "tracks"]
const DEAD_LINKS = ["artists", "contribute"]

export const Header = ({ 
  locale,
}: HeaderProps) : JSX.Element => {
  
  const router = useRouter()
  const [searchMode, setSearchMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // @ts-ignore
  const translation = translationJSON[locale ?? 'zh'].header

  const handleRandomRedirect = () => {
    const getRandom = <T,>(arr : Array<T>) => arr[Math.floor(Math.random() * arr.length)]
    const tracks : Array<TocTrackObject> = require('src/__data/toc/tracks.json')
    const track = getRandom(tracks)
    router.push({
      pathname: '/[locale]/[album]/[track]',
      query: {
        locale: locale,
        album: track.album.slug,
        track: track.slug
      }
    })
  }

  const handleSwitchMode = () => {
    if (!searchMode) setSearchMode(true)
  }

  const toggleMenu = () => {
    setMenuOpen(_menu => !_menu)
  }
  
  return (
    <header className={clsx({
      [styles.root]: true,
      [styles.searchMode]: searchMode
    })}>
      <nav className={styles.nav}>
        <Icon 
          icon={!menuOpen ? "menu" : "close"}
          className={styles.menuButton}
          onClick={toggleMenu}
        />
        <Link href={`/`}>
          <a className={styles.logoWrapper}>
            <Logo className={styles.logo}/>
          </a>
        </Link>
        <div className={styles.links}>
          {LINKS.map(dir => 
            <Link key={dir} href={{
              pathname: `/[locale]/${dir}`,
              query: { locale }
            }}>
              {translation[dir]}
            </Link> 
          )}
        </div>
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
      {menuOpen &&
        <div className={styles.menu}>
          {LINKS.map(dir => 
            <Link key={dir} href={{
              pathname: `/[locale]/${dir}`,
              query: { locale }
            }}>
              <a onClick={toggleMenu} className={styles.mobileLinks}>
                {translation[dir]}
              </a>
            </Link> 
          )}
          {DEAD_LINKS.map(dir =>
            <div key={dir} className={styles.deadLinks}>
              {translation[dir]}
              <div className={styles.comingSoon}>
                {translation.coming_soon}
              </div>
            </div>
          )}
        </div>
      }

    </header>
  )
}