import { ClipboardListIcon } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-12 text-center">
      <ClipboardListIcon className="size-8 text-muted-foreground" aria-hidden />
      <p className="font-medium">Nothing to do yet</p>
      <p className="text-sm text-muted-foreground">Add your first todo above.</p>
    </div>
  );
}
