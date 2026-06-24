import { verifyLineSignature, replyText, pushMessage } from '@/lib/line'
import { generateFaqResponse } from '@/lib/claude'
import { fetchAllFaqs, saveConversation } from '@/lib/supabase'
import type { LineWebhookBody, LineMessageEvent } from '@/types/line'

async function processMessage(
  replyToken: string,
  lineUserId: string,
  userMessage: string
): Promise<void> {
  let answer = ''
  let confidence = 0
  let confidence_label: 'high' | 'medium' | 'low' = 'low'
  let escalated = false

  try {
    const faqs = await fetchAllFaqs()
    const result = await generateFaqResponse(userMessage, faqs)
    answer = result.answer
    confidence = result.confidence
    confidence_label = result.confidence_label

    if (confidence >= 5) {
      await replyText(replyToken, answer)
    } else {
      escalated = true
      console.warn('[escalation] Low confidence response — owner notification needed', {
        lineUserId,
        userMessage,
        answer,
        confidence,
        confidence_label,
      })

      const ownerId = process.env.LINE_OWNER_USER_ID
      if (!ownerId) {
        console.warn('[escalation] LINE_OWNER_USER_ID is not set — skipping push')
      } else {
        const notificationText =
          `【エスカレーション通知】\n` +
          `ユーザーからの質問に自信を持って回答できませんでした。\n\n` +
          `■ 質問内容\n${userMessage}\n\n` +
          `■ 確信度\n${confidence}/10（${confidence_label}）\n\n` +
          `■ AI回答案\n${answer}\n\n` +
          `確認のうえ、直接ご対応をお願いいたします。`
        try {
          await pushMessage(ownerId, notificationText)
        } catch (err) {
          console.error('[escalation] Failed to push owner notification:', err)
        }
      }
    }
  } catch (err) {
    console.error('[webhook] processMessage error:', err)
    answer = answer || '申し訳ございません。現在応答できない状態です。'
    escalated = true
  }

  try {
    await saveConversation({
      line_user_id: lineUserId,
      user_message: userMessage,
      bot_response: answer,
      confidence,
      confidence_label,
      escalated,
    })
  } catch (err) {
    console.error('[webhook] saveConversation error:', err)
  }
}

export async function POST(request: Request): Promise<Response> {
  const rawBody = await request.text()
  const signature = request.headers.get('x-line-signature')

  try {
    if (!verifyLineSignature(rawBody, signature)) {
      return Response.json({ error: 'Invalid signature' }, { status: 401 })
    }
  } catch {
    return Response.json({ error: 'Signature verification failed' }, { status: 500 })
  }

  const body = JSON.parse(rawBody) as LineWebhookBody

  if (body.events.length === 0) {
    return Response.json({ status: 'ok' })
  }

  for (const event of body.events) {
    if (event.type !== 'message') continue
    const msgEvent = event as LineMessageEvent
    if (msgEvent.message.type !== 'text') continue

    await processMessage(
      msgEvent.replyToken,
      msgEvent.source.userId,
      msgEvent.message.text
    )
  }

  return Response.json({ status: 'ok' })
}
