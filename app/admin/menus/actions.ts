'use server'

import { redirect } from 'next/navigation'
import { createMenu, updateMenu, deleteMenu } from '@/lib/supabase'

function validateMenuFields(formData: FormData): string | null {
  const name = (formData.get('name') as string | null)?.trim() ?? ''
  const priceStr = (formData.get('price') as string | null)?.trim() ?? ''
  const description = (formData.get('description') as string | null)?.trim() ?? ''

  if (!name) return 'メニュー名を入力してください'
  if (name.length > 100) return 'メニュー名は100文字以内で入力してください'
  if (!priceStr) return '料金を入力してください'
  const price = Number(priceStr)
  if (!Number.isInteger(price) || price < 0) return '料金は0以上の整数で入力してください'
  if (!description) return '説明を入力してください'
  if (description.length > 1000) return '説明は1000文字以内で入力してください'
  return null
}

export async function createMenuAction(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const error = validateMenuFields(formData)
  if (error) return error

  await createMenu({
    name: (formData.get('name') as string).trim(),
    price: Number((formData.get('price') as string).trim()),
    description: (formData.get('description') as string).trim(),
  })

  redirect('/admin/menus')
}

export async function updateMenuAction(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const id = formData.get('id') as string | null
  if (!id) return 'IDが不正です'

  const error = validateMenuFields(formData)
  if (error) return error

  await updateMenu(id, {
    name: (formData.get('name') as string).trim(),
    price: Number((formData.get('price') as string).trim()),
    description: (formData.get('description') as string).trim(),
  })

  redirect('/admin/menus')
}

export async function deleteMenuAction(id: string): Promise<void> {
  await deleteMenu(id)
  redirect('/admin/menus')
}
