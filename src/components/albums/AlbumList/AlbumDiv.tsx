import { useRef, useEffect } from "react"
import styles from "./AlbumDiv.module.sass"
import type { Album, AlbumEdition, AlbumType } from "@src/common/asset/mla"
import { AlbumObject, ExpandedAlbumObject } from "@src/common/asset/types/Album"
import { Locales } from "@src/common/definitions"

interface AlbumDivProps {
  album: AlbumObject
  locale: Locales
}

export const AlbumDiv = ({
  album,
  locale,
}: AlbumDivProps) : JSX.Element => {

  const ref = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) 
        entry.target.classList.add(styles.enter)
    })
    observer.observe(ref.current)
    return () => {
      if (!ref.current) return;
      observer.unobserve(ref.current)
    }
  }, [])

  return (
    <a 
      className={styles.album}
      href={`/${locale}/${album.slug}`}
      ref={ref}
    >
      <div className={styles.imgBorder}>
        <img 
          src={album.images[0].url}
          className={styles.img}
        />
      </div>
      <div className={styles.name}>
        {album.name}
      </div>
      <div className={styles.year}>
        {album.release_date}
      </div>
    </a>
  )
}