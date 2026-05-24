# HireSim

Production-quality MVP for AI interview practice with Next.js App Router, TypeScript, Tailwind CSS, Prisma/PostgreSQL, browser voice transcription, and SumoPod AI through the OpenAI SDK.

## Setup

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` and `SUMOPOD_API_KEY`.
3. Run `npm run prisma:migrate`.
4. Run `npm run dev`.

The default AI model is `gpt-4o-mini` through `https://ai.sumopod.com/v1`.
