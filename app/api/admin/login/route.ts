import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { pin } = await req.json()
    const validPin = process.env.ADMIN_PIN || '12345'

    if (pin === validPin) {
      // Set a simple cookie for "session"
      // Use HttpOnly and Secure for basic security
      cookies().set('admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'PIN salah' }, { status: 401 })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
