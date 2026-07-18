import Link from 'next/link'
import {

export const dynamic = 'force-dynamic';
  fetchFaqCount,
  fetchTodayConversationCount,
  fetchEscalationCount,
} from '@/lib/supabase'

const NAV_LINKS = [
  { href: '/admin/faqs', label: 'FAQ 管理' },
  { href: '/admin/conversations', label: '会話ログ' },
  { href: '/admin/broadcast', label: 'お知らせ配信' },
  { href: '/admin/menus', label: 'メニュー管理' },
]

export default async function AdminDashboard() {
  const [faqCount, todayCount, escalationCount] = await Promise.all([
    fetchFaqCount(),
    fetchTodayConversationCount(),
    fetchEscalationCount(),
  ])

  const stats = [
    { label: 'FAQ 件数', value: faqCount },
    { label: '本日の問い合わせ', value: todayCount },
    { label: 'エスカレーション件数', value: escalationCount },
  ]

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-gray-800">ダッシュボード</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <nav className="flex flex-col gap-3">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-white border border-gray-200 rounded-xl px-5 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            {link.label}
            <span className="text-gray-400">›</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
