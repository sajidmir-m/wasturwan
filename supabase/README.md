# Supabase Setup (Clean)

This project is wired for Supabase but **does not depend on it at runtime yet**.  
Use this guide when you are ready to connect a real Supabase project.

## 1. Create a Supabase project

1. Go to the Supabase dashboard
2. Click **New Project**
3. Copy:
   - **Project URL**
   - **anon/public API key**

## 2. Environment variables

Create `.env.local` in the project root (same folder as `package.json`):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> Do **not** commit `.env.local` to git.

Then restart your dev server:

```bash
npm run dev
```

## 3. Apply database schema

In Supabase Dashboard:

1. Go to **SQL Editor**
2. Create a new query
3. Copy the **entire contents** of `supabase/schema.sql`
4. Paste and click **Run**

This will create:

- `users` (for future admin)
- `packages` and `package_images`
- `services`
- `contacts`
- `bookings`
- RLS policies so:
  - Public can **insert** into `contacts` and `bookings`
  - Public can **view** active `packages` and `services`
  - Admins (role = `admin` in `public.users`) can manage everything

## 4. Seed demo data

Still in **SQL Editor**:

1. Open a new query
2. Copy all of `supabase/seed-data.sql`
3. Run it

You will get:

- 2 demo packages
- Some demo services
- One example contact

## 5. Supabase clients

Two helper clients are defined:

- `src/lib/supabase/server.ts`
  - `createClient()` – server-side with cookies (for future admin)
  - `createAnonymousClient()` – always anon, no cookies (good for public forms)

- `src/lib/supabase/client.ts`
  - `createClient()` – browser client (if you ever need direct Supabase access in a client component)

> Right now, your public pages (`/book`, `/contact`, `/packages`) are **not** wired back to Supabase on purpose.  
> They still work without any backend. When you’re ready, we can add clean server actions that use these clients.


