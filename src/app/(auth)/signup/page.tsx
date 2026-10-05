import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = { title: "Create account · Todo" };

export default function SignupPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-4">
      <SignupForm />
    </main>
  );
}
