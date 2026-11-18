import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const AUTH_ONLY_PAGES = ["/login", "/signup"];

const PROTECTED_PAGES = [
  "/dashboard",
  "/compare",
  "/calculator",
  "/doctrine",
  "/assistant",
];

const PROTECTED_API_PATHS = [
  "/api/countries",
  "/api/country-timeseries",
  "/api/heart-chat",
];

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isProtectedApi = PROTECTED_API_PATHS.some((p) =>
    pathname.startsWith(p)
  );
  const isProtectedPage = PROTECTED_PAGES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  const isAuthOnlyPage = AUTH_ONLY_PAGES.includes(pathname);

  if (!user) {
    if (isProtectedApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (isProtectedPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  } else if (isAuthOnlyPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
