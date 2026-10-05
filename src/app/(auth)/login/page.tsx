import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign in · Todo" };

const ERROR_MESSAGES: Record<string, string> = {
  confirmation_failed: "That confirmation link is invalid or has expired. Try signing in.",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { error } = await searchParams;
  const code = typeof error === "string" ? error : undefined;
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-green-100 p-4 dark:bg-green-950">
      <LoginForm initialError={code ? ERROR_MESSAGES[code] : undefined} />
    </main>
  );
}
