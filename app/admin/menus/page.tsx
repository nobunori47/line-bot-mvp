import Link from 'next/link'
import { fetchAllMenus } from '@/lib/supabase'
import { DeleteButton } from './DeleteButton'

export default async function MenusPage() {
  const menus = await fetchAllMenus()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">メニュー管理</h1>
        <Link
          href="/admin/menus/new"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors min-h-[44px] flex items-center"
        >
          + 新規作成
        </Link>
      </div>

      {menus.length === 0 ? (
        <p className="text-gray-500 text-sm">メニューがまだ登録されていません。</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">メニュー名</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium w-28">料金</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">説明</th>
                <th className="px-4 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {menus.map((menu) => (
                <tr key={menu.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800 font-medium">{menu.name}</td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    ¥{menu.price.toLocaleString('ja-JP')}
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{menu.description}</td>
                  <td className="px-4 py-3 flex items-center gap-1 justify-end">
                    <Link
                      href={`/admin/menus/${menu.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium min-h-[44px] px-3 flex items-center"
                    >
                      編集
                    </Link>
                    <DeleteButton id={menu.id} />
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
