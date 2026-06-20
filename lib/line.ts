import crypto from 'node:crypto'

export function verifyLineSignature(body: string, signature: string | null): boolean {
  if (!signature) return false
  const secret = process.env.LINE_CHANNEL_SECRET
  if (!secret) throw new Error('LINE_CHANNEL_SECRET is not set')
  const hash = crypto.createHmac('sha256', secret).update(body).digest('base64')
  const hashBuf = Buffer.from(hash)
  const sigBuf = Buffer.from(signature)
  if (hashBuf.length !== sigBuf.length) return false
  return crypto.timingSafeEqual(hashBuf, sigBuf)
}

export async function replyText(replyToken: string, text: string): Promise<void> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN
  if (!token) throw new Error('LINE_CHANNEL_ACCESS_TOKEN is not set')
  const res = await fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      replyToken,
      messages: [{ type: 'text', text }],
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`LINE reply failed: ${res.status} ${err}`)
  }
}

export async function pushMessage(userId: string, text: string): Promise<void> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN
  if (!token) throw new Error('LINE_CHANNEL_ACCESS_TOKEN is not set')
  const res = await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      to: userId,
      messages: [{ type: 'text', text }],
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`LINE push failed: ${res.status} ${err}`)
  }
}
