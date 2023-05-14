import { Locales } from '@src/consts/definitions'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Home: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace(`/${Locales.ZH}/albums`)
  }, [])

  return (<></>)
}

export default Home
