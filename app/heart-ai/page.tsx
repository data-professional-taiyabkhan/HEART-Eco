"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
    role: "user" | "assistant";
    content: string;
}

const SAMPLE_QUESTIONS = [
    { emoji: "🌍", text: "What is the HEART Score?" },
    { emoji: "📊", text: "Compare USA and China HEART Scores for 2025" },
    { emoji: "🏆", text: "Which country ranks highest in the G20 for 2025?" },
    { emoji: "📈", text: "Show me India's HEART Score trend from 2019 to 2025" },
    { emoji: "🔮", text: "What is the forecast for Saudi Arabia's Heart Score in 2030?" },
    { emoji: "💡", text: "Why does the USA have a high HAR but lower HV?" },
];

export default function HeartAIPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [sessionId] = useState<string>(() => {
        if (typeof window !== "undefined") {
            const existing = sessionStorage.getItem("heart-ai-session");
            if (existing) return existing;
            const newId = `heart-ai-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
            sessionStorage.setItem("heart-ai-session", newId);
            return newId;
        }
        return `heart-ai-${Date.now()}`;
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (text?: string) => {
        const userMessage = (text || input).trim();
        if (!userMessage || loading) return;

        setInput("");
        const newMessages: Message[] = [
            ...messages,
            { role: "user", content: userMessage },
        ];
        setMessages(newMessages);
        setLoading(true);

        try {
            const response = await fetch("/api/heart-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    sessionId,
                }),
            });

            const data = await response.json().catch(() => ({} as any));

            if (!response.ok) {
                throw new Error(
                    data?.error || `Failed to get response (${response.status})`
                );
            }

            setMessages([
                ...newMessages,
                { role: "assistant", content: data.reply },
            ]);
        } catch (error: any) {
            console.error("Error:", error);
            setMessages([
                ...newMessages,
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

    const clearChat = () => {
        setMessages([]);
        setInput("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative container mx-auto px-4 py-6 max-w-5xl flex flex-col min-h-screen">
                {/* Header */}
                <div className="mb-6 animate-fadeIn">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                                    <span className="text-white text-xl">🤖</span>
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">HEART AI</h1>
                                <p className="text-sm text-indigo-300">
                                    Powered by HEART Score Economic Model
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {messages.length > 0 && (
                                <button
                                    onClick={clearChat}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-medium rounded-xl transition-all duration-300 text-sm border border-white/10"
                                >
                                    ✨ New Chat
                                </button>
                            )}
                            <Link
                                href="/"
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-medium rounded-xl transition-all duration-300 text-sm border border-white/10"
                            >
                                🏠 Home
                            </Link>
                            <Link
                                href="/dashboard"
                                className="px-4 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 hover:text-white font-medium rounded-xl transition-all duration-300 text-sm border border-indigo-500/30"
                            >
                                📊 Dashboard
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Chat Container */}
                <div className="flex-1 flex flex-col bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-black/20 overflow-hidden animate-fadeIn" style={{ animationDelay: "0.1s", minHeight: "0" }}>
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6" style={{ minHeight: "400px", maxHeight: "calc(100vh - 320px)" }}>
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="mb-8">
                                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
                                        <span className="text-4xl">💬</span>
                                    </div>
                                    <h2 className="text-xl font-semibold text-white mb-2">
                                        Hi there! 👋
                                    </h2>
                                    <p className="text-indigo-300/70 max-w-md">
                                        I&apos;m HEART AI, your assistant for the HEART Score Economic
                                        Model. Ask me about countries, rankings, forecasts, or
                                        methodology.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full">
                                    {SAMPLE_QUESTIONS.map((q, i) => (
                                        <button
                                            key={i}
                                            onClick={() => sendMessage(q.text)}
                                            className="group text-left p-4 bg-white/[0.03] hover:bg-white/[0.08] rounded-xl border border-white/5 hover:border-indigo-500/30 transition-all duration-300"
                                        >
                                            <span className="text-lg mr-2">{q.emoji}</span>
                                            <span className="text-sm text-white/60 group-hover:text-white/90 transition-colors">
                                                {q.text}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${message.role === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                            } animate-fadeIn`}
                                    >
                                        <div
                                            className={`max-w-[85%] ${message.role === "user"
                                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl rounded-br-md shadow-lg shadow-indigo-500/20"
                                                : "bg-white/[0.06] text-white/90 rounded-2xl rounded-bl-md border border-white/10"
                                                } px-5 py-3`}
                                        >
                                            {message.role === "assistant" && (
                                                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
                                                    <div className="w-5 h-5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                                                        <span className="text-white text-[10px] font-bold">H</span>
                                                    </div>
                                                    <span className="text-xs font-medium text-indigo-300">
                                                        HEART AI
                                                    </span>
                                                </div>
                                            )}
                                            <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                                {message.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {loading && (
                                    <div className="flex justify-start animate-fadeIn">
                                        <div className="bg-white/[0.06] rounded-2xl rounded-bl-md px-5 py-4 border border-white/10">
                                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
                                                <div className="w-5 h-5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-[10px] font-bold">H</span>
                                                </div>
                                                <span className="text-xs font-medium text-indigo-300">
                                                    HEART AI is thinking...
                                                </span>
                                            </div>
                                            <div className="flex gap-1.5">
                                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce-dot" />
                                                <div
                                                    className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce-dot"
                                                    style={{ animationDelay: "0.2s" }}
                                                />
                                                <div
                                                    className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce-dot"
                                                    style={{ animationDelay: "0.4s" }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-white/10 p-4 bg-white/[0.02]">
                        <div className="flex gap-3 items-end">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Ask about HEART scores, countries, rankings, or methodology..."
                                className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 resize-none transition-all text-sm"
                                rows={2}
                                disabled={loading}
                            />
                            <button
                                onClick={() => sendMessage()}
                                disabled={loading || !input.trim()}
                                aria-label="Send message"
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl px-5 py-3 hover:from-indigo-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transform hover:scale-105 disabled:transform-none disabled:shadow-none"
                            >
                                <svg
                                    className="w-5 h-5"
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
                        <p className="text-xs text-white/20 mt-2 ml-1">
                            Press Enter to send · Shift+Enter for new line · Data sourced from local HEART Model files
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
