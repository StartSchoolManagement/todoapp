import { createClient } from "@/lib/supabase/server";
import type { Todo } from "@/lib/types/database";

/**
 * All todos for the signed-in user. RLS scopes the query; no explicit filter needed.
 * Ordering must match sortTodos() in sort.ts.
 */
export async function getTodos(): Promise<Todo[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("is_done", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to load todos: ${error.message}`);
  return data;
}
