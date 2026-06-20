'use client'

import { useTransition } from 'react'
import { deleteMenuAction } from './actions'

export function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!window.confirm('このメニューを削除しますか？\nこの操作は取り消せません。')) return
    startTransition(async () => {
      await deleteMenuAction(id)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-sm text-red-600 hover:text-red-800 disabled:text-red-300 font-medium min-h-[44px] px-3"
    >
      {isPending ? '削除中...' : '削除'}
    </button>
  )
}
