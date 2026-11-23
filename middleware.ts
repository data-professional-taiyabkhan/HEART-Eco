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
  "/api/calculate",
];

// Private-preview gate. Active only when SITE_PASSWORD is set (e.g. on the
// temporary review deployment); unset it to make the site public.
const GATE_EXEMPT = ["/api/health"]; // keepalive cron must still reach the DB
const ASSET_RE = /\.(?:svg|png|jpg|jpeg|gif|webp|ico)$/;

function previewGate(request: NextRequest): NextResponse | null {
  const password = process.env.SITE_PASSWORD;
  if (!password) return null;
  if (GATE_EXEMPT.includes(request.nextUrl.pathname)) return null;

  const user = process.env.SITE_USER || "heart";
  const header = request.headers.get("authorization") || "";
  if (header.startsWith("Basic ")) {
    try {
      const [u, ...rest] = atob(header.slice(6)).split(":");
      if (u === user && rest.join(":") === password) return null;
    } catch {
      /* malformed header: fall through to challenge */
    }
  }
  return new NextResponse("This site is in private review.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="HEART private review", charset="UTF-8"',
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

// Landing-only preview: when LANDING_ONLY is set, only the homepage (and its
// images) is reachable; every other page redirects home and APIs are closed.
const LANDING_ALLOWED = ["/", "/api/health", "/favicon.ico"];

function landingOnly(request: NextRequest): NextResponse | null {
  if (!process.env.LANDING_ONLY) return null;
  const { pathname } = request.nextUrl;
  if (LANDING_ALLOWED.includes(pathname) || pathname.startsWith("/brand/")) return null;
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Not available in preview" }, { status: 403 });
  }
  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.search = "";
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  const denied = previewGate(request);
  if (denied) return denied;

  const landing = landingOnly(request);
  if (landing) {
    landing.headers.set("X-Robots-Tag", "noindex, nofollow");
    return landing;
  }

  const { pathname } = request.nextUrl;
  if (ASSET_RE.test(pathname)) {
    const res = NextResponse.next();
    if (process.env.SITE_PASSWORD) res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  const { response, user } = await updateSession(request);
  if (process.env.SITE_PASSWORD) response.headers.set("X-Robots-Tag", "noindex, nofollow");

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
    // Everything except Next build chunks, so the preview gate also covers images.
    "/((?!_next/static|_next/image).*)",
  ],
};
