import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Icon } from '@components/Icon'
import metadata from '@consts/metadata.json'
import { locales, Locales } from '@consts/definitions'
import translationJSON from '@translations/common.json'
import styles from './Footer.module.sass'

export const Footer = ({ locale }: FooterProps): JSX.Element => {
  const router = useRouter()
  const translation = translationJSON[locale ?? Locales.ZH].footer

  return (
    <footer className={styles.root}>
      <div className={styles.language}>
        <Icon icon="language" className={styles.globe} />
        <section className={styles.locales}>
          {locales.map(({ locale, label }) => (
            <Link
              key={label}
              href={{
                pathname: router.pathname,
                query: {
                  ...router.query,
                  locale: locale ?? Locales.ZH,
                },
              }}
            >
              <a
                className={clsx({
                  [styles.locale]: true,
                  [styles.active]: locale === (router.query.locale ?? Locales.ZH),
                })}
              >
                {label}
              </a>
            </Link>
          ))}
        </section>
      </div>

      <div className={styles.copyright}>
        <div>{translation.copyright_name}</div>
        <div>{translation.copyright_year}</div>
      </div>

      <a
        href={metadata.github_url}
        className={styles.credits}
        target="_blank"
        rel="noreferrer"
      >
        <Icon icon="github" aria-label="github"/>
      </a>
    </footer>
  )
}

interface FooterProps {
  locale: Locales
}