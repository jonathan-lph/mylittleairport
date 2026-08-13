const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  sassOptions: {
    loadPaths: [path.join(__dirname)]
  }
}

module.exports = nextConfig
