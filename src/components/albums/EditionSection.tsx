import { useEffect, useRef } from 'react'
import { AlbumSection } from '.'
import styles from './EditionSection.module.sass'

import type { Dispatch, SetStateAction } from 'react'
import type { Locales } from '@consts/definitions'
import type { AlbumObject, EditionType } from '@__types/Album'

export const EditionSection = ({
  albums,
  edition,
  title,
  locale,
  setCurrSection,
}: EditionSectionProps): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setCurrSection(edition)
    })
    observer.observe(ref.current)
    return () => {
      if (!ref.current) return
      observer.unobserve(ref.current)
    }
  }, [edition, setCurrSection])

  return (
    <section className={styles.root} ref={ref} id={edition}>
      <h3 className={styles.edition}>{title}</h3>
      <div className={styles.albums}>
        {albums.map((album) => (
          <AlbumSection album={album} locale={locale} key={album.slug} />
        ))}
      </div>
    </section>
  )
}

interface EditionSectionProps {
  albums: AlbumObject[]
  edition: EditionType
  title: string
  locale: Locales
  setCurrSection: Dispatch<SetStateAction<string>>
}