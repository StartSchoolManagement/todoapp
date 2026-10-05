"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Light/dark toggle. Both icons are always rendered and CSS picks the visible
 * one, so there is no hydration mismatch and no "mounted" state needed.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Toggle dark mode"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <SunIcon className="dark:hidden" />
      <MoonIcon className="hidden dark:block" />
    </Button>
  );
}
