const fs = require('fs')
const globby = require('globby')
const metadata = require('../consts/metadata.json')
const tracks = require('../__data/toc/tracks.json')
const albums = require('../__data/toc/albums.json')

const LOCALES = {
  ZH: 'zh-hk',
  EN: 'en-us',
}

function injectDynamicPaths(path, query) {
  const regex = new RegExp('\\[.+\\]')
  return path
    .split('[')
    .flatMap((p) => p.split(']'))
    .reduce((acc, curr, idx) =>
      idx % 2 === 0 ? acc + curr : acc + query[curr]
    )
}

function addPage(page) {
  const DATE = new Date().toLocaleDateString('sv')
  const FREQ = 'weekly'
  const DYNAMIC_MAP = {
    '[locale]': Object.values(LOCALES),
    '[track]': tracks.map((track) => track.slug),
    '[album]': albums.map((album) => album.slug),
  }

  const path = page
    .replace('pages', '')
    .replace(/.jsx|.js|.mdx|.tsx|.ts/, '')
    .replace('/index', '')

  // Search for all dynamic paths (quoted in [<PATH>])
  const dynamicRegex = new RegExp('\\[(.+?)\\]', 'g')
  const result = [...page.matchAll(dynamicRegex)]
  // Populate values for all dynamic paths
  let queries = [{}]
  result.forEach((arr) => {
    const dynamicKey = arr[0]
    queries = queries.flatMap((query) =>
      DYNAMIC_MAP[dynamicKey].map((dynamicVal) => ({
        ...query,
        [dynamicKey.replace('[', '').replace(']', '')]: dynamicVal,
      }))
    )
  })

  return queries.reduce((acc, query) => {
    acc += '<url>'
    acc += `<loc>${metadata.base_url}${injectDynamicPaths(path, query)}</loc>`
    acc += `<lastmod>${DATE}</lastmod>`
    acc += `<changefreq>${FREQ}</changefreq>`
    if (query['locale']) {
      acc += queries
        // Filter all queries with only difference in locale
        .filter((_query) =>
          Object.entries(_query).every(([key, val]) =>
            key === 'locale' ? true : val === query[key]
          )
        )
        // Add xhtml:link tag for each route
        .reduce((_acc, _query) => {
          _acc += '<xhtml:link'
          _acc += ` rel="${
            _query.locale === LOCALES.ZH ? 'canonical' : 'alternate'
          }"`
          _acc += ` hreflang="${_query.locale}"`
          _acc += ` href="${metadata.base_url}${injectDynamicPaths(path, _query)}"`
          _acc += '/>'
          return _acc
        }, '')
    }
    acc += '</url>'
    return acc
  }, '')
}

async function generateSitemap() {
  // Ignore Next.js specific files (e.g., _app.js) and API routes.
  const pages = await globby([
    'pages/**/*{.js,.mdx,.ts,.tsx}',
    '!pages/_*{.js,.mdx,.ts,.tsx}',
    '!pages/404{.js,.mdx,.ts,.tsx}',
    '!pages/api',
  ])
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>'
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'
  sitemap += ' xmlns:xhtml="http://www.w3.org/1999/xhtml">'
  sitemap += pages.map(addPage).join('')
  sitemap += '</urlset>'

  fs.writeFileSync('public/sitemap.xml', sitemap)
}

generateSitemap()
