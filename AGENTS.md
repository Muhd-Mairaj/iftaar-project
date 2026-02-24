# Application Architecture & Development Guidelines

## Package Management & Tooling
*   **Runtime:** This project strictly uses **Bun** as its JavaScript runtime, package manager, and test runner.
*   **Commands:** 
    *   Use `bun install` or `bun add` instead of `npm install` or `yarn`.
    *   Use `bunx <package>` instead of `npx <package>`.
*   **Formatting and Linting:** We enforce consistent formatting practices across the entire codebase. Only use `bun check --unsafe` to validate and align the project standards.

## UI / UX Styling & Theming
Consistent styling and design aesthetics are our highest priority. The implementation must strictly adhere to the predefined premium aesthetic.
*   **Core UI Library:** We use [`shadcn/ui`](https://ui.shadcn.com/) heavily customized utilizing direct, plain Tailwind CSS variables.
*   **Layout and Density:** We favor compact layouts with tight alignments. Typical flex gaps generally measure around `gap-2` to `gap-4`. 
*   **Border Radius:** We utilize smooth, premium border radiuses exclusively (`rounded-xl`, `rounded-2xl`, `rounded-full`). Never use default hard corners (`rounded-none`).
*   **Color Palette:** Do not introduce arbitrary or generic color codes. Exclusively use strictly thematic CSS variables (e.g., `bg-primary/10 text-primary`, `bg-destructive/10 text-destructive`, `bg-amber-500/10`) to maintain a unified color schema.
*   **Icons:** Every icon used in the project must come exclusively from `lucide-react`. 

## Data Fetching, Mutations, & State Caching
*   **Preferred Architecture:** Treat almost all interactive pages generally as Next.js Client Components (`'use client'`).
*   **API Routes (React Query):** For all standard dashboard data fetching (`GET`), table paginations, and standard database table updates (like approving a row), we strictly use dedicated API Promise fetchers located in `src/lib/api/` paired with **TanStack Query (React Query)** on the client.
    *   *Why?* React Query excels at API caching, background state synchronization, and snappy client-side cache invalidation (`queryClient.invalidateQueries()`).
    *   *Rule:* If you are fetching a list of items to display on a screen or updating a basic row status, put the Supabase logic in `src/lib/api/` and wrap it in `useQuery`/`useMutation`.
*   **Server Actions (Forms & Auth):** We explicitly reserve Next.js Server Actions (`src/lib/actions/`) solely for operations that *require* secure, server-only execution environments that cannot be safely exposed to the client.
    *   *Use Cases for Actions:* Complex form submissions (containing heavy file binary uploads like receipts), Authentication operations (like `supabase.auth.admin` or manipulating cookies), or manipulating user role `app_metadata`.
    *   *Rule:* Do NOT use Server Actions for simple database fetching or updating. Server actions lock the UI thread during execution and cause full expensive page re-renders via `revalidatePath`.
*   **Large Data Lists:** Any list component potentially fetching many rows *must* implement infinite scroll loading, utilizing `useInfiniteQuery` combined with an Intersection Observer sentinel. Flat pagination is discouraged unless required. Always add `.order('id')` to paginated Supabase queries as a deterministic secondary tie-breaker constraint.

## Database & Schemas
Our primary database and Auth provider is Supabase.
*   **Migrations are Mandatory:** Never modify the database schema via the Supabase Dashboard UI direct RAW SQL runners. 
*   **Local Migrations:** Every schema update, function addition, index alteration, or table modification must be tracked via local `.sql` migration files stored strictly in `supabase/migrations/`.

## Typing and Data Structures
We strictly use comprehensive TypeScript and natively derive our main structure typing entirely from Supabase reflection.
*   **Central Types:** Always maintain central, singular type definitions. Avoid manually declaring matching duplicate interface structures for data payloads on your own.
*   **Generating Types:** If the database updates, immediately synchronize and update the front-end type definitions with:
    ```bash
    bunx supabase gen types typescript --project-id <project-id> > ./src/types/database.types.ts
    ```

## Authorization / Role-Based Access Control
*   **Speed Over Layers:** Role and Access protection operations are designed for maximum speed. We rely exclusively on the **Middleware**-based routing blocks.
*   **Edge Only Protection:** Do *not* implement layout-level components (`layout.tsx`) or deep higher-order wrappers solely as authorization mechanisms. Securing the route at the Edge via middleware ensures performant, latency-free blockages of invalid requests.

## Internationalization (i18n)
*   **Tolgee:** The `@tolgee/react` provider handles translating strings dynamically.
*   **No Exceptions:** All user-facing text strings globally must use internationalization hooks (`const { t } = useTranslate()`). Absolutely no hardcoded raw English/Arabic/etc. UI strings are allowed locally inside tags or attributes.
