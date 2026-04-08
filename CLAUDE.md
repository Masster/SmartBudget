# SmartBudget — Project Rules

## Language & Locale
- Code, comments, variable names — English
- UI text — Russian (interface for Russian-speaking user)
- Commit messages — English

## Architecture
- Next.js 14+ App Router (NO Pages Router)
- TypeScript strict mode — no `any`
- Tailwind CSS + shadcn/ui for UI
- Prisma ORM + PostgreSQL
- REST API via Next.js API Routes (not tRPC)
- Zod for validation on all boundaries

## State Management
- TanStack React Query — all server state (accounts, transactions, budgets)
- Zustand — only UI state (sidebar, modals, filters)
- Never duplicate server data in Zustand

## Auth Pattern
- All data tied to userId
- getCurrentUserId() — single entry point for userId
- MULTI_USER=false → automatic bypass, returns first user
- All API routes go through auth middleware

## API Conventions
- All endpoints under /api/
- Return { data } or { error, status }
- HTTP codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Server Error
- Pagination: ?page=1&limit=20
- Filters via query params

## File Structure
- Components: src/components/ (shared), next to page (page-specific)
- Hooks: src/hooks/
- Utilities: src/lib/
- Types: src/types/
- API: src/app/api/

## Database
- Prisma schema: prisma/schema.prisma
- Seed: prisma/seed.ts
- All models have userId (multi-user ready)
- Decimal for monetary amounts (never float)
- DateTime for all dates

## Styling
- Tailwind CSS utility-first
- shadcn/ui as component base
- CSS variables for theming (dark/light)
- Mobile-first responsive design

## Testing
- Vitest for unit tests
- Playwright for E2E
- Test business logic (Safe to Spend, budget calculator)

## Key Commands
- `npm run dev` — start dev server
- `npx prisma migrate dev` — run migrations
- `npx prisma db seed` — seed database
- `npx prisma studio` — database GUI
- `npm run test` — run unit tests
- `npm run test:e2e` — run E2E tests
