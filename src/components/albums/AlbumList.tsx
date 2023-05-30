import { Fragment, useState } from 'react'
import clsx from 'clsx'
import { EditionSection } from '.'
import { 
  AlbumType,
  EditionType,
  AlbumEditionType,
  SingleEditionType,
  CompilationEditionType
} from '@__types/Album'
import styles from './AlbumList.module.sass'

import type { AlbumObject } from '@__types/Album'
import type { Locales } from '@consts/definitions'
import type translationJSON from '@translations/albums.json'

const CATEGORIES: Array<{
  type: AlbumType
  editions: EditionType[]
}> = [
  {
    type: AlbumType.ALBUM,
    editions: [
      AlbumEditionType.RETAIL,
      AlbumEditionType.ONLINE,
      AlbumEditionType.LIMITED,
      AlbumEditionType.COLLABORATION,
    ],
  },
  {
    type: AlbumType.SINGLE,
    editions: [
      SingleEditionType.PUBLISHED,
      SingleEditionType.PUBLIC,
      SingleEditionType.UNLISTED,
    ],
  },
  {
    type: AlbumType.COMPILATION,
    editions: [
      CompilationEditionType.HK,
      CompilationEditionType.TW,
      CompilationEditionType.INTL,
    ],
  },
]

export const AlbumList = ({
  albums,
  locale,
  translation,
}: AlbumListProps): JSX.Element => {
  const [currSection, setCurrSection] = useState('')

  return (
    <div className={styles.root}>
      {CATEGORIES.map(({ type, editions }) => (
        <section className={styles.category} key={type}>
          <aside>
            <div className={styles.titleWrapper}>
              <h2 className={styles.title}>
                {translation.title[type]
                  .split('--')
                  .map((_str: string, index: number) =>
                    <Fragment key={index}>
                      {index === 0 
                        ? _str
                        : <>-<wbr/>{_str}</>}
                    </Fragment>
                  )}
              </h2>
              <div className={styles.line} />
              <section className={styles.editionLinks}>
                {editions.map((_edition) => (
                  <a
                    href={`#${_edition}`}
                    className={clsx({
                      [styles.editionLink]: true,
                      [styles.active]: currSection === _edition,
                    })}
                    key={_edition}
                  >
                    {translation.title[_edition]}
                  </a>
                ))}
              </section>
            </div>
          </aside>

          <div className={styles.editions}>
            {editions.map((edition) => (
              <EditionSection
                key={edition}
                edition={edition}
                albums={albums
                  .filter(
                    (_album) =>
                      _album.album_type === type &&
                      _album.album_edition === edition
                  )
                  .sort(
                    (a, b) => Number(b.release_date) - Number(a.release_date)
                  )}
                title={translation.title[edition]}
                locale={locale}
                setCurrSection={setCurrSection}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

interface AlbumListProps {
  albums: AlbumObject[]
  locale: Locales
  translation: ((typeof translationJSON))[Locales.EN]
}