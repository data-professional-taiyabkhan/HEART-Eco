# HEART Score Economic Model Dashboard

A comprehensive Next.js dashboard for analyzing and comparing countries using the HEART economic model.

## Features

- **Dashboard**: View detailed economic metrics for any country
- **Comparison Tool**: Compare two countries side-by-side with visual charts
- **AI Assistant**: Chat with an AI assistant about the HEART model and data
- **Interactive Charts**: Visualize economic data with Recharts
- **Responsive Design**: Works on mobile, tablet, and desktop

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory (see `.env.example`):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
N8N_WEBHOOK_URL=
N8N_BASIC_AUTH_USER=
N8N_BASIC_AUTH_PASS=
CHAT_DAILY_LIMIT=20
```

4. Database: run `supabase/schema.sql` once in the Supabase SQL editor.
   Branded auth emails live in `supabase/email-templates/` (paste into
   Supabase > Authentication > Emails; edit here first to keep them in sync).

5. Ensure the data files in `data/` are present (dashboard reads them at runtime).
   The AI assistant reads the live Google Sheet via the n8n workflow.

### Running the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
HEART-Eco/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Public landing page
│   ├── login/ signup/ forgot-password/ reset-password/   # Auth pages
│   ├── dashboard/ compare/ calculator/ doctrine/ assistant/  # Signed-in pages
│   └── api/               # API routes (data, heart-chat, health)
├── middleware.ts          # Route protection
├── supabase/              # Schema + email templates
├── components/            # React components
├── lib/                   # Utilities and data parsing
└── data/                  # Excel data files
```

## HEART Score Methodology

The HEART Score is a composite measure combining:

1. **Heart Value (HV)**: 0-1 score based on:
   - Housing contribution to GDP
   - Health contribution to GDP
   - Energy contribution to GDP
   - Education contribution to GDP
   - Global GDP share
   - Interest payments (negative factor)
   - Trade balance

2. **Heart Affordability Ranking (HAR)**: Letter grade (A+ to D-) based on:
   - Adjusted Per Capita Income (APCI = PCI*(1 - Inflation))
   - Adjusted HDI (AHDI = HDI - GINI)
   - Heart Affordability Value (HAV) = APCI × AHDI
   - HAR (Heart Affordability Rank) = Is decided based on the Heart Affordability Value

Final HEART Score format: HV + HAR (e.g., "0.76C")

## Technologies Used

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Data Processing**: xlsx
- **Auth & database**: Supabase (email sign-up with confirmation, password reset, per-user chat limit)
- **AI assistant**: n8n agent workflow (via `/api/heart-chat`)
- **Hosting**: Railway, custom domain www.ecoheartai.com
- **Keep-alive**: `.github/workflows/keepalive.yml` pings `/api/health` daily so the free Supabase project never pauses

## License

All rights reserved.

