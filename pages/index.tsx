import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Locales } from '@src/consts/definitions'

import type { NextPage } from 'next'

const Home: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace(`/${Locales.ZH}/albums`)
  }, [router])

  return (<></>)
}

export default Home
