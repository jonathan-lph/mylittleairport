const isDev = process.env.NODE_ENV === 'development'

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: isDev,
  cacheOnFrontEndNav: true
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer && !isDev) require('./src/scripts/generateSitemap.js')
    return config
  }
}

module.exports = withPWA(nextConfig)
