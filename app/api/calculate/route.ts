import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { computeHeartScore, type HeartScoreInputs } from "@/lib/calculations";

// Runs the HEART formulas on the server so they never reach the browser.
// Signed-in users only (also enforced in middleware.ts).
export const dynamic = "force-dynamic";

const FIELDS: (keyof HeartScoreInputs)[] = [
  "housing", "health", "energy", "education", "globalShare", "interest", "trade",
  "pci", "inflation", "hdi", "gini",
];

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const inputs = {} as HeartScoreInputs;
  for (const f of FIELDS) {
    const v = Number(body[f] ?? 0);
    if (!Number.isFinite(v) || Math.abs(v) > 1e15) {
      return NextResponse.json({ error: `Invalid value for ${f}` }, { status: 400 });
    }
    inputs[f] = v;
  }

  return NextResponse.json(computeHeartScore(inputs), {
    headers: { "Cache-Control": "no-store" },
  });
}
