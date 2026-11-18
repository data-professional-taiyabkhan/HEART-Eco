-- HEART-Eco database schema (Supabase). Run once in the SQL editor on a new project.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "read own profile" on public.profiles for select using (auth.uid() = id);
create policy "update own profile" on public.profiles for update using (auth.uid() = id);

create function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Per-user daily chat limit. No update/delete policy on purpose.
create table public.chat_usage (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  message_chars int
);
alter table public.chat_usage enable row level security;
create policy "read own usage" on public.chat_usage for select using (auth.uid() = user_id);
create policy "insert own usage" on public.chat_usage for insert with check (auth.uid() = user_id);
create index chat_usage_user_day on public.chat_usage (user_id, created_at desc);

-- Keep-alive row read daily by /api/health.
create table public.keepalive (id int primary key, note text);
alter table public.keepalive enable row level security;
create policy "public read keepalive" on public.keepalive for select to anon, authenticated using (true);
insert into public.keepalive (id, note) values (1, 'read daily by /api/health');
