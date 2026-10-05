import { redirect } from "next/navigation";
import { signOut } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  // proxy.ts already redirects, but the layout is the last line of defence.
  if (!claims) redirect("/login");

  const email = typeof claims.email === "string" ? claims.email : "Signed in";

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3 px-4 py-3">
          <span className="font-semibold tracking-tight">Todo</span>
          <div className="flex min-w-0 items-center gap-2">
            <span className="hidden truncate text-sm text-muted-foreground sm:inline" title={email}>
              {email}
            </span>
            <ThemeToggle />
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-6">
        {children}
      </main>
    </div>
  );
}
