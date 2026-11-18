import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Public health check. Runs one real query against Supabase so the database
// counts as active. Called daily by .github/workflows/keepalive.yml on main,
// which stops the free-tier project from auto-pausing after 7 idle days.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ ok: false, db: "not configured" }, { status: 500 });
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase.from("keepalive").select("id").limit(1);

  if (error) {
    return NextResponse.json({ ok: false, db: "error" }, { status: 503 });
  }
  return NextResponse.json(
    { ok: true, db: "ok", at: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
