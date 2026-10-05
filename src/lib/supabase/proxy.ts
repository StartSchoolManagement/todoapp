import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/types/database";

/** Routes reachable without a session. Everything else requires one. */
const PUBLIC_PREFIXES = ["/login", "/signup", "/auth"];

function isPublicPath(pathname: string) {
  return PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * Refreshes the Supabase session cookie on every request and applies the
 * auth redirects. Called from src/proxy.ts.
 *
 * Do not add logic between createServerClient() and getClaims(); a mistake
 * there is the classic cause of users being randomly signed out.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const isAuthenticated = Boolean(data?.claims);
  const { pathname } = request.nextUrl;

  /**
   * getClaims() may have refreshed the token, and those Set-Cookie headers live on
   * supabaseResponse. A redirect is a new response, so copy them across or the
   * browser keeps the stale token and the user gets signed out on the next hop.
   */
  function redirectTo(path: string) {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = "";
    const res = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((c) => res.cookies.set(c));
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  }

  if (!isAuthenticated && !isPublicPath(pathname)) return redirectTo("/login");
  if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) return redirectTo("/");

  // Refreshed tokens ride on Set-Cookie; never let a CDN cache them.
  supabaseResponse.headers.set("Cache-Control", "private, no-store");
  return supabaseResponse;
}
