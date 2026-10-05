import type { Todo } from "@/lib/types/database";

/**
 * Open todos first (newest on top), then completed ones.
 * Pure function: safe to import from both server and client code.
 * Must match the ORDER BY in queries.ts so optimistic and server renders agree.
 */
export function sortTodos(todos: Todo[]): Todo[] {
  return [...todos].sort((a, b) => {
    if (a.is_done !== b.is_done) return a.is_done ? 1 : -1;
    return b.created_at.localeCompare(a.created_at);
  });
}
