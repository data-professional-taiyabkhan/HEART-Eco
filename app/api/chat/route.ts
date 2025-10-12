import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID || "asst_9dMB8z1B2Vzgck7AdXKe3ko9";

export async function POST(req: NextRequest) {
  try {
    const { message, threadId } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    let currentThreadId = threadId;

    // Create a new thread if one doesn't exist
    if (!currentThreadId) {
      const thread = await openai.beta.threads.create();
      currentThreadId = thread.id;
    }

    // Add the user's message to the thread
    await openai.beta.threads.messages.create(currentThreadId, {
      role: "user",
      content: message,
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(currentThreadId, {
      assistant_id: ASSISTANT_ID,
    });

    // Poll for completion
    let runStatus = await openai.beta.threads.runs.retrieve(currentThreadId, run.id);
    
    while (runStatus.status !== "completed") {
      if (runStatus.status === "failed" || runStatus.status === "cancelled" || runStatus.status === "expired") {
        throw new Error(`Run ${runStatus.status}`);
      }
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(currentThreadId, run.id);
    }

    // Get the assistant's messages
    const messages = await openai.beta.threads.messages.list(currentThreadId);
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
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process chat" },
      { status: 500 }
    );
  }
}

