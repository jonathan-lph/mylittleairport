import { NextResponse } from 'next/server'
import { Locales } from '@src/consts/definitions'

import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  if (url.pathname === '/') {
    url.pathname = `/${Locales.ZH}/albums`
    return NextResponse.redirect(url)
  } 
  // Match /[locale]
  const localeIndexRegex = new RegExp(`^\\/(${Object.values(Locales).join('|')})$`)
  const result = localeIndexRegex.exec(url.pathname)
  if (result !== null) {
    url.pathname = `/${result[1]}/albums`
    return NextResponse.redirect(url)
  }
}