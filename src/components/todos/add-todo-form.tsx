"use client";

import { useRef } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TITLE_MAX } from "@/lib/todos/schema";

type Props = {
  /** Called inside a transition by the parent; receives the raw title. */
  onAdd: (title: string) => void;
  pending?: boolean;
};

export function AddTodoForm({ onAdd, pending }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const title = inputRef.current?.value.trim() ?? "";
        if (!title) return;
        onAdd(title);
        if (inputRef.current) {
          inputRef.current.value = "";
          inputRef.current.focus();
        }
      }}
    >
      <Input
        ref={inputRef}
        name="title"
        placeholder="What needs doing?"
        aria-label="New todo title"
        maxLength={TITLE_MAX}
        autoComplete="off"
        autoFocus
        required
      />
      <Button type="submit" disabled={pending} aria-label="Add todo">
        <PlusIcon />
        Add
      </Button>
    </form>
  );
}
