'use client'

import { useActionState } from 'react'
import { broadcastAction, type BroadcastState } from './actions'

export const dynamic = 'force-dynamic';

const initialState: BroadcastState = { step: 'input' }

export default function BroadcastPage() {
  const [state, action, isPending] = useActionState(broadcastAction, initialState)

  if (state.step === 'done') {
    return (
      <div key="done" className="flex flex-col gap-6">
        <h1 className="text-xl font-bold text-gray-800">送信完了</h1>
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-gray-800">
              <span className="font-semibold text-green-700">送信成功:</span>{' '}
              {state.successCount} 件
            </p>
            <p className="text-gray-800">
              <span className="font-semibold text-red-600">送信失敗:</span>{' '}
              {state.failureCount} 件
            </p>
          </div>
          <form action={action}>
            <input type="hidden" name="step" value="cancel" />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-5 py-3 text-base transition-colors"
            >
              別のメッセージを送る
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (state.step === 'confirm') {
    return (
      <div key="confirm" className="flex flex-col gap-6">
        <h1 className="text-xl font-bold text-gray-800">送信内容の確認</h1>
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5">
          <div>
            <p className="text-sm font-medium text-gray-500">送信対象</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{state.userCount} 人</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">
              対象ユーザー（先頭 {state.sampleUserIds.length} 件）
            </p>
            <ul className="flex flex-col gap-1">
              {state.sampleUserIds.map((id) => (
                <li key={id} className="text-sm text-gray-700 font-mono bg-gray-50 rounded px-3 py-1.5">
                  {id}
                </li>
              ))}
            </ul>
            {state.userCount > state.sampleUserIds.length && (
              <p className="text-xs text-gray-400 mt-1">
                他 {state.userCount - state.sampleUserIds.length} 件
              </p>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">送信メッセージ</p>
            <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-800 whitespace-pre-wrap text-sm border border-gray-200">
              {state.message}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <form action={action}>
              <input type="hidden" name="step" value="confirm" />
              <input type="hidden" name="message" value={state.message} />
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold rounded-lg py-3 text-base transition-colors"
              >
                {isPending ? '送信中...' : '送信する'}
              </button>
            </form>
            <form action={action}>
              <input type="hidden" name="step" value="cancel" />
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-white hover:bg-gray-50 disabled:text-gray-400 text-gray-700 font-semibold rounded-lg py-3 text-base border border-gray-300 transition-colors"
              >
                キャンセル（戻る）
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // step === 'input'
  return (
    <div key="input" className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-gray-800">お知らせ配信</h1>
      <form
        action={action}
        className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5"
      >
        <input type="hidden" name="step" value="input" />
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            メッセージ <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>

        {state.error && (
          <p className="text-sm text-red-600" role="alert">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg py-3 text-base transition-colors"
        >
          {isPending ? '確認中...' : '確認画面へ進む'}
        </button>
      </form>
    </div>
  )
}
