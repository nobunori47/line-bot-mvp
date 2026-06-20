'use server'

import { redirect } from 'next/navigation'
import { createFaq, updateFaq, deleteFaq } from '@/lib/supabase'

function validateFaqFields(formData: FormData): string | null {
  const question = (formData.get('question') as string | null)?.trim() ?? ''
  const answer = (formData.get('answer') as string | null)?.trim() ?? ''
  const category = (formData.get('category') as string | null)?.trim() ?? ''

  if (!question) return '質問を入力してください'
  if (question.length > 500) return '質問は500文字以内で入力してください'
  if (!answer) return '回答を入力してください'
  if (answer.length > 2000) return '回答は2000文字以内で入力してください'
  if (!category) return 'カテゴリを入力してください'
  if (category.length > 50) return 'カテゴリは50文字以内で入力してください'
  return null
}

export async function createFaqAction(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const error = validateFaqFields(formData)
  if (error) return error

  await createFaq({
    question: (formData.get('question') as string).trim(),
    answer: (formData.get('answer') as string).trim(),
    category: (formData.get('category') as string).trim(),
  })

  redirect('/admin/faqs')
}

export async function updateFaqAction(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const id = formData.get('id') as string | null
  if (!id) return 'IDが不正です'

  const error = validateFaqFields(formData)
  if (error) return error

  await updateFaq(id, {
    question: (formData.get('question') as string).trim(),
    answer: (formData.get('answer') as string).trim(),
    category: (formData.get('category') as string).trim(),
  })

  redirect('/admin/faqs')
}

export async function deleteFaqAction(id: string): Promise<void> {
  await deleteFaq(id)
  redirect('/admin/faqs')
}
