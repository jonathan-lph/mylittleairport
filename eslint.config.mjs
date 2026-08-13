import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const config = [
  ...(nextCoreWebVitals.default || nextCoreWebVitals),
  ...(nextTypescript.default || nextTypescript)
]

export default config
