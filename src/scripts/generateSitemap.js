const fs = require('fs')
const globby = require('globby')
const metadata = require('../consts/metadata.json')
const tracks = require('../__data/toc/tracks.json')
const albums = require('../__data/toc/albums.json')

const LOCALES = {
  ZH: 'zh-hk',
  EN: 'en-us',
}

function addPage(page) {
  const DATE = new Date().toLocaleDateString('sv')
  const FREQ = 'monthly'
  const DYNAMIC_MAP = {
    '[locale]': Object.values(LOCALES),
    '[track]': tracks.map((track) => track.slug),
    '[album]': albums.map((album) => album.slug),
  }

  const path = page
    .replace('pages', '')
    .replace(/.jsx|.js|.mdx|.tsx|.ts/, '')
    .replace('/index', '')

  const dynamicRegex = new RegExp('\\[(.+?)\\]', 'g')
  const result = [...page.matchAll(dynamicRegex)]
  let routes = [path]
  result.forEach((arr) => {
    const dynamicKey = arr[0]
    routes = routes.flatMap((route) =>
      DYNAMIC_MAP[dynamicKey].map((dynamicVal) =>
        route.replace(dynamicKey, dynamicVal)
      )
    )
  })

  return routes.reduce((acc, route) => {
    acc += '<url>'
    acc += `<loc>${metadata.base_url}${route}</loc>`
    acc += `<lastmod>${DATE}</lastmod>`
    acc += `<changefreq>${FREQ}</changefreq>`
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
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  sitemap += pages.map(addPage).join('')
  sitemap += '</urlset>'

  fs.writeFileSync('public/sitemap.xml', sitemap)
}

generateSitemap()
