import { NextRequest, NextResponse } from 'next/server'

const PASSWORD = process.env.HATCHIT_PASSWORD || 'hatchit123'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (password === PASSWORD) {
    const response = NextResponse.json({ success: true })
    response.cookies.set('hatchit-auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })
    return response
  }

  return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
}