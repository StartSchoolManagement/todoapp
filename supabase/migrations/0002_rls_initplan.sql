-- Wrap auth.uid() in a subselect so Postgres evaluates it once per query
-- instead of once per row (Supabase linter: auth_rls_initplan).

drop policy "owner can read"   on public.todos;
drop policy "owner can insert" on public.todos;
drop policy "owner can update" on public.todos;
drop policy "owner can delete" on public.todos;

create policy "owner can read"   on public.todos for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "owner can insert" on public.todos for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "owner can update" on public.todos for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "owner can delete" on public.todos for delete to authenticated
  using ((select auth.uid()) = user_id);
