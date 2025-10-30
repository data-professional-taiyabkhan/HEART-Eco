"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          threadId,
        }),
      });

      const data = await response.json().catch(() => ({} as any));

      if (!response.ok) {
        throw new Error(data?.error || `Failed to get response (${response.status})`);
      }
      
      if (data.threadId && !threadId) {
        setThreadId(data.threadId);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (error: any) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, I encountered an error. ${error?.message || "Please try again."}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                AI Assistant
              </h1>
              <p className="text-gray-600 mt-1">
                Ask questions about the HEART Model and economic data
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div>
                <h2 className="font-bold text-lg">HEART Model AI Assistant</h2>
                <p className="text-sm text-indigo-100">Powered by OpenAI</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-[600px] overflow-y-auto p-6 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-20 animate-fadeIn">
                <div className="mb-6">
                  <svg
                    className="w-20 h-20 mx-auto text-indigo-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Start a conversation
                </h3>
                <p className="text-sm text-gray-600 mb-8">
                  Ask me anything about the HEART economic model, country comparisons, or specific metrics.
                </p>
                <div className="max-w-md mx-auto space-y-3">
                  <div className="bg-white p-4 rounded-lg shadow-sm text-left border border-gray-200 hover:border-indigo-300 transition-colors cursor-pointer" onClick={() => setInput("What is the HEART Score?")}>
                    <p className="text-sm text-gray-700">💡 &quot;What is the HEART Score?&quot;</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm text-left border border-gray-200 hover:border-indigo-300 transition-colors cursor-pointer" onClick={() => setInput("Compare USA and China")}>
                    <p className="text-sm text-gray-700">🌍 &quot;Compare USA and China&quot;</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm text-left border border-gray-200 hover:border-indigo-300 transition-colors cursor-pointer" onClick={() => setInput("Which country has the highest HEART Score?")}>
                    <p className="text-sm text-gray-700">📊 &quot;Which country has the highest HEART Score?&quot;</p>
                  </div>
                </div>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex mb-4 animate-fadeIn ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                      : "bg-white text-gray-900 shadow-md border border-gray-100"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">AI</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-500">Assistant</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start mb-4 animate-fadeIn">
                <div className="bg-white rounded-2xl px-5 py-4 shadow-md border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">AI</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-500">Assistant</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce-dot"></div>
                    <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce-dot" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce-dot" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-6 bg-white">
            <div className="flex gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question about HEART scores, countries, or economic metrics..."
                className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
                rows={2}
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl px-6 py-3 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

