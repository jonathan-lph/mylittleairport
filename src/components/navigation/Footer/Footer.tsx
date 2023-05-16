import styles from './Footer.module.sass'
import translationJSON from '@translations/common.json'
import { Icon, Logo } from '@components/Icon'
import { MouseEvent, useEffect, useState, useRef } from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { locales, credits, Locales } from '@consts/definitions'

interface FooterProps {
  locale: Locales
}


export const Footer = ({ 
  locale,
}: FooterProps) : JSX.Element => {

  const router = useRouter()
  
  // @ts-ignore
  const translation = translationJSON[locale ?? Locales.ZH].footer
  
  return (
    <footer className={styles.root}>

      <div className={styles.language}>
        <Icon
          icon="language" 
          className={styles.globe}
        />
        <div className={styles.locales}>
          {locales.map(({locale, label}) =>
            <Link key={label} href={{
              pathname: router.pathname,
              query: { 
                ...router.query,
                locale: locale 
              }
            }}>
              <a className={clsx({
                [styles.locale]: true,
                [styles.selected]: locale === router.query.locale
              })}>
                {label}
              </a>
            </Link>
          )}
        </div>
      </div>

      <div className={styles.copyright}>
        <div>{translation.copyright_name}</div>
        <div>{translation.copyright_year}</div>
      </div>

      <a href={credits.link} className={styles.credits} target="_blank" rel="noreferrer">
        <div>{translation.design}</div>
        <div>{` ${credits.name} `}</div>
      </a>

    </footer>
  )
}