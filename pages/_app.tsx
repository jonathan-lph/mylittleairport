import { Footer } from '@components/navigation/Footer'
import { Header } from '@components/navigation/Header'
import '@styles/globals.sass'
import styles from '@styles/layout.module.sass'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'

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

  return (
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
  )
}

export default MyApp
