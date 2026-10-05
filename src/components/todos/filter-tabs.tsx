import Link from "next/link";
import { FILTERS, filterHref, type TodoFilter } from "@/lib/todos/filter";
import { cn } from "@/lib/utils";

const LABELS: Record<TodoFilter, string> = {
  all: "All",
  active: "Active",
  completed: "Completed",
};

export function FilterTabs({ current }: { current: TodoFilter }) {
  return (
    <nav aria-label="Filter todos" className="inline-flex rounded-lg bg-muted p-0.5 text-sm">
      {FILTERS.map((f) => {
        const active = f === current;
        return (
          <Link
            key={f}
            href={filterHref(f)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-1 transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {LABELS[f]}
          </Link>
        );
      })}
    </nav>
  );
}
