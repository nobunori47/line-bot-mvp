import type { ReactNode } from 'react'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="text-lg font-bold text-gray-800">
          管理画面
        </Link>
        <a
          href="/admin/logout"
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          ログアウト
        </a>
      </header>
      <main className="px-4 py-6 max-w-2xl mx-auto">{children}</main>
    </div>
  )
}
