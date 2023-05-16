import type { Album, AlbumType } from "@src/assets/archive/mla"
import type { Dispatch, SetStateAction } from "react"
import { Fragment, useEffect, useRef, useState } from "react"
import styles from "./AlbumList.module.sass"
import clsx from "clsx"
import { AlbumDiv } from "."
import { AlbumEditionType, AlbumObject, SingleEditionType, EditionType, CompilationEditionType, ExpandedAlbumObject } from "@src/types/Album"
import { Locales } from "@consts/definitions"
import type * as translationJSON from '@translations/albums.json'

interface AlbumListProps {
  albums: AlbumObject[]
  locale: Locales
  translation: typeof translationJSON[Locales.EN]
}

interface EditionDivProps {
  albums: AlbumObject[]
  edition: EditionType
  title: string
  locale: Locales
  setCurrSection: Dispatch<SetStateAction<string>>
}

const CATEGORIES : Array<{
  type: AlbumType,
  editions: EditionType[]
}> = [{
  type: 'album',
  editions: [
    EditionType.RETAIL, 
    AlbumEditionType.ONLINE, 
    AlbumEditionType.LIMITED,
    AlbumEditionType.COLLABORATION
  ]
}, {
  type: 'single',
  editions: [
    SingleEditionType.PUBLISHED,
    SingleEditionType.PUBLIC,
    SingleEditionType.UNLISTED
  ]
}, {
  type: 'compilation',
  editions: [
    CompilationEditionType.HK,
    CompilationEditionType.TW,
    CompilationEditionType.INTL
  ]
}]

const EditionDiv = ({
  albums,
  edition,
  title,
  locale,
  setCurrSection,
} : EditionDivProps) : JSX.Element => {

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) 
        setCurrSection(edition)
    })
    observer.observe(ref.current)
    return () => {
      if (!ref.current) return;
      observer.unobserve(ref.current)
    }
  }, [])

  return (
    <div 
      className={styles.edition} 
      ref={ref}
      id={edition}
    >
      <h3 className={styles.editionName}>
        {title}
      </h3>
      <div className={styles.albumList} >
        {albums.map(album => 
          <AlbumDiv
            album={album}
            locale={locale}
            key={album.slug}
          />
        )}
      </div>
    </div>
  )
}

export const AlbumList = ({
  albums,
  locale,
  translation
}: AlbumListProps) : JSX.Element => {

  const [currSection, setCurrSection] = useState('')

  return (
    <div className={styles.root}>
      {CATEGORIES.map(({type, editions}) => 
      <div className={styles.category} key={type}>

        <aside>
          <div className={styles.titleWrapper}>
            <h2 className={styles.title}>
              {translation.title[type]
                .split('--')
                .map((_str: string, index: number) => 
                  index === 0 
                  ? _str
                  : <Fragment key={index}>
                      -<wbr/>
                      {_str}
                    </Fragment> 
              )}
            </h2>
            <div className={styles.line}/>
            <div className={styles.editionLinks}>
              {editions.map(_edition => 
                <a 
                  href={`#${_edition}`}
                  className={clsx({
                    [styles.editionLink]: true,
                    [styles.active]: currSection === _edition
                  })}
                  key={_edition}
                >
                  {translation.title[_edition]}
                </a>  
              )}
            </div>
          </div>
        </aside>

        <div className={styles.editions}>
          {editions?.map(_edition => 
            <EditionDiv 
              key={_edition as unknown as string}
              edition={_edition}
              albums={albums
                .filter(_album => _album.album_type === type && _album.album_edition === _edition)
                .sort((a, b) => Number(b.release_date) - Number(a.release_date))
              }
              title={translation.title[_edition]}
              locale={locale}
              setCurrSection={setCurrSection}
            />
          )}
        </div>

      </div>)}
    </div>
  )
}


