import { useEffect } from 'react'
import Head from 'next/head'

import { Footer, Header } from '@components/navigation'
import metadata from '@consts/metadata.json'
import '@styles/globals.sass'
import styles from '@styles/layout.module.sass'

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Configure height
    const appHeight = () =>
      document.documentElement.style.setProperty(
        '--app-height',
        `${window.innerHeight}px`
      )
    window.addEventListener('resize', appHeight)
    appHeight()
    return () => window.removeEventListener('resize', appHeight)
  }, [])

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
