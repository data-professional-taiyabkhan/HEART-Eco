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

Create a `.env.local` file in the root directory:

```
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_ASSISTANT_ID=asst_9dMB8z1B2Vzgck7AdXKe3ko9
```

4. Ensure the Excel data file is present:
   - `data/HEART_Model_khurshidOGcleaned.xlsx`

### Running the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
finalproduct/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Dashboard page
│   ├── compare/           # Comparison page
│   └── api/               # API routes
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
   - Adjusted Per Capita Income (APCI = PCI - Inflation)
   - Adjusted HDI (AHDI = HDI × GINI)
   - HAR Value = APCI × AHDI

Final HEART Score format: HV + HAR (e.g., "0.76C")

## Technologies Used

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Data Processing**: xlsx
- **AI**: OpenAI Assistants API

## License

All rights reserved.

