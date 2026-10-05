"use client";

import { useState } from "react";
import { CalendarIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditTodoDialog } from "@/components/todos/edit-todo-dialog";
import type { TodoFields } from "@/lib/todos/schema";
import type { Todo } from "@/lib/types/database";
import { cn } from "@/lib/utils";

type Props = {
  todo: Todo;
  onToggle: (id: string, isDone: boolean) => void;
  onUpdate: (id: string, fields: TodoFields) => void;
  onDelete: (id: string) => void;
};

function formatDue(dateStr: string) {
  // due_date is a plain YYYY-MM-DD; parse as local to avoid off-by-one from UTC.
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function isOverdue(dateStr: string) {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return dateStr < todayStr;
}

export function TodoItem({ todo, onToggle, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const overdue = todo.due_date && !todo.is_done && isOverdue(todo.due_date);

  return (
    <li className="group flex items-start gap-3 rounded-lg border bg-card px-3 py-2.5">
      <Checkbox
        className="mt-0.5"
        checked={todo.is_done}
        onCheckedChange={(checked) => onToggle(todo.id, checked)}
        aria-label={todo.is_done ? `Mark "${todo.title}" as not done` : `Mark "${todo.title}" as done`}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span
          className={cn(
            "text-sm leading-5 break-words",
            todo.is_done && "text-muted-foreground line-through",
          )}
        >
          {todo.title}
        </span>
        {todo.notes && (
          <p className="text-xs leading-4 text-muted-foreground break-words whitespace-pre-wrap">
            {todo.notes}
          </p>
        )}
        {todo.due_date && (
          <span
            className={cn(
              "mt-0.5 inline-flex w-fit items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground",
              overdue && "bg-destructive/10 text-destructive",
            )}
          >
            <CalendarIcon className="size-3" aria-hidden />
            {formatDue(todo.due_date)}
            {overdue && <span className="sr-only">(overdue)</span>}
          </span>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for "${todo.title}"`} />}
        >
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditing(true)}>
            <PencilIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={() => onDelete(todo.id)}>
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditTodoDialog
        todo={todo}
        open={editing}
        onOpenChange={setEditing}
        onSave={(fields) => onUpdate(todo.id, fields)}
      />
    </li>
  );
}
