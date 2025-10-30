import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_ORG_ID = process.env.OPENAI_ORG_ID;
const OPENAI_PROJECT = process.env.OPENAI_PROJECT;

// Initialize client when key exists; otherwise we will error out in handler
const openai = OPENAI_API_KEY
  ? new OpenAI({
      apiKey: OPENAI_API_KEY,
      organization: OPENAI_ORG_ID,
      project: OPENAI_PROJECT,
    })
  : null;

const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID || "asst_9dMB8z1B2Vzgck7AdXKe3ko9";

export async function POST(req: NextRequest) {
  try {
    if (!OPENAI_API_KEY) {
      // Surface a clear error if key is missing in the environment
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not set on the server. Add it to environment variables." },
        { status: 500 }
      );
    }

    const { message, threadId } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    let currentThreadId = threadId;

    // Create a new thread if one doesn't exist
    if (!currentThreadId) {
      const thread = await openai!.beta.threads.create();
      currentThreadId = thread.id;
    }

    // Add the user's message to the thread
    await openai!.beta.threads.messages.create(currentThreadId, {
      role: "user",
      content: message,
    });

    // Run the assistant
    const run = await openai!.beta.threads.runs.create(currentThreadId, {
      assistant_id: ASSISTANT_ID,
    });

    // Poll for completion
    let runStatus = await openai!.beta.threads.runs.retrieve(currentThreadId, run.id);
    
    while (runStatus.status !== "completed") {
      if (runStatus.status === "failed" || runStatus.status === "cancelled" || runStatus.status === "expired") {
        throw new Error(`Run ${runStatus.status}`);
      }
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await openai!.beta.threads.runs.retrieve(currentThreadId, run.id);
    }

    // Get the assistant's messages
    const messages = await openai!.beta.threads.messages.list(currentThreadId);
    const assistantMessages = messages.data.filter((msg) => msg.role === "assistant");
    
    if (assistantMessages.length === 0) {
      throw new Error("No response from assistant");
    }

    const lastMessage = assistantMessages[0];
    const textContent = lastMessage.content.find((content) => content.type === "text");
    
    if (!textContent || textContent.type !== "text") {
      throw new Error("Invalid response format");
    }

    return NextResponse.json({
      response: textContent.text.value,
      threadId: currentThreadId,
    });
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

