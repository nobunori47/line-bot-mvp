import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import type { Faq } from './supabase'

const ClaudeResponseSchema = z.object({
  answer: z.string(),
  confidence: z.number().int().min(0).max(10),
  confidence_label: z.enum(['high', 'medium', 'low']),
})

export type ClaudeResponse = z.infer<typeof ClaudeResponseSchema>

const client = new Anthropic()

function buildSystemPrompt(faqs: Faq[]): string {
  const faqText = faqs
    .map((f, i) => `[FAQ ${i + 1}]\n質問: ${f.question}\n回答: ${f.answer}\nカテゴリ: ${f.category}`)
    .join('\n\n')

  return `あなたは美容室のAIアシスタントです。以下のFAQリストを参照して、ユーザーの質問に丁寧に回答してください。

## FAQリスト
${faqText}

## 確信度のルール（必ず守ること）
- FAQに直接該当する記述がある場合: confidence = 8〜10、confidence_label = "high"
- FAQに関連する内容があるが直接の記述がない場合: confidence = 5〜7、confidence_label = "medium"
- FAQに直接該当する記述がない場合は confidence を必ず5以下にすること: confidence = 0〜4、confidence_label = "low"
- 完全に無関係な質問の場合: confidence = 0〜2、confidence_label = "low"

## confidence_label の定義（スコアと必ず一致させること）
- "high": confidence 8〜10
- "medium": confidence 5〜7
- "low": confidence 0〜4

FAQに記載のない内容については、その旨を伝えながらできる範囲で回答してください。`
}

export async function generateFaqResponse(
  userMessage: string,
  faqs: Faq[]
): Promise<ClaudeResponse> {
  const response = await client.messages.parse({
    model: 'claude-opus-4-8',
    max_tokens: 1024,
    system: buildSystemPrompt(faqs),
    messages: [{ role: 'user', content: userMessage }],
    output_config: {
      format: zodOutputFormat(ClaudeResponseSchema),
    },
  })

  const parsed = response.parsed_output
  if (!parsed) {
    throw new Error('Claude API returned unparseable response')
  }
  return parsed
}
