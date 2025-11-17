import { NextRequest, NextResponse } from "next/server";
import { runWorkflow } from "@/lib/workflow";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not set on the server. Add it to environment variables." },
        { status: 500 }
      );
    }

    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Call the workflow using the Agents SDK
    const result = await runWorkflow({
      input_as_text: message,
    });

    // Extract the reply text from the workflow response
    const replyText = result.output_text || "";

    if (!replyText) {
      throw new Error("No output from workflow");
    }

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    // Try to unwrap OpenAI SDK error shapes and surface useful messages
    const status =
      error?.status ||
      error?.response?.status ||
      500;

    const message =
      error?.error?.message ||
      error?.response?.data?.error?.message ||
      error?.message ||
      "Failed to process chat";

    console.error("Error in chat API:", { status, message, raw: error });
    return NextResponse.json({ error: message }, { status });
  }
}

