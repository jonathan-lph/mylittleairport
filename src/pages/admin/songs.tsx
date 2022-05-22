import type { NextPage } from 'next'
import Head from 'next/head'
import tracks from '@common/asset/tracks.json'
import type { Track, TrackAlbumRef } from '@src/common/asset/mla'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <table>
        {tracks.map((track: Track, idx: number) => {
          const {name, slug, album, duration} = track
          return (
            <tr>
              <td>
                {name}<br/>
                {slug}
              </td>
              <td style={{whiteSpace: 'pre-wrap'}}>
                {album.map((aList: TrackAlbumRef, _i: number) => 
                  `${aList.album} - ${aList.track}\n`
                )}
              </td>
              <td>{duration}</td>
            </tr>
          )
        })}
      </table>
    </div>
  )
}

export default Home