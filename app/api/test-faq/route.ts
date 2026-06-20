import { supabase } from '@/lib/supabase'
import type { Faq } from '@/lib/supabase'

export async function GET(): Promise<Response> {
  const { data, error } = await supabase.from('faq').select('*')
  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  return Response.json({ data: data as Faq[] })
}
