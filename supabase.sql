-- Pega TODO este texto en Supabase → SQL Editor → New query → Run (una sola vez).
create table if not exists public.items (
  id text not null,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  kind text not null check (kind in ('recipe','plan','shop')),
  data jsonb not null default '{}'::jsonb,
  deleted boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);
create index if not exists items_user_updated on public.items (user_id, updated_at);
alter table public.items enable row level security;
drop policy if exists "solo_mis_datos" on public.items;
create policy "solo_mis_datos" on public.items for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create or replace function public.touch_items() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists items_touch on public.items;
create trigger items_touch before insert or update on public.items for each row execute function public.touch_items();
alter publication supabase_realtime add table public.items;
