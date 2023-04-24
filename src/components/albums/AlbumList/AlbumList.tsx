import type { Album, AlbumEdition, AlbumType } from "@src/common/asset/mla"
import type { Dispatch, SetStateAction } from "react"
import { Fragment, useEffect, useRef, useState } from "react"
import styles from "./AlbumList.module.sass"
import clsx from "clsx"
import { AlbumDiv } from "."

interface AlbumListProps {
  albums: Array<Album>
  locale: string
  translation: any
}

interface EditionDivProps {
  albums: Array<Album>
  edition: string
  title: string
  locale: string
  setCurrSection: Dispatch<SetStateAction<string>>
}

const CATEGORIES : Array<{
  type: AlbumType,
  editions: Array<AlbumEdition>
}> = [{
  type: 'album',
  editions: ['retail', 'online', 'limited', 'collaboration']
}, {
  type: 'single',
  editions: ['published', 'public', 'unlisted']
}, {
  type: 'compilation',
  editions: ['hk', 'tw', 'international']
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
                .map((_str: string, index: number) => {
                  if (index === 0) return <>{_str}</>
                  return <>
                    -<wbr/>
                    {_str}
                  </> 
              })}
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
              key={_edition}
              edition={_edition}
              albums={albums
                .filter(_album => _album.type === type && _album.edition === _edition)
                .sort((a, b) => b.date - a.date)
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


