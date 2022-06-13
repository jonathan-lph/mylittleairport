import styles from './Navigation.module.sass'
import translationJSON from '@common/translation/common.json'
import { Icon, Logo } from '@common/components/Icon'
import { MouseEvent, useEffect, useState, useRef } from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { locales } from '@src/common/definitions'


interface NavigationProps {
  locale: string
}

const links = ['albums', 'tracks']

const NavigationFooter = ({
  locale,
  translation
}) : JSX.Element => {

  const router = useRouter()

  return (
    <footer className={styles.footer}>

      <div className={styles.locales}>
        {locales.map(({locale, label}, idx) => <>
          <Link href={{
            pathname: router.pathname,
            query: { locale: locale }
          }}>
            {label}
          </Link>
          {idx < locales.length-1 && ' | '}
        </>)}
      </div>

      <div>
        {translation.copywrite_head}
        <a href={'https://jonathanl.dev'}>
          {' '}jonathan.lph{' '}
        </a>
        {translation.copywrite_tail}
      </div>

    </footer>
  )
}

export const Navigation = ({ 
  locale
}: NavigationProps) : JSX.Element => {

  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLElement | null>(null)
  
  const translation = translationJSON[locale ?? 'zh']?.navigation
  
  const openMenu  = (e: MouseEvent) => setOpen(true)
  const closeMenu = (e: MouseEvent) => setOpen(false)

  useEffect(() => {
    const check = (e: MouseEvent<HTMLElement>) => {
      if (open && ref.current && !ref.current.contains(e.target))
        setOpen(false)
    }
    document.addEventListener('mousedown', check)
    return () => document.removeEventListener('mousedown', check)
  }, [open])

  return (<>
    <div 
      className={clsx({
        [styles.backdrop]: true,
        [styles.open]: open
      })} 
    >
      <nav className={styles.nav} ref={ref}>
        <button className={styles.close} onClick={closeMenu}>
          <Icon icon="close"/>
        </button>
        <Logo className={styles.logo}/>
        <ul className={styles.links}>
          {links.map(link => 
            <li>
              <a href={`/${locale}/${link}`}>
                {translation?.[link]}
              </a>
            </li>
          )}
        </ul>
        <NavigationFooter
          locale={locale}
          translation={translation.footer}
        />
      </nav>
    </div>
    <div className={styles.mobileBar}>
      <Logo className={styles.logo}/>
      <Icon icon="menu" onClick={openMenu}/>
    </div>
  </>)
}