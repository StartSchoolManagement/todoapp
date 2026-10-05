"use client";

import { useEffect } from "react";
import { AlertTriangleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
      <AlertTriangleIcon className="size-8 text-destructive" aria-hidden />
      <p className="font-medium">Couldn&apos;t load your todos</p>
      <p className="text-sm text-muted-foreground">
        Something went wrong on our side. Your data is safe.
        {error.digest && <span className="block font-mono text-xs">Ref: {error.digest}</span>}
      </p>
      <Button onClick={reset} variant="outline">
        Try again
      </Button>
    </div>
  );
}
