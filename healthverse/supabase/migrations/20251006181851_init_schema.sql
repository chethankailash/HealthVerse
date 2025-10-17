-- USERS TABLE
create table if not exists public.users (
  id uuid primary key default auth.uid(),
  email text unique not null,
  xp int default 0,
  level int default 1,
  created_at timestamptz default now()
);

-- HABITS TABLE
create table if not exists public.habits (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  type text not null,
  value int not null,
  date date not null,
  created_at timestamptz default now()
);

-- FACT CARDS TABLE
create table if not exists public.fact_cards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  category text not null,
  created_at timestamptz default now()
);

-- INDEXES
create index if not exists idx_habits_user_date on public.habits(user_id, date desc);
create index if not exists idx_fact_cards_category on public.fact_cards(category);

-- RLS
alter table public.users enable row level security;
alter table public.habits enable row level security;
alter table public.fact_cards enable row level security;

-- POLICIES
create policy "Users can view and edit own profile"
on public.users for all
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can manage own habits"
on public.habits for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Everyone can read fact_cards"
on public.fact_cards for select
using (true);

-- Trigger: auto-create user record when new auth user signs up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure handle_new_user();
