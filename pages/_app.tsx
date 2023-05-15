import { Footer } from '@components/navigation/Footer'
import { Header } from '@components/navigation/Header'
import '@styles/globals.sass'
import styles from '@styles/layout.module.sass'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect } from 'react'
import metadata from '@consts/metadata.json'

function MyApp({ Component, pageProps }: AppProps) {

  useEffect(() => {
    // Configure height
    const appHeight = () => document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
    window.addEventListener('resize', appHeight)
    appHeight()
    // Setup Firebase Analytics
    // const analytics = getAnalytics(firebaseApp)
    // logEvent(analytics, 'page_view')
    return () => window.removeEventListener('resize', appHeight)
  }, []);

  return (<>

    <Head>
      {Object.entries(metadata.app).map(([type, content]) =>
        <meta key={type} name={type} content={content} />)}
    </Head>

    <div className={styles.root}>
      <Header
        locale={pageProps.locale}
      />
      <main className={styles.main}>
        <Component {...pageProps}/>
      </main>
      <Footer
        locale={pageProps.locale}
      />
    </div>

  </>)
}

export default MyApp
