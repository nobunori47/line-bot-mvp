'use server'

import { fetchBroadcastTargetUserIds } from '@/lib/supabase'
import { pushMessage } from '@/lib/line'

export type BroadcastState =
  | { step: 'input'; error?: string }
  | { step: 'confirm'; message: string; userCount: number; sampleUserIds: string[] }
  | { step: 'done'; successCount: number; failureCount: number }

export async function broadcastAction(
  _prevState: BroadcastState,
  formData: FormData
): Promise<BroadcastState> {
  const currentStep = formData.get('step') as string

  if (currentStep === 'cancel') {
    return { step: 'input' }
  }

  if (currentStep === 'input') {
    const message = (formData.get('message') as string | null)?.trim() ?? ''
    if (!message) return { step: 'input', error: 'メッセージを入力してください' }
    if (message.length > 5000) return { step: 'input', error: 'メッセージは5000文字以内で入力してください' }

    const userIds = await fetchBroadcastTargetUserIds()
    return {
      step: 'confirm',
      message,
      userCount: userIds.length,
      sampleUserIds: userIds.slice(0, 5),
    }
  }

  if (currentStep === 'confirm') {
    const message = (formData.get('message') as string | null) ?? ''
    const userIds = await fetchBroadcastTargetUserIds()

    let successCount = 0
    let failureCount = 0
    for (const userId of userIds) {
      try {
        await pushMessage(userId, message)
        successCount++
      } catch (e) {
        console.error(`Broadcast failed for user ${userId}:`, e)
        failureCount++
      }
    }
    return { step: 'done', successCount, failureCount }
  }

  return { step: 'input' }
}
