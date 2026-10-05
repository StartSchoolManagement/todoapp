import { CheckCircle2Icon, ClipboardListIcon } from "lucide-react";
import type { TodoFilter } from "@/lib/todos/filter";

const COPY: Record<TodoFilter, { title: string; hint: string }> = {
  all: { title: "Nothing to do yet", hint: "Add your first todo above." },
  active: { title: "All caught up", hint: "Every todo is done." },
  completed: { title: "Nothing completed yet", hint: "Tick a todo to see it here." },
};

export function EmptyState({ filter = "all" }: { filter?: TodoFilter }) {
  const { title, hint } = COPY[filter];
  const Icon = filter === "active" ? CheckCircle2Icon : ClipboardListIcon;
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-12 text-center">
      <Icon className="size-8 text-muted-foreground" aria-hidden />
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}
