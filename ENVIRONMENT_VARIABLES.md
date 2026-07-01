# Environment Variables

All variables must be set in both `.env.local` (local dev) and Vercel project settings (production).

---

## Authentication

| Variable | Required | Description | Where to get it |
|---|---|---|---|
| `NEXTAUTH_SECRET` | ✅ | Random secret for JWT signing | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ✅ | Full URL of your app | `http://localhost:3000` (dev) / `https://yourdomain.com` (prod) |

---

## Database

| Variable | Required | Description | Where to get it |
|---|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB connection string | MongoDB Atlas → Connect → Drivers |

---

## Stripe

| Variable | Required | Description | Where to get it |
|---|---|---|---|
| `STRIPE_SECRET_KEY` | ✅ | Stripe secret API key | Stripe Dashboard → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | ✅ | Webhook signing secret | Stripe Dashboard → Webhooks → endpoint secret |
| `STRIPE_PRICE_SOLO` | ✅ | Price ID for Solo plan ($49/mo) | Create a $49/mo recurring price in Stripe → copy `price_...` ID |
| `STRIPE_PRICE_PRO` | ✅ | Price ID for Pro plan ($149/mo) | Create a $149/mo recurring price in Stripe → copy `price_...` ID |
| `STRIPE_PRICE_ENTERPRISE` | ✅ | Price ID for Enterprise plan ($497/mo) | Create a $497/mo recurring price in Stripe → copy `price_...` ID |

---

## AI (Anthropic)

| Variable | Required | Description | Where to get it |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ | Anthropic API key for Claude | console.anthropic.com → API Keys |

Used by:
- `/api/ai/profit-coach` — AI Profit Coach (cached 4h, Pro/Enterprise only)
- `/api/ai/chat` — Ask TradiePilot chat (20 msg/day limit, Pro/Enterprise only)
- `/api/ai/weekly-report` + `/api/cron/weekly-report` — Monday AI profit report email

---

## Email (Resend)

| Variable | Required | Description | Where to get it |
|---|---|---|---|
| `RESEND_API_KEY` | ✅ | Resend API key for transactional email | resend.com → API Keys |

Sending domains used: `notifications@tradiepilot.app`, `reports@tradiepilot.app`

---

## Cron Jobs

| Variable | Required | Description | Where to get it |
|---|---|---|---|
| `CRON_SECRET` | ✅ | Auth token for Vercel Cron endpoint | `openssl rand -base64 32` — add to Vercel env vars |

The cron job at `/api/cron/weekly-report` runs every Monday at 7am UTC (5pm AEST). It checks `Authorization: Bearer <CRON_SECRET>` on incoming requests. Vercel automatically passes this when `CRON_SECRET` is set in the project environment.

---

## Xero Integration (optional)

| Variable | Required | Description | Where to get it |
|---|---|---|---|
| `XERO_CLIENT_ID` | Optional | Xero OAuth2 app client ID | developer.xero.com → My Apps |
| `XERO_CLIENT_SECRET` | Optional | Xero OAuth2 app client secret | developer.xero.com → My Apps |
| `XERO_REDIRECT_URI` | Optional | OAuth callback URL | `https://yourdomain.com/api/xero/callback` |

---

## Quick setup checklist

1. `cp .env.example .env.local` (or create `.env.local` from scratch)
2. Set `NEXTAUTH_SECRET` — `openssl rand -base64 32`
3. Set `MONGODB_URI` — get from MongoDB Atlas
4. Set `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
5. Create three Stripe prices ($49, $149, $497/mo) and set `STRIPE_PRICE_SOLO`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_ENTERPRISE`
6. Set `ANTHROPIC_API_KEY` — get from console.anthropic.com
7. Set `RESEND_API_KEY` — get from resend.com
8. Set `CRON_SECRET` — `openssl rand -base64 32`
9. Add all variables to Vercel → Settings → Environment Variables
