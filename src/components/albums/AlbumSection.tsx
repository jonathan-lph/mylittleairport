import Link from 'next/link'
import { useRef, useEffect } from 'react'
import styles from './AlbumSection.module.sass'

import type { AlbumObject } from '@__types/Album'
import type { Locales } from '@consts/definitions'

export const AlbumSection = ({ album, locale }: AlbumDivProps): JSX.Element => {
  const ref = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) entry.target.classList.add(styles.enter)
    })
    observer.observe(ref.current)
    return () => {
      if (!ref.current) return
      observer.unobserve(ref.current)
    }
  }, [])

  return (
    <Link href={{
      pathname: `/[locale]/album/[album]`,
      query: {
        locale: locale,
        album: album.slug,
      }
    }}>
      <a>
        <article className={styles.root} ref={ref}>
          <div className={styles.imgBorder}>
            <img
              src={album.images[0].url}
              alt={album.name}
              className={styles.img}
            />
          </div>
          <div className={styles.name}>{album.name}</div>
          <div className={styles.year}>{album.release_date}</div>
        </article>
      </a>
    </Link>
  )
}

interface AlbumDivProps {
  album: AlbumObject
  locale: Locales
}