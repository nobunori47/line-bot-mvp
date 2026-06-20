export const COOKIE_NAME = 'admin_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days
const AUTH_MESSAGE = 'admin_auth_v1'

export { COOKIE_MAX_AGE }

function getPassword(): string {
  const pw = process.env.ADMIN_PASSWORD
  if (!pw) throw new Error('ADMIN_PASSWORD is not set')
  return pw
}

async function importKey(password: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

function bufferToBase64url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function base64urlToBuffer(str: string): ArrayBuffer {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}

export async function generateToken(): Promise<string> {
  const key = await importKey(getPassword())
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(AUTH_MESSAGE))
  return bufferToBase64url(sig)
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const key = await importKey(getPassword())
    const sigBuf = base64urlToBuffer(token)
    return await crypto.subtle.verify('HMAC', key, sigBuf, new TextEncoder().encode(AUTH_MESSAGE))
  } catch {
    return false
  }
}
