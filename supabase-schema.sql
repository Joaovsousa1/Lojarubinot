-- ============================================================
-- RubinOT Estoque — Supabase Schema
-- Execute este arquivo no SQL Editor do Supabase
-- ============================================================

-- 1. PROFILES (estende auth.users)
create table if not exists public.profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  email            text,
  name             text,
  is_admin         boolean default false,
  plan_active      boolean default false,
  plan_expires_at  timestamptz,
  notes            text,
  created_at       timestamptz default now()
);

-- Trigger: cria profile automaticamente ao criar usuário
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, name, plan_active)
  values (new.id, new.email, new.raw_user_meta_data->>'name', true)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. COINS
create table if not exists public.coins (
  id             text primary key,
  user_id        uuid references public.profiles(id) on delete cascade not null,
  type           text not null,
  date           text,
  quantity       integer default 0,
  package_type   text,
  price_per_k    numeric,
  total_paid     numeric,
  total_received numeric,
  profit         numeric,
  server         text,
  observation    text
);

-- 3. ITEMS
create table if not exists public.items (
  id               text primary key,
  user_id          uuid references public.profiles(id) on delete cascade not null,
  name             text,
  set              text,
  image_url        text,
  classification   integer,
  tier             integer default 0,
  max_tier         integer default 4,
  server           text,
  category         text,
  quantity         integer default 0,
  buy_price_rc     numeric default 0,
  buy_price_pix    numeric default 0,
  sell_price_rc    numeric default 0,
  sell_price_pix   numeric default 0,
  observation      text,
  date_entry       text,
  sales            jsonb default '[]',
  price_history    jsonb default '[]'
);

-- 4. ACCOUNTS
create table if not exists public.accounts (
  id                  text primary key,
  user_id             uuid references public.profiles(id) on delete cascade not null,
  server              text,
  vocation            text,
  level               integer default 0,
  char_name           text,
  email               text,
  buy_price           numeric default 0,
  sell_price          numeric default 0,
  status              text default 'disponível',
  date_entry          text,
  date_sold           text,
  skills              jsonb default '{}',
  charm_points        integer default 0,
  bosstiary_points    integer default 0,
  hunting_task_points integer default 0,
  vip_days            integer default 0,
  loyalty_skill       integer default 0,
  outfits             text[] default '{}',
  addons              text[] default '{}',
  mounts              text[] default '{}',
  auras               text[] default '{}',
  notable_items       text[] default '{}',
  battle_pass         jsonb default '[]',
  notes               text,
  screenshot          text
);

-- 5. SETTINGS
create table if not exists public.settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  data    jsonb default '{}'
);

-- 6. PAYMENT LOG (admin)
create table if not exists public.payment_log (
  id       uuid primary key default gen_random_uuid(),
  user_id  uuid references public.profiles(id) on delete cascade not null,
  amount   numeric,
  note     text,
  paid_at  timestamptz default now()
);

-- 7. NOTES (anotações: fiado / lembretes / geral)
create table if not exists public.notes (
  id          text primary key,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  type        text default 'geral',        -- 'fiado' | 'lembrete' | 'geral'
  text        text not null,               -- descrição livre
  person      text,                        -- fiado: quem pegou
  amount      numeric,                     -- fiado: quanto (RC)
  amount_pix  numeric,                     -- fiado: quanto (R$)
  due_at      timestamptz,                 -- lembrete: prazo (ex: fim do leilão)
  account_id  text references public.accounts(id) on delete set null,
  email       text,                        -- email de contato (livre, sem precisar vincular conta)
  resolved    boolean default false,
  created_at  timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles    enable row level security;
alter table public.coins       enable row level security;
alter table public.items       enable row level security;
alter table public.accounts    enable row level security;
alter table public.settings    enable row level security;
alter table public.payment_log enable row level security;
alter table public.notes       enable row level security;

-- Helper: is current user admin?
create or replace function public.is_admin()
returns boolean language sql security definer as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

-- PROFILES policies
create policy "Users can read own profile"   on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "Users can update own profile" on public.profiles for update using (id = auth.uid());
create policy "Admins can update any profile" on public.profiles for update using (public.is_admin());

-- COINS policies
create policy "Own coins" on public.coins for all using (user_id = auth.uid() or public.is_admin());

-- ITEMS policies
create policy "Own items" on public.items for all using (user_id = auth.uid() or public.is_admin());

-- ACCOUNTS policies
create policy "Own accounts" on public.accounts for all using (user_id = auth.uid() or public.is_admin());

-- SETTINGS policies
create policy "Own settings" on public.settings for all using (user_id = auth.uid() or public.is_admin());

-- PAYMENT LOG policies
create policy "Admins manage payments" on public.payment_log for all using (public.is_admin());

-- NOTES policies
create policy "Own notes" on public.notes for all using (user_id = auth.uid() or public.is_admin());

-- ============================================================
-- MIGRAÇÃO: adicionar colunas novas a tabelas existentes
-- Execute se o banco já existia antes dessas colunas:
-- alter table public.items add column if not exists vocation text default 'ALL';
alter table public.accounts add column if not exists auras text[] default '{}';
alter table public.accounts add column if not exists battle_pass jsonb default '[]';
alter table public.notes add column if not exists amount_pix numeric;
alter table public.notes add column if not exists email text;
-- ============================================================

-- ============================================================
-- MARCAR SEU USUÁRIO COMO ADMIN
-- Rode após criar sua conta no app:
-- UPDATE public.profiles SET is_admin = true WHERE email = 'SEU_EMAIL_AQUI';
-- ============================================================
