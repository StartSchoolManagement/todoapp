"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { todoFieldsSchema, todoIdSchema, type TodoFields } from "@/lib/todos/schema";

export type ActionResult = { error?: string };

const GENERIC_ERROR = "Something went wrong. Please try again.";

async function requireUserId() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;
  if (!userId) throw new Error("Not signed in.");
  return { supabase, userId };
}

export async function createTodo(input: TodoFields): Promise<ActionResult> {
  const parsed = todoFieldsSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const { supabase, userId } = await requireUserId();
  const { error } = await supabase.from("todos").insert({
    user_id: userId,
    title: parsed.data.title,
    notes: parsed.data.notes ?? null,
    due_date: parsed.data.due_date ?? null,
  });

  if (error) return { error: GENERIC_ERROR };
  revalidatePath("/");
  return {};
}

export async function toggleTodo(id: string, isDone: boolean): Promise<ActionResult> {
  const parsedId = todoIdSchema.safeParse(id);
  if (!parsedId.success) return { error: parsedId.error.issues[0]?.message };

  const { supabase } = await requireUserId();
  const { error } = await supabase.from("todos").update({ is_done: isDone }).eq("id", parsedId.data);

  if (error) return { error: GENERIC_ERROR };
  revalidatePath("/");
  return {};
}

export async function updateTodo(id: string, input: TodoFields): Promise<ActionResult> {
  const parsedId = todoIdSchema.safeParse(id);
  if (!parsedId.success) return { error: parsedId.error.issues[0]?.message };
  const parsed = todoFieldsSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const { supabase } = await requireUserId();
  const { error } = await supabase
    .from("todos")
    .update({
      title: parsed.data.title,
      notes: parsed.data.notes ?? null,
      due_date: parsed.data.due_date ?? null,
    })
    .eq("id", parsedId.data);

  if (error) return { error: GENERIC_ERROR };
  revalidatePath("/");
  return {};
}

export async function clearCompleted(): Promise<ActionResult> {
  const { supabase } = await requireUserId();
  // RLS limits this to the caller's rows.
  const { error } = await supabase.from("todos").delete().eq("is_done", true);

  if (error) return { error: GENERIC_ERROR };
  revalidatePath("/");
  return {};
}

export async function deleteTodo(id: string): Promise<ActionResult> {
  const parsedId = todoIdSchema.safeParse(id);
  if (!parsedId.success) return { error: parsedId.error.issues[0]?.message };

  const { supabase } = await requireUserId();
  const { error } = await supabase.from("todos").delete().eq("id", parsedId.data);

  if (error) return { error: GENERIC_ERROR };
  revalidatePath("/");
  return {};
}
