import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchMenuById } from '@/lib/supabase'
import { EditForm } from './EditForm'

export default async function EditMenuPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let menu
  try {
    menu = await fetchMenuById(id)
  } catch {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/menus" className="text-sm text-blue-600 hover:text-blue-800">
          ← 一覧に戻る
        </Link>
        <h1 className="text-xl font-bold text-gray-800 mt-2">メニュー編集</h1>
      </div>

      <EditForm menu={menu} />
    </div>
  )
}
