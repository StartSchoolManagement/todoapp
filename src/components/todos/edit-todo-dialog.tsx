"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NOTES_MAX, TITLE_MAX, type TodoFields } from "@/lib/todos/schema";
import type { Todo } from "@/lib/types/database";

type Props = {
  todo: Todo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (fields: TodoFields) => void;
};

export function EditTodoDialog({ todo, open, onOpenChange, onSave }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const title = String(fd.get("title") ?? "").trim();
            if (!title) return;
            onSave({
              title,
              notes: String(fd.get("notes") ?? "").trim() || undefined,
              due_date: String(fd.get("due_date") ?? "") || undefined,
            });
            onOpenChange(false);
          }}
        >
          <DialogHeader>
            <DialogTitle>Edit todo</DialogTitle>
            <DialogDescription>Change the title, notes or due date.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`title-${todo.id}`}>Title</Label>
            <Input
              id={`title-${todo.id}`}
              name="title"
              defaultValue={todo.title}
              maxLength={TITLE_MAX}
              required
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`notes-${todo.id}`}>Notes</Label>
            <textarea
              id={`notes-${todo.id}`}
              name="notes"
              defaultValue={todo.notes ?? ""}
              maxLength={NOTES_MAX}
              rows={3}
              className="flex w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`due-${todo.id}`}>Due date</Label>
            <Input id={`due-${todo.id}`} name="due_date" type="date" defaultValue={todo.due_date ?? ""} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
