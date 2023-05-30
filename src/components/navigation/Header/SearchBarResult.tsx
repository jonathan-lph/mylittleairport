import Link from 'next/link'
import styles from './SearchBarResult.module.sass'

import type { TocTrackObject } from '@__types/Track'
import type { Locales } from '@consts/definitions'
import type translationJSON from '@translations/common.json'

const getLyricsRecurrsive = (
  lyrics: Array<string>,
  line: number,
  depth: number,
  transvered: Array<number>
): Array<string> => {
  if (lyrics[line] === undefined || depth >= 2) return []
  const newDepth = lyrics[line] === '' ? depth : depth + 1
  const newTransvered = transvered.concat(line)
  let pre: Array<string> = []
  let pos: Array<string> = []
  if (!transvered.includes(line - 1))
    pre = getLyricsRecurrsive(lyrics, line - 1, newDepth, newTransvered)
  if (!transvered.includes(line + 1))
    pos = getLyricsRecurrsive(lyrics, line + 1, newDepth, newTransvered)
  return lyrics[line] === ''
    ? [pre, pos].flat()
    : [pre, lyrics[line], pos].flat()
}

const highlightTerms = (str: string | null, substr: string): JSX.Element => {
  if (!str) return <></>
  return (
    <>
      {str
        .split(substr)
        .flatMap((_substr, idx) => [
          _substr,
          <span className={styles.highlight} key={idx}>
            {substr}
          </span>,
        ])
        .slice(0, -1)}
    </>
  )
}

export const SearchBarResult = ({
  result,
  locale,
  input,
  toggleOpen,
  translation
}: SearchBarResultProps): JSX.Element => {

  return (
    <dialog className={styles.root} open>
      <ul>
        {result.length !== 0 ? (
          result
            .sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant'))
            .map((_track) => (
              <Link
                key={_track.slug}
                href={{
                  pathname: `/[locale]/track/[track]`,
                  query: {
                    locale: locale,
                    track: _track.slug,
                  },
                }}
              >
                <li className={styles.entry} onClick={toggleOpen}>
                  <img src={_track.album.images[0]?.url} className={styles.img} />
                  <div className={styles.name}>
                    {highlightTerms(_track.name, input)}
                  </div>
                  <div className={styles.lyrics}>
                    {highlightTerms(
                      _track.line
                        ? getLyricsRecurrsive(
                            _track.lyrics!.split('\n'),
                            _track.line!,
                            0,
                            []
                          ).join('／')
                        : _track.lyrics?.split('\n').slice(0, 3).join('／') ?? null
                      , input
                    )}
                  </div>
                </li>
              </Link>
            ))
        ) : (
          <div className={styles.noResult}>{translation.no_result}</div>
        )}
      </ul>
    </dialog>
  )
}

interface SearchResult extends TocTrackObject {
  line: number | null
}

interface SearchBarResultProps {
  result: Array<SearchResult>
  locale: Locales
  input: string
  toggleOpen: () => void
  translation: (typeof translationJSON)[Locales.EN]['header']
}