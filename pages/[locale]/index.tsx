import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { locales, Locales } from '@src/consts/definitions'

import type { GetStaticPaths, GetStaticProps } from 'next'
import type { ParsedUrlQuery } from 'querystring'

const LocaleIndex = ({ locale }: LocaleIndexProps): JSX.Element => {
  const router = useRouter()

  useEffect(() => {
    router.replace(`/${locale}/albums`)
  }, [router])

  return <></>
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: locales.map(({ locale }) => ({
      params: { locale },
    })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context.params as IParams
  return {
    props: {
      locale,
    },
  }
}

export default LocaleIndex

type LocaleIndexProps = {
  locale: Locales
}

interface IParams extends ParsedUrlQuery {
  locale: Locales
}
