'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { createMenuAction } from '../actions'

export const dynamic = 'force-dynamic';

export default function NewMenuPage() {
  const [error, action, isPending] = useActionState(createMenuAction, null)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/menus" className="text-sm text-blue-600 hover:text-blue-800">
          ← 一覧に戻る
        </Link>
        <h1 className="text-xl font-bold text-gray-800 mt-2">メニュー新規作成</h1>
      </div>

      <form action={action} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            メニュー名 <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            料金（円）<span className="text-red-500">*</span>
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            説明 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
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
