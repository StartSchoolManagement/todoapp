-- todos: one flat list per user, owner-scoped via RLS

create table public.todos (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 200),
  notes       text,
  is_done     boolean not null default false,
  due_date    date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index todos_user_id_created_at_idx on public.todos (user_id, created_at desc);

alter table public.todos enable row level security;

create policy "owner can read"   on public.todos for select to authenticated using (auth.uid() = user_id);
create policy "owner can insert" on public.todos for insert to authenticated with check (auth.uid() = user_id);
create policy "owner can update" on public.todos for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner can delete" on public.todos for delete to authenticated using (auth.uid() = user_id);

-- keep updated_at current
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger todos_set_updated_at
  before update on public.todos
  for each row execute function public.set_updated_at();
