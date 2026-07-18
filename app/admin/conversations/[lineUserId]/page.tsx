import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchConversationsByUser } from '@/lib/supabase'

export const dynamic = 'force-dynamic';

function formatJstFull(isoString: string): string {
  return new Date(isoString).toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const CONFIDENCE_LABEL: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
}

export default async function ConversationDetailPage({
  params,
}: {
  params: Promise<{ lineUserId: string }>
}) {
  const { lineUserId } = await params
  const userId = decodeURIComponent(lineUserId)
  const conversations = await fetchConversationsByUser(userId)

  if (conversations.length === 0) notFound()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/conversations" className="text-sm text-blue-600 hover:text-blue-800">
          ← 一覧に戻る
        </Link>
        <h1 className="text-xl font-bold text-gray-800 mt-2 break-all">
          ユーザー: {userId}
        </h1>
      </div>

      <div className="flex flex-col gap-4">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-gray-400">{formatJstFull(conv.created_at)}</span>
              {conv.escalated && (
                <span className="text-xs font-medium bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full shrink-0">
                  エスカレーション済み
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  ユーザー
                </span>
                <p className="text-gray-800 mt-0.5 whitespace-pre-wrap">{conv.user_message}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Bot
                </span>
                <p className="text-gray-800 mt-0.5 whitespace-pre-wrap">{conv.bot_response}</p>
              </div>
            </div>

            <div className="text-xs text-gray-400">
              確信度: {conv.confidence} ({CONFIDENCE_LABEL[conv.confidence_label] ?? conv.confidence_label})
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
