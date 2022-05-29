import { Album, AlbumEdition, AlbumType } from "@src/common/asset/mla"
import { MouseEvent, useState } from "react"
import styles from "./AlbumList.module.sass"
import clsx from "clsx"
import { type } from "os"
import { Icon } from "@src/common/components/Icon"

interface AlbumListProps {
  albums: Array<Album>
  locale: string
  translation: any
}

const CATEGORIES : Array<{
  title: AlbumType,
  options: Array<AlbumEdition | null>
}> = [{
  title: 'album',
  options: ['retail', 'online', 'limited', 'collaboration']
}, {
  title: 'single',
  options: ['published', 'public', 'unlisted']
}, {
  title: 'compilation',
  options: ['hk', 'tw', 'international']
}]

export const AlbumList = ({
  albums,
  locale,
  translation
}: AlbumListProps) : JSX.Element => {

  const [option, setOption] = useState({
    album: 'retail',
    single: 'published',
    compilation: 'hk',
  })

  const handleSelect = 
    (cat: AlbumType, edition: AlbumEdition | null) => 
    (e: MouseEvent<HTMLLIElement>) => {
      setOption({
        ...option,
        [cat]: edition
      })
    }

  return (
    <div className={styles.root}>
      {CATEGORIES.map(({title, options}) => 
      <>
        <h1 className={styles.title}>
          {translation.title[title]}
        </h1>

        {options 
          ? <ul className={styles.options}>
              {options.map(_edition =>
                <li
                  onClick={handleSelect(title, _edition)}
                  className={clsx(styles.option, _edition === option[title] && styles.selected)}
                >
                  {_edition && translation.title[_edition]}
                </li>
              )}
            </ul>
          : <div/>}

        <div/>

        <div className={styles.list}>
          {options && options.map(_edition => 
            <>
            {albums
            .filter(_album => _album.type === title && _album.edition === _edition)
            .sort((a, b) => b.date - a.date)
            .map(album => 
              <a 
                className={clsx({
                  [styles.album]: true,
                  [styles.unselected]: option[title] !== _edition
                })}
                href={`/${locale}/${album.slug}`}
              >
                <div className={styles.name}>
                  {album.name}
                </div>
                <img 
                  src={`/album_artwork/${album.slug}.jpg`}
                  className={styles.img}
                />
                <div className={styles.year}>
                  {album.date}<br/>
                </div>
                <div className={styles.track}>
                  <Icon icon="music_note" className={styles.song}/>
                  {album.track_no}
                </div>
              </a>
            )}
            </>
          )}
        </div>

        <div className={styles.spacer}/>

      </>)}
    </div>
  )
}


