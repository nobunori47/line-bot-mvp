import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { COOKIE_NAME } from '@/lib/auth'

export async function GET() {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
  })
  redirect('/admin/login')
}
