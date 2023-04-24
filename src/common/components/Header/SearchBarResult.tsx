import styles from './SearchBarResult.module.sass'
import translationJSON from '@common/translation/common.json'
import { Icon, Logo } from '@common/components/Icon'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Track } from '@src/common/asset/mla'
import { useRef, useState, useEffect, } from 'react'
import type { Dispatch, SetStateAction, FormEvent } from 'react'

interface SearchResult extends Pick<Track, 
  'name' | 
  'slug' | 
  'lyrics' | 
  'album'
> {
  line: number | null
}

interface SearchBarResultProps {
  result: Array<SearchResult>
  locale: string
  input: string
  setOpen: Dispatch<SetStateAction<boolean>>
}

const getRecLyrics = (
  lyrics: Array<string>, 
  line: number, 
  depth: number,
  transvered: Array<number>
) : Array<string> => {
  if (lyrics[line] === undefined || depth >= 2) 
    return [];
  const newDepth = lyrics[line] === '' ? depth : depth + 1
  const newTransvered = transvered.concat(line)
  let pre : Array<string> = [], pos : Array<string> = []
  if (!transvered.includes(line-1))
    pre = getRecLyrics(lyrics, line-1, newDepth, newTransvered)
  if (!transvered.includes(line+1))
    pos = getRecLyrics(lyrics, line+1, newDepth, newTransvered)
  return lyrics[line] === ''
    ? [pre, pos].flat()
    : [pre, lyrics[line], pos].flat()
}

const highlightTerms = (
  str: string | null,
  substr: string,
) : JSX.Element => {
  if (!str) return <></>
  return (<>
    {str
      .split(substr)
      .flatMap(_substr => [
        _substr, 
        <span className={styles.highlight}>{substr}</span>
      ])
      .slice(0, -1)
    }
  </>)
}

export const SearchBarResult = ({ 
  result,
  locale,
  input,
  setOpen
}: SearchBarResultProps) : JSX.Element => {

  // @ts-ignore
  const translation = translationJSON[locale ?? 'zh'].header

  return (
    <ul className={styles.root}>
      {result.length !== 0
        ? result
          .sort((a,b) => a.name.localeCompare(b.name, "zh-Hant"))
          .map(_track => 
            <Link key={_track.slug} href={{
              pathname: `/[locale]/[album]/[track]`,
              query: { 
                locale: locale,
                album: _track.album[0].slug,
                track: _track.slug
              }
            }}>
              <li className={styles.entry} onClick={() => setOpen(false)}>
                <img
                  src={`/album_artwork/${_track.album[0].slug}.jpg`}
                  className={styles.img}
                />
                <div className={styles.name}>
                  {highlightTerms(_track.name, input)}
                </div>
                <div className={styles.lyrics}>
                  {highlightTerms(
                    _track.line 
                      ? getRecLyrics(_track.lyrics!, _track.line!, 0, []).join('／')
                      : _track.lyrics?.slice(0, 3).join('／') ?? null,
                    input
                  )}
                </div>
              </li>
            </Link>
          )
        : <div className={styles.noResult}>
            {translation.no_result}
          </div>
      }
    </ul>
  )
}