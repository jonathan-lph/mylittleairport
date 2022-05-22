import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import albums from "@common/asset/albums.json"
import { Album } from '@src/common/asset/mla'
import { ParsedUrlQuery } from 'querystring'

type AlbumDetailsProps = {
  album: Album
  props: any
}

const AlbumDetails: NextPage<AlbumDetailsProps> = ({ album, ...props }) => {
  return (
    <div>
      {album.name} 
    </div>
  )
}

interface IParams extends ParsedUrlQuery {
  album: string,
  locale: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: albums.map((album: Album) => ({ 
      params: { 
        album: album.slug,
        locale: 'zh'
      }
    })),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { album: _albumSlug, locale } = context.params as IParams
  const album: Album = albums.find(_album => _album.slug === _albumSlug) ?? albums[0]
  return {
    props: { album }
  }
}

export default AlbumDetails