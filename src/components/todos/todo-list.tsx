"use client";

import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { AddTodoForm } from "@/components/todos/add-todo-form";
import { EmptyState } from "@/components/todos/empty-state";
import { TodoItem } from "@/components/todos/todo-item";
import { createTodo, deleteTodo, toggleTodo, updateTodo, type ActionResult } from "@/lib/todos/actions";
import { sortTodos } from "@/lib/todos/sort";
import type { TodoFields } from "@/lib/todos/schema";
import type { Todo } from "@/lib/types/database";

type OptimisticAction =
  | { type: "add"; todo: Todo }
  | { type: "toggle"; id: string; isDone: boolean }
  | { type: "update"; id: string; fields: TodoFields }
  | { type: "delete"; id: string };

function reducer(state: Todo[], action: OptimisticAction): Todo[] {
  switch (action.type) {
    case "add":
      return sortTodos([action.todo, ...state]);
    case "toggle":
      return sortTodos(state.map((t) => (t.id === action.id ? { ...t, is_done: action.isDone } : t)));
    case "update":
      return state.map((t) =>
        t.id === action.id
          ? {
              ...t,
              title: action.fields.title,
              notes: action.fields.notes ?? null,
              due_date: action.fields.due_date ?? null,
            }
          : t,
      );
    case "delete":
      return state.filter((t) => t.id !== action.id);
  }
}

export function TodoList({ initialTodos, userId }: { initialTodos: Todo[]; userId: string }) {
  const [todos, apply] = useOptimistic(initialTodos, reducer);
  const [pending, startTransition] = useTransition();

  /** Runs an optimistic update + server action together; surfaces any error as a toast. */
  function run(action: OptimisticAction, serverCall: () => Promise<ActionResult>) {
    startTransition(async () => {
      apply(action);
      const result = await serverCall();
      if (result.error) toast.error(result.error);
    });
  }

  const handleAdd = (title: string) => {
    const now = new Date().toISOString();
    const optimistic: Todo = {
      id: crypto.randomUUID(),
      user_id: userId,
      title,
      notes: null,
      is_done: false,
      due_date: null,
      created_at: now,
      updated_at: now,
    };
    run({ type: "add", todo: optimistic }, () => createTodo({ title }));
  };

  const handleToggle = (id: string, isDone: boolean) =>
    run({ type: "toggle", id, isDone }, () => toggleTodo(id, isDone));

  const handleUpdate = (id: string, fields: TodoFields) =>
    run({ type: "update", id, fields }, () => updateTodo(id, fields));

  const handleDelete = (id: string) => run({ type: "delete", id }, () => deleteTodo(id));

  const remaining = todos.filter((t) => !t.is_done).length;

  return (
    <div className="flex flex-col gap-4">
      <AddTodoForm onAdd={handleAdd} pending={pending} />

      {todos.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <ul className="flex flex-col gap-2" data-pending={pending ? "" : undefined}>
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">
            {remaining === 0
              ? "All done."
              : `${remaining} ${remaining === 1 ? "item" : "items"} left`}
          </p>
        </>
      )}
    </div>
  );
}
