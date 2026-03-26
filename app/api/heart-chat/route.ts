import { NextRequest, NextResponse } from "next/server";

const N8N_WEBHOOK_URL =
    process.env.N8N_WEBHOOK_URL ||
    "https://taiyabmailbox.app.n8n.cloud/webhook/03364cf8-50ff-4e2c-94e9-048d31bf5d3d/chat";

export async function POST(req: NextRequest) {
    try {
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
            headers: { "Content-Type": "application/json" },
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
