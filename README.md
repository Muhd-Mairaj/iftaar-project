# Ramadan Iftar Food Coordination

A Next.js 14 application to coordinate Ramadan Iftar food packet donations between a mosque (Muazzin) and a restaurant.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Database/Auth:** Supabase
- **Styling:** Tailwind CSS (with RTL support)
- **State/Fetching:** TanStack Query v5
- **Form/Validation:** React Hook Form + Zod
- **i18n:** Tolgee (English & Arabic)

## Getting Started

1. **Install Dependencies:**
   ```bash
   bun install
   ```

2. **Supabase Setup:**
   - Create a new Supabase project.
   - Run the migration in `supabase/migrations/00001_init.sql` in your Supabase SQL Editor.
   - Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials.

3. **Database Types:**
   Generate types using the Supabase CLI:
   ```bash
   npx supabase gen types typescript --project-id your-project-id > src/types/database.types.ts
   ```

4. **Run Development Server:**
   ```bash
   bun dev
   ```

## Project Structure
- `app/[locale]/`: Main application routes (i18n aware)
- `components/`: Shared UI components
- `lib/actions/`: Next.js Server Actions for mutations
- `lib/supabase/`: Client and Server Supabase utilities
- `lib/validations.ts`: Zod schemas and inferred types
- `messages/`: i18n JSON files
- `providers/`: Context providers (QueryClient, Tolgee)
