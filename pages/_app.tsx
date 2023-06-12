import { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { Footer, Header } from '@components/navigation'
import metadata from '@consts/metadata.json'
import { Locales } from '@consts/definitions'

import '@styles/globals.sass'
import styles from '@styles/layout.module.sass'

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname, query } = useRouter()
  useEffect(() => {
    // Configure height
    const appHeight = () =>
      document.documentElement.style.setProperty(
        '--app-height',
        `${window.innerHeight}px`
      )
    window.addEventListener('resize', appHeight)
    appHeight()
    // Configure html lang attribute
    document.documentElement.lang = pathname === '/' 
      ? Locales.ZH 
      : (query.locale as string).split('-')[0]
    return () => window.removeEventListener('resize', appHeight)
  }, [pathname, query])

  return (
    <>
      <Head>
        {Object.entries(metadata.app).map(([type, content]) => (
          <meta key={type} name={type} content={content} />
        ))}
      </Head>

      <Header locale={pageProps.locale} />
      <main className={styles.main}>
        <Component {...pageProps} />
      </main>
      <Footer locale={pageProps.locale} />
    </>
  )
}

export default MyApp
