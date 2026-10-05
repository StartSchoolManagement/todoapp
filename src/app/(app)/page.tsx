import { redirect } from "next/navigation";
import { TodoList } from "@/components/todos/todo-list";
import { createClient } from "@/lib/supabase/server";
import { parseFilter } from "@/lib/todos/filter";
import { getTodos } from "@/lib/todos/queries";

export default async function Home({ searchParams }: PageProps<"/">) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;
  if (!userId) redirect("/login");

  const [{ filter: rawFilter }, todos] = await Promise.all([searchParams, getTodos()]);
  const filter = parseFilter(rawFilter);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Your todos</h1>
      <TodoList initialTodos={todos} userId={userId} filter={filter} />
    </div>
  );
}
