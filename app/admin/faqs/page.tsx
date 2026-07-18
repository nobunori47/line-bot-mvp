import Link from 'next/link'
import { fetchAllFaqs } from '@/lib/supabase'
import { DeleteButton } from './DeleteButton'

export const dynamic = 'force-dynamic';

export default async function FaqsPage() {
  const faqs = await fetchAllFaqs()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">FAQ 管理</h1>
        <Link
          href="/admin/faqs/new"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors min-h-[44px] flex items-center"
        >
          + 新規作成
        </Link>
      </div>

      {faqs.length === 0 ? (
        <p className="text-gray-500 text-sm">FAQ がまだ登録されていません。</p>
      ) : (
        <>
          {/* スマホ：カードリスト */}
          <div className="sm:hidden bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {faqs.map((faq) => (
              <div key={faq.id} className="px-4 py-3 flex flex-col gap-2">
                <span className="inline-block self-start text-xs font-medium text-gray-500 bg-gray-100 rounded px-2 py-0.5">
                  {faq.category}
                </span>
                <p className="text-sm text-gray-800 line-clamp-2">{faq.question}</p>
                <div className="flex gap-1 justify-end">
                  <Link
                    href={`/admin/faqs/${faq.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium min-h-[44px] px-3 flex items-center"
                  >
                    編集
                  </Link>
                  <DeleteButton id={faq.id} />
                </div>
              </div>
            ))}
          </div>

          {/* PC：テーブル */}
          <div className="hidden sm:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">質問</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium w-28">カテゴリ</th>
                  <th className="px-4 py-3 w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {faqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800 max-w-xs truncate">{faq.question}</td>
                    <td className="px-4 py-3 text-gray-600">{faq.category}</td>
                    <td className="px-4 py-3 flex items-center gap-1 justify-end">
                      <Link
                        href={`/admin/faqs/${faq.id}`}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium min-h-[44px] px-3 flex items-center"
                      >
                        編集
                      </Link>
                      <DeleteButton id={faq.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
