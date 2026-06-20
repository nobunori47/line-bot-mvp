'use client'

import { useActionState } from 'react'
import { updateFaqAction } from '../actions'
import type { Faq } from '@/lib/supabase'

export function EditForm({ faq }: { faq: Faq }) {
  const [error, action, isPending] = useActionState(updateFaqAction, null)

  return (
    <form action={action} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5">
      <input type="hidden" name="id" value={faq.id} />

      <div>
        <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
          質問 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="question"
          name="question"
          rows={3}
          required
          defaultValue={faq.question}
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
          defaultValue={faq.answer}
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
          defaultValue={faq.category}
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
        {isPending ? '更新中...' : '更新する'}
      </button>
    </form>
  )
}
