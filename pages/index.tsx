import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Locales } from '@src/consts/definitions'
import translationJSON from '@translations/main.json'
import metadata from '@consts/metadata.json'

import type { NextPage, GetStaticProps } from 'next'
import { mapMetaTags } from '@src/utils'

const Home: NextPage<HomeProps> = ({
  translation,
  metaTags
}) => {
  const router = useRouter()

  useEffect(() => {
    router.replace(`/${Locales.ZH}/albums`)
  }, [router])

  return (
    <>
      <Head>
        <title>{translation.meta.title}</title>
        {mapMetaTags(metaTags)}
      </Head>
    </>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = Locales.ZH
  const translation = translationJSON[locale]
  const metaTags = {
    'description': translation.meta.og_description,
    'og:title': translation.meta.og_title,
    'og:type': 'website',
    'og:url': `${metadata.base_url}`,
    'og:site_name': metadata.title,
    'og:description': translation.meta.og_description,
    'og:locale': locale,
    'og:locale:alternate': Object.values(Locales).filter(_loc => _loc !== locale)
  }

  return {
    props: {
      translation,
      metaTags
    }
  }
}

export default Home

type HomeProps = {
  translation: (typeof translationJSON)[Locales.EN]
  metaTags: Record<string, string | string[] | Record<string, string>[]>
}
