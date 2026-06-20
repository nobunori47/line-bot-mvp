'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { createFaqAction } from '../actions'

export default function NewFaqPage() {
  const [error, action, isPending] = useActionState(createFaqAction, null)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/faqs" className="text-sm text-blue-600 hover:text-blue-800">
          ← 一覧に戻る
        </Link>
        <h1 className="text-xl font-bold text-gray-800 mt-2">FAQ 新規作成</h1>
      </div>

      <form action={action} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
            質問 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="question"
            name="question"
            rows={3}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>

        <div>
          <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
            回答 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="answer"
            name="answer"
            rows={6}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            カテゴリ <span className="text-red-500">*</span>
          </label>
          <input
            id="category"
            name="category"
            type="text"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg py-3 text-base transition-colors"
        >
          {isPending ? '保存中...' : '保存する'}
        </button>
      </form>
    </div>
  )
}
