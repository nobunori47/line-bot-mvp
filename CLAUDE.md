# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
美容室向け LINE Bot + AI自動応答システム（AIエンジニア講座 模擬案件1）

**Note:** This uses Next.js 16 with breaking changes from earlier versions. Read `node_modules/next/dist/docs/` before writing Next.js-specific code.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build (also runs type check)
npm run lint     # ESLint check
```

Type checking: `npx tsc --noEmit`

## Architecture

This is a Next.js App Router project. The planned system flow:

```
LINE User → Webhook (POST /api/webhook) → Supabase (faq/menus) → Claude API → LINE reply / owner escalation
Admin UI  → /admin/*                   → Supabase CRUD
```

### Planned directory structure
```
app/
  api/
    webhook/route.ts       # LINE Webhook — validates x-line-signature, dispatches messages
    broadcast/route.ts     # One-time broadcast to all LINE friends
  admin/
    page.tsx               # Admin dashboard (FAQ/menu/announcement management)
  lib/
    line.ts                # LINE Messaging API client
    claude.ts              # Claude API — response generation + confidence scoring
    supabase.ts            # Supabase client (server-side)
```

### Database tables (Supabase)
- **faq**: `id uuid`, `question text`, `answer text`, `category text`, `created_at`, `updated_at`
- **menus**: `id uuid`, `name text`, `price integer`, `description text`, `created_at`, `updated_at`
- **conversations**: `id uuid`, `line_user_id text`, `user_message text`, `bot_response text`, `confidence integer`, `confidence_label text`, `escalated boolean`, `created_at`

### Confidence / escalation logic
- Claude returns `confidence` (0–10) and `confidence_label` (`high`/`medium`/`low`)
- `confidence >= 5` → reply directly to LINE user
- `confidence <= 4` → escalate to owner via LINE notification

### Response time constraint
Webhook must respond within 3 seconds. Run Claude API calls asynchronously if needed.

## Required Environment Variables (.env.local)

```
LINE_CHANNEL_ACCESS_TOKEN=
LINE_CHANNEL_SECRET=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
LINE_OWNER_USER_ID=   # For escalation notifications
```

## Coding Rules
- TypeScript strict mode — `any` is forbidden
- Prefer Server Actions over API routes for admin UI mutations
- Define types before implementation
- ESLint errors must stay at 0

## Security Rules
- LINE Webhook: always verify `x-line-signature` with `LINE_CHANNEL_SECRET`
- Claude API must be called server-side only
- Use `SUPABASE_SERVICE_ROLE_KEY` only in server contexts (never `NEXT_PUBLIC_`)

## UI Rules
- Mobile-first; all interactive elements ≥ 44px
- Loading state required on every async action
- Avoid technical jargon in the admin UI

## MVP Milestones
1. Echo response (parrot-back) working
2. FAQ response via Claude API
3. Escalation (confidence scoring + owner notification)
4. Admin panel (FAQ CRUD, menu edit, broadcast announcement)
