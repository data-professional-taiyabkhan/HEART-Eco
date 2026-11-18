import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_MESSAGE_CHARS = 2000;
const DAILY_LIMIT = Number(process.env.CHAT_DAILY_LIMIT) || 20;

export async function POST(req: NextRequest) {
    try {
        const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
        if (!N8N_WEBHOOK_URL) {
            console.error("N8N_WEBHOOK_URL is not configured");
            return NextResponse.json(
                { error: "N8N_WEBHOOK_URL is not configured" },
                { status: 500 }
            );
        }

        const N8N_BASIC_AUTH_USER = process.env.N8N_BASIC_AUTH_USER;
        if (!N8N_BASIC_AUTH_USER) {
            console.error("N8N_BASIC_AUTH_USER is not configured");
            return NextResponse.json(
                { error: "N8N_BASIC_AUTH_USER is not configured" },
                { status: 500 }
            );
        }

        const N8N_BASIC_AUTH_PASS = process.env.N8N_BASIC_AUTH_PASS;
        if (!N8N_BASIC_AUTH_PASS) {
            console.error("N8N_BASIC_AUTH_PASS is not configured");
            return NextResponse.json(
                { error: "N8N_BASIC_AUTH_PASS is not configured" },
                { status: 500 }
            );
        }

        const body = await req.json();
        const { message } = body as { message: string };

        if (!message) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        if (message.length > MAX_MESSAGE_CHARS) {
            return NextResponse.json(
                { error: `Your message is too long. Please keep it under ${MAX_MESSAGE_CHARS} characters.` },
                { status: 400 }
            );
        }

        const supabase = createClient();
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const todayUtcMidnight = new Date();
        todayUtcMidnight.setUTCHours(0, 0, 0, 0);

        const { count, error: countError } = await supabase
            .from("chat_usage")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .gte("created_at", todayUtcMidnight.toISOString());

        if (countError) {
            console.error("chat_usage count error:", countError);
            return NextResponse.json(
                { error: "Failed to check your usage. Please try again." },
                { status: 500 }
            );
        }

        if ((count ?? 0) >= DAILY_LIMIT) {
            return NextResponse.json(
                {
                    error: `You've reached your daily limit of ${DAILY_LIMIT} messages. Your limit resets at midnight UTC.`,
                },
                { status: 429 }
            );
        }

        const { error: insertError } = await supabase
            .from("chat_usage")
            .insert({ user_id: user.id, message_chars: message.length });

        if (insertError) {
            console.error("chat_usage insert error:", insertError);
            return NextResponse.json(
                { error: "Failed to log usage. Please try again." },
                { status: 500 }
            );
        }

        const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + Buffer.from(`${N8N_BASIC_AUTH_USER}:${N8N_BASIC_AUTH_PASS}`).toString("base64"),
            },
            body: JSON.stringify({ chatInput: message, sessionId: user.id }),
        });

        if (!n8nResponse.ok) {
            const errText = await n8nResponse.text();
            console.error("n8n error:", n8nResponse.status, errText);
            return NextResponse.json(
                { error: `n8n returned ${n8nResponse.status}: ${errText}` },
                { status: n8nResponse.status }
            );
        }

        const data = await n8nResponse.json();

        // n8n returns { output: "..." } for chat trigger responses
        const reply =
            data?.output ||
            data?.text ||
            data?.message ||
            data?.reply ||
            JSON.stringify(data);

        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error("Error in heart-chat API:", error);
        return NextResponse.json(
            { error: error?.message || "Failed to process chat" },
            { status: 500 }
        );
    }
}
