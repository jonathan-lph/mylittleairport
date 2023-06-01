import { Locales } from '@consts/definitions'
import type { NextPage, GetStaticProps } from 'next'

const Home: NextPage = () => {
  return (<></>)
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    redirect: {
      destination: `/${Locales.ZH}/albums`,
      permanent: false
    }
  }
}

export default Home