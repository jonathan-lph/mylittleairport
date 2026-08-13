import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' } : {}),
  reactStrictMode: true,
  sassOptions: {
    loadPaths: [path.join(__dirname)]
  }
}

export default nextConfig
