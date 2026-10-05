import type { Todo } from "@/lib/types/database";

export const FILTERS = ["all", "active", "completed"] as const;
export type TodoFilter = (typeof FILTERS)[number];

/** Normalises the `?filter=` search param; anything unrecognised becomes "all". */
export function parseFilter(value: string | string[] | undefined): TodoFilter {
  return typeof value === "string" && (FILTERS as readonly string[]).includes(value)
    ? (value as TodoFilter)
    : "all";
}

export function applyFilter(todos: Todo[], filter: TodoFilter): Todo[] {
  switch (filter) {
    case "active":
      return todos.filter((t) => !t.is_done);
    case "completed":
      return todos.filter((t) => t.is_done);
    default:
      return todos;
  }
}

export function filterHref(filter: TodoFilter) {
  return filter === "all" ? "/" : `/?filter=${filter}`;
}
