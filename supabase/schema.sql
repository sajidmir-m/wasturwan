-- ============================================
-- CLEAN SUPABASE SCHEMA FOR WASTURWAN TRAVELS
-- ============================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ========================
-- USERS (for future admin)
-- ========================
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  role text not null default 'customer',
  created_at timestamptz not null default timezone('utc'::text, now())
);

-- Simple helper to check admin role
create or replace function public.is_admin()
returns boolean
language plpgsql
as $$
declare
  user_role text;
begin
  select role into user_role
  from public.users
  where id = auth.uid()
  limit 1;

  return coalesce(user_role, 'customer') = 'admin';
exception
  when others then
    return false;
end;
$$;

-- ============
-- PACKAGES
-- ============
create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text,
  category text,
  price numeric(12,2) not null check (price >= 0),
  days integer not null check (days > 0),
  nights integer not null check (nights >= 0),
  duration text,
  description text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  featured boolean not null default false,
  rating numeric(3,1),
  main_image_url text,
  itinerary jsonb default '[]'::jsonb,
  inclusions jsonb default '[]'::jsonb,
  exclusions jsonb default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.package_images (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references public.packages(id) on delete cascade,
  image_url text not null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

-- ============
-- SERVICES
-- ============
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default timezone('utc'::text, now())
);

-- ============
-- CONTACTS
-- ============
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  status text not null default 'pending' check (status in ('pending', 'replied', 'archived')),
  replied_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now())
);

-- ============
-- BOOKINGS
-- ============
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  package_id uuid references public.packages(id) on delete set null,
  name text not null,
  email text not null,
  phone text not null,
  date date not null,
  persons integer not null check (persons > 0),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  message text,
  created_at timestamptz not null default timezone('utc'::text, now())
);

-- =========================
-- ENABLE ROW LEVEL SECURITY
-- =========================
alter table public.users enable row level security;
alter table public.packages enable row level security;
alter table public.package_images enable row level security;
alter table public.services enable row level security;
alter table public.contacts enable row level security;
alter table public.bookings enable row level security;

-- ============
-- CABS
-- ============
create table if not exists public.cabs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  type text not null, -- e.g. sedan, innova, crysta, tempo
  capacity integer not null check (capacity > 0),
  luggage_capacity integer,
  description text,
  base_fare numeric(12,2),
  per_km_rate numeric(12,2),
  featured boolean not null default false,
  status text not null default 'active' check (status in ('active', 'inactive')),
  main_image_url text,
  tags text[] default '{}',
  created_at timestamptz not null default timezone('utc'::text, now())
);

-- ============
-- PLACES
-- ============
create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  region text,
  short_description text,
  description text,
  hero_image_url text,
  gallery jsonb default '[]'::jsonb,
  status text not null default 'active' check (status in ('active', 'inactive')),
  featured boolean not null default false,
  created_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.cabs enable row level security;
alter table public.places enable row level security;

-- =========================
-- POLICIES: PACKAGES
-- =========================
create policy "Public can view active packages"
  on public.packages
  for select
  using (status = 'active');

create policy "Admins can manage packages"
  on public.packages
  for all
  to authenticated
  using (is_admin());

create policy "Public can view package images"
  on public.package_images
  for select
  using (true);

create policy "Admins can manage package images"
  on public.package_images
  for all
  to authenticated
  using (is_admin());

-- =========================
-- POLICIES: SERVICES
-- =========================
create policy "Public can view services"
  on public.services
  for select
  using (status = 'active');

create policy "Admins can manage services"
  on public.services
  for all
  to authenticated
  using (is_admin());

-- =========================
-- POLICIES: CONTACTS
-- =========================
-- Allow anonymous/public INSERT for contact form
create policy "Public can create contacts"
  on public.contacts
  for insert
  to anon, authenticated
  with check (true);

-- Admins can view/update/delete all contacts
create policy "Admins can view contacts"
  on public.contacts
  for select
  to authenticated
  using (is_admin());

create policy "Admins can update contacts"
  on public.contacts
  for update
  to authenticated
  using (is_admin())
  with check (is_admin());

create policy "Admins can delete contacts"
  on public.contacts
  for delete
  to authenticated
  using (is_admin());

-- =========================
-- POLICIES: BOOKINGS
-- =========================
-- Allow anonymous/public INSERT for bookings
create policy "Public can create bookings"
  on public.bookings
  for insert
  to anon, authenticated
  with check (true);

-- Authenticated users can view their own bookings when user_id is set
create policy "Users can view own bookings"
  on public.bookings
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Admins can view/update/delete all bookings
create policy "Admins can view all bookings"
  on public.bookings
  for select
  to authenticated
  using (is_admin());

create policy "Admins can update bookings"
  on public.bookings
  for update
  to authenticated
  using (is_admin())
  with check (is_admin());

create policy "Admins can delete bookings"
  on public.bookings
  for delete
  to authenticated
  using (is_admin());

-- =========================
-- POLICIES: CABS
-- =========================
create policy "Public can view active cabs"
  on public.cabs
  for select
  using (status = 'active');

create policy "Admins can manage cabs"
  on public.cabs
  for all
  to authenticated
  using (is_admin());

-- =========================
-- POLICIES: PLACES
-- =========================
create policy "Public can view active places"
  on public.places
  for select
  using (status = 'active');

create policy "Admins can manage places"
  on public.places
  for all
  to authenticated
  using (is_admin());


