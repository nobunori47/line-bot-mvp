import Link from 'next/link'
import { fetchConversationUserSummaries } from '@/lib/supabase'

function formatJstShort(isoString: string): string {
  return new Date(isoString).toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function ConversationsPage() {
  const summaries = await fetchConversationUserSummaries()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-gray-800">会話ログ</h1>

      {summaries.length === 0 ? (
        <p className="text-gray-500 text-sm">会話ログがまだありません。</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">ユーザー</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">最終メッセージ</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium w-28">日時</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {summaries.map((s) => (
                <tr key={s.line_user_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/conversations/${encodeURIComponent(s.line_user_id)}`}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <span className="truncate max-w-[160px]">{s.line_user_id}</span>
                      {s.has_escalation && (
                        <span className="shrink-0 text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                          エスカレーション
                        </span>
                      )}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs truncate">
                    <Link
                      href={`/admin/conversations/${encodeURIComponent(s.line_user_id)}`}
                      className="block truncate hover:text-blue-600"
                    >
                      {s.latest_message}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {formatJstShort(s.latest_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
