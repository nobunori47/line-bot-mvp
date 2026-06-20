'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { generateToken, COOKIE_NAME, COOKIE_MAX_AGE } from '@/lib/auth'

export async function loginAction(_prevState: string | null, formData: FormData): Promise<string> {
  const input = formData.get('password')
  if (typeof input !== 'string' || input.trim() === '') {
    return 'パスワードを入力してください'
  }

  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) throw new Error('ADMIN_PASSWORD is not set')

  if (input !== adminPassword) {
    return 'パスワードが正しくありません'
  }

  const token = await generateToken()
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
  })

  redirect('/admin')
}
