import { NextRequest, NextResponse } from "next/server";
import { runHeartChat, ChatMessage } from "@/lib/heartAiWorkflow";

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "OPENAI_API_KEY is not set on the server." },
                { status: 500 }
            );
        }

        const body = await req.json();
        const { message, history } = body as {
            message: string;
            history?: ChatMessage[];
        };

        if (!message) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // Build conversation (keep last 6 messages for context window)
        const conversationHistory: ChatMessage[] = [
            ...(history || []).slice(-6),
            { role: "user", content: message },
        ];

        const reply = await runHeartChat(conversationHistory);

        return NextResponse.json({ reply });
    } catch (error: any) {
        const status = error?.status || error?.response?.status || 500;
        const message =
            error?.error?.message ||
            error?.response?.data?.error?.message ||
            error?.message ||
            "Failed to process chat";

        console.error("Error in heart-chat API:", { status, message, raw: error });
        return NextResponse.json({ error: message }, { status });
    }
}
