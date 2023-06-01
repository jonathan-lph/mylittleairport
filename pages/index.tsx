import Head from 'next/head'
import { Locales } from '@consts/definitions'
import metadata from '@consts/metadata.json'

import type { NextPage } from 'next'

const Home: NextPage = () => {

  const host = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : `${metadata.base_url}`

  return (
    <Head>
      <meta httpEquiv="refresh" content={`0; url='${host}/${Locales.ZH}/albums'`}/>
    </Head>
  )
}

export default Home