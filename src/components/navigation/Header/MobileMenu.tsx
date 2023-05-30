import clsx from 'clsx'
import Link from 'next/link'
import { Locales } from '@consts/definitions'
import styles from './MobileMenu.module.sass'

import type { MouseEventHandler } from 'react'
import type translationJSON from '@translations/common.json'

export const MobileMenu = ({
  locale,
  consts,
  translation,
  open,
  toggleOpen,
}: MobileMenuProps): JSX.Element => {
  return (
    <nav
      className={clsx({
        [styles.root]: true,
        [styles.unmount]: !open,
        [styles.mount]: open,
      })}
    >
      <ul>
        {consts.LINKS.map((dir) => (
          <li key={dir}>
            <Link
              key={dir}
              href={{
                pathname: `/[locale]/${dir}`,
                query: {
                  locale: locale ?? Locales.ZH,
                }
              }}
            >
              <a onClick={toggleOpen} className={styles.links}>
                {translation[dir as keyof HeaderTranslation]}
              </a>
            </Link>
          </li>
        ))}
        {consts.DEAD_LINKS.map((dir) => (
          <li key={dir} className={styles.deadLinks}>
            {translation[dir as keyof HeaderTranslation]}
            <div className={styles.comingSoon}>{translation.coming_soon}</div>
          </li>
        ))}
      </ul>
    </nav>
  )
}

type HeaderTranslation = ((typeof translationJSON))[Locales.EN]['header']

interface MobileMenuProps {
  locale: Locales
  consts: {
    LINKS: string[]
    DEAD_LINKS: string[]
  }
  translation: HeaderTranslation
  open: boolean
  toggleOpen: MouseEventHandler
}
