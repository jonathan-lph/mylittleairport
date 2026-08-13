const path = require('path')

const isDev = process.env.NODE_ENV === 'development'

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: isDev,
  cacheOnFrontEndNav: true
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  sassOptions: {
    loadPaths: [path.join(__dirname)]
  }
}

module.exports = withPWA(nextConfig)
