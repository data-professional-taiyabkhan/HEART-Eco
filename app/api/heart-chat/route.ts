import { NextRequest, NextResponse } from "next/server";

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

        const HEART_WEBHOOK_SECRET = process.env.HEART_WEBHOOK_SECRET;
        if (!HEART_WEBHOOK_SECRET) {
            console.error("HEART_WEBHOOK_SECRET is not configured");
            return NextResponse.json(
                { error: "HEART_WEBHOOK_SECRET is not configured" },
                { status: 500 }
            );
        }

        const body = await req.json();
        const { message, sessionId } = body as { message: string; sessionId?: string };

        if (!message) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-heart-secret": HEART_WEBHOOK_SECRET,
            },
            body: JSON.stringify({ chatInput: message, sessionId: sessionId || "heart-ai-default" }),
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
