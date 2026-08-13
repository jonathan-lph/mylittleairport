const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' } : {}),
  reactStrictMode: true,
  sassOptions: {
    loadPaths: [path.join(__dirname)]
  }
}

module.exports = nextConfig
