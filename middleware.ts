import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Only protect /builder routes
  if (!request.nextUrl.pathname.startsWith('/builder')) {
    return NextResponse.next()
  }

  const authCookie = request.cookies.get('hatchit-auth')
  
  if (authCookie?.value === 'authenticated') {
    return NextResponse.next()
  }

  if (request.nextUrl.pathname === '/api/auth') {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.svg).*)'],
}