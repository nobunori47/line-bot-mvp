import { createClient } from '@supabase/supabase-js'

export type Faq = {
  id: string
  question: string
  answer: string
  category: string
  created_at: string
  updated_at: string
}

export type Conversation = {
  id: string
  line_user_id: string
  user_message: string
  bot_response: string
  confidence: number
  confidence_label: 'high' | 'medium' | 'low'
  escalated: boolean
  created_at: string
}

function createSupabaseClient() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY
  if (!url) throw new Error('SUPABASE_URL is not set')
  if (!key) throw new Error('SUPABASE_SECRET_KEY is not set')
  return createClient(url, key)
}

export const supabase = createSupabaseClient()

export async function fetchAllFaqs(): Promise<Faq[]> {
  const { data, error } = await supabase.from('faq').select('*')
  if (error) throw new Error(`Failed to fetch FAQs: ${error.message}`)
  return data as Faq[]
}

export async function saveConversation(
  params: Omit<Conversation, 'id' | 'created_at'>
): Promise<void> {
  const { error } = await supabase.from('conversations').insert(params)
  if (error) throw new Error(`Failed to save conversation: ${error.message}`)
}

export async function fetchFaqCount(): Promise<number> {
  const { count, error } = await supabase
    .from('faq')
    .select('*', { count: 'exact', head: true })
  if (error) throw new Error(`Failed to fetch FAQ count: ${error.message}`)
  return count ?? 0
}

export async function fetchTodayConversationCount(): Promise<number> {
  // JST today start: UTC offset +9h
  const now = new Date()
  const jstOffset = 9 * 60 * 60 * 1000
  const jstNow = new Date(now.getTime() + jstOffset)
  const todayJst = new Date(
    Date.UTC(jstNow.getUTCFullYear(), jstNow.getUTCMonth(), jstNow.getUTCDate())
  )
  const todayUtcStart = new Date(todayJst.getTime() - jstOffset).toISOString()

  const { count, error } = await supabase
    .from('conversations')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', todayUtcStart)
  if (error) throw new Error(`Failed to fetch today conversation count: ${error.message}`)
  return count ?? 0
}

export async function fetchEscalationCount(): Promise<number> {
  const { count, error } = await supabase
    .from('conversations')
    .select('*', { count: 'exact', head: true })
    .eq('escalated', true)
  if (error) throw new Error(`Failed to fetch escalation count: ${error.message}`)
  return count ?? 0
}

export async function fetchFaqById(id: string): Promise<Faq> {
  const { data, error } = await supabase.from('faq').select('*').eq('id', id).single()
  if (error) throw new Error(`Failed to fetch FAQ: ${error.message}`)
  return data as Faq
}

export async function createFaq(data: {
  question: string
  answer: string
  category: string
}): Promise<void> {
  const { error } = await supabase.from('faq').insert(data)
  if (error) throw new Error(`Failed to create FAQ: ${error.message}`)
}

export async function updateFaq(
  id: string,
  data: { question: string; answer: string; category: string }
): Promise<void> {
  const { error } = await supabase
    .from('faq')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(`Failed to update FAQ: ${error.message}`)
}

export async function deleteFaq(id: string): Promise<void> {
  const { error } = await supabase.from('faq').delete().eq('id', id)
  if (error) throw new Error(`Failed to delete FAQ: ${error.message}`)
}

export type UserConversationSummary = {
  line_user_id: string
  latest_message: string
  latest_at: string
  has_escalation: boolean
}

export async function fetchConversationUserSummaries(): Promise<UserConversationSummary[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select('line_user_id, user_message, created_at, escalated')
    .order('created_at', { ascending: false })
  if (error) throw new Error(`Failed to fetch conversation summaries: ${error.message}`)

  const map = new Map<string, UserConversationSummary>()
  for (const row of data as Pick<Conversation, 'line_user_id' | 'user_message' | 'created_at' | 'escalated'>[]) {
    const existing = map.get(row.line_user_id)
    if (!existing) {
      map.set(row.line_user_id, {
        line_user_id: row.line_user_id,
        latest_message: row.user_message,
        latest_at: row.created_at,
        has_escalation: row.escalated,
      })
    } else if (row.escalated) {
      existing.has_escalation = true
    }
  }
  return Array.from(map.values())
}

export async function fetchConversationsByUser(lineUserId: string): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('line_user_id', lineUserId)
    .order('created_at', { ascending: true })
  if (error) throw new Error(`Failed to fetch conversations: ${error.message}`)
  return data as Conversation[]
}

export async function fetchBroadcastTargetUserIds(): Promise<string[]> {
  const { data, error } = await supabase.from('conversations').select('line_user_id')
  if (error) throw new Error(`Failed to fetch broadcast target users: ${error.message}`)
  return [...new Set((data as { line_user_id: string }[]).map((r) => r.line_user_id))]
}

export type Menu = {
  id: string
  name: string
  price: number
  description: string
  created_at: string
  updated_at: string
}

export async function fetchAllMenus(): Promise<Menu[]> {
  const { data, error } = await supabase.from('menus').select('*').order('created_at', { ascending: true })
  if (error) throw new Error(`Failed to fetch menus: ${error.message}`)
  return data as Menu[]
}

export async function fetchMenuById(id: string): Promise<Menu> {
  const { data, error } = await supabase.from('menus').select('*').eq('id', id).single()
  if (error) throw new Error(`Failed to fetch menu: ${error.message}`)
  return data as Menu
}

export async function createMenu(data: {
  name: string
  price: number
  description: string
}): Promise<void> {
  const { error } = await supabase.from('menus').insert(data)
  if (error) throw new Error(`Failed to create menu: ${error.message}`)
}

export async function updateMenu(
  id: string,
  data: { name: string; price: number; description: string }
): Promise<void> {
  const { error } = await supabase
    .from('menus')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(`Failed to update menu: ${error.message}`)
}

export async function deleteMenu(id: string): Promise<void> {
  const { error } = await supabase.from('menus').delete().eq('id', id)
  if (error) throw new Error(`Failed to delete menu: ${error.message}`)
}
