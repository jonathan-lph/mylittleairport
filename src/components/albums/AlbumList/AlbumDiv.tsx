import { useRef, useEffect } from "react"
import styles from "./AlbumDiv.module.sass"
import type { Album, AlbumEdition, AlbumType } from "@src/common/asset/mla"

interface AlbumDivProps {
  album: Album
  locale: string
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
          src={`/album_artwork/${album.slug}.jpg`}
          className={styles.img}
        />
      </div>
      <div className={styles.name}>
        {album.name}
      </div>
      <div className={styles.year}>
        {album.date}
      </div>
    </a>
  )
}