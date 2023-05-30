import { Locales } from '@src/consts/definitions'
import translationJSON from '@translations/common.json'
import styles from '@styles/404.module.sass'

export default function Custom404() {
  return (
    <div className={styles.root}>
      <h1 className={styles.header}>404</h1>
      <div className={styles.messages}>
        {Object.entries(translationJSON).map(([locale, val]) => (
          <span key={locale}>
            {val.page_not_found.message}
          </span>
        ))}
      </div>
    </div>
  )
}