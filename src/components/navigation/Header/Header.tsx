import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'

import { Locales } from '@src/consts/definitions'
import { useDelayUnmount } from '@hooks/index'
import { Icon, Logo } from '@components/Icon'
import { MobileMenu, SearchBar } from '.'
import translationJSON from '@translations/common.json'
import styles from './Header.module.sass'

import type { TocTrackObject } from '@__types/Track'

const LINKS = ['albums', 'tracks']
const DEAD_LINKS = ['artists', 'contribute']

export const Header = ({ locale }: HeaderProps): JSX.Element => {
  const router = useRouter()
  const searchButtonRef = useRef<HTMLButtonElement | null>(null)

  const [searchMode, setSearchMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const shouldRenderMenu = useDelayUnmount(menuOpen, 250)

  const translation = translationJSON[locale ?? Locales.ZH].header

  const handleRandomRedirect = () => {
    const getRandom = <T,>(arr: Array<T>) =>
      arr[Math.floor(Math.random() * arr.length)]
    const tracks: Array<TocTrackObject> = require('src/__data/toc/tracks.json')
    const track = getRandom(tracks)
    router.push({
      pathname: '/[locale]/track/[track]',
      query: {
        locale: locale ?? Locales.ZH,
        track: track.slug,
      },
    })
    closeMenu()
  }

  const toggleSearchMode = () => {
    setSearchMode((_saerchMode) => !_saerchMode)
    if (menuOpen) setMenuOpen(false)
  }

  const closeMenu = () => setMenuOpen(false)
  const toggleMenu = () => setMenuOpen((_menu) => !_menu)

  return (
    <header
      className={clsx({
        [styles.root]: true,
        [styles.searchMode]: searchMode,
      })}
    >
      <div className={styles.nav}>
        <Icon
          icon={!menuOpen ? 'menu' : 'close'}
          className={styles.menu}
          onClick={toggleMenu}
        />
        <Link href="/">
          <a className={styles.logoWrapper} onClick={closeMenu}>
            <Logo className={styles.logo} />
          </a>
        </Link>
        <nav className={styles.links}>
          {LINKS.map((dir) => (
            <Link
              key={dir}
              href={{
                pathname: `/[locale]/${dir}`,
                query: {
                  locale: locale ?? Locales.ZH,
                },
              }}
            >
              {translation[dir as keyof typeof translation]}
            </Link>
          ))}
        </nav>
        <section className={styles.actions}>
          <button
            className={styles.action}
            onClick={handleRandomRedirect}
          >
            <Icon icon="shuffle" className={styles.icon} />
            {translation.shuffle}
          </button>
          <button
            ref={searchButtonRef}
            className={clsx({
              [styles.action]: true,
              [styles.active]: searchMode,
            })}
            onClick={toggleSearchMode}
          >
            <Icon icon="search" className={styles.icon} />
            {translation.search}
          </button>
        </section>
      </div>
      {searchMode && (
        <SearchBar
          open={searchMode}
          toggleOpen={toggleSearchMode}
          locale={locale ?? Locales.ZH}
          searchButtonRef={searchButtonRef}
          translation={translation}
        />
      )}
      {shouldRenderMenu && (
        <MobileMenu
          locale={locale ?? Locales.ZH}
          consts={{ LINKS, DEAD_LINKS }}
          translation={translation}
          open={menuOpen}
          toggleOpen={toggleMenu}
        />
      )}
    </header>
  )
}

interface HeaderProps {
  locale: Locales
}