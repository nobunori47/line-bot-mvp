import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchFaqById } from '@/lib/supabase'
import { EditForm } from './EditForm'

export const dynamic = 'force-dynamic';

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let faq
  try {
    faq = await fetchFaqById(id)
  } catch {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/faqs" className="text-sm text-blue-600 hover:text-blue-800">
          ← 一覧に戻る
        </Link>
        <h1 className="text-xl font-bold text-gray-800 mt-2">FAQ 編集</h1>
      </div>

      <EditForm faq={faq} />
    </div>
  )
}
