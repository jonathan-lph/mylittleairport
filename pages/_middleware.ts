import { NextResponse } from 'next/server'
import { Locales } from '@src/consts/definitions'

import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {   
  const url = request.nextUrl.clone()   
  if (url.pathname === '/') {
    url.pathname = `/${Locales.ZH}/albums`
    return NextResponse.redirect(url)   
  } 
}