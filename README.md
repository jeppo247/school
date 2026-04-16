# Upwise

AI-powered adaptive learning platform for Australian primary students (Prep–Year 6).

Built on the same principles as Alpha School's AI program, adapted for home use with parents as the guide layer. ACARA-aligned curriculum with adaptive diagnostics, mastery-based progression, and an 80% win-rate targeting engine.

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Express, TypeScript, Drizzle ORM
- **Database**: PostgreSQL
- **AI**: Anthropic Claude API
- **Auth**: Clerk
- **Payments**: Stripe
- **Hosting**: Railway

## Project Structure

```
upwise/
├── apps/
│   ├── web/        # Next.js frontend (student, parent, admin portals)
│   └── server/     # Express API (adaptive engine, content generation)
├── packages/
│   └── shared/     # Shared types, constants, validators
└── turbo.json      # Turborepo config
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Clerk account
- Stripe account
- Anthropic API key

### Setup

1. Clone the repo
2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
3. Fill in your `.env` values
4. Install dependencies:
   ```bash
   npm install
   ```
5. Push database schema:
   ```bash
   cd apps/server && npm run db:push
   ```
6. Seed the database:
   ```bash
   npm run db:seed
   ```
7. Start development:
   ```bash
   npm run dev
   ```

The frontend runs on `http://localhost:3000` and the API on `http://localhost:4000`.

## Environment Variables

See `.env.example` for all required variables with descriptions.
