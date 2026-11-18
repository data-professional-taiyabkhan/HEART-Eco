"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/AuthShell";
import AuthField from "@/components/AuthField";

function friendlyError(message: string) {
    const m = message.toLowerCase();
    if (m.includes("invalid login credentials")) return "Email or password is incorrect.";
    if (m.includes("email not confirmed")) return "Please confirm your email first. Check your inbox for the link we sent.";
    if (m.includes("failed to fetch") || m.includes("network")) return "We couldn't reach the server. Please try again in a moment.";
    return message;
}

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const rawNext = searchParams.get("next");
    const next = rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";
    const linkFailed = searchParams.get("error") === "auth";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(
        linkFailed
            ? "That confirmation link couldn't sign you in. It may have expired, or been opened on a different device. Your email is usually confirmed anyway, so try signing in below."
            : null
    );
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const supabase = createClient();
            const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
            if (signInError) {
                setError(friendlyError(signInError.message));
                return;
            }
            router.push(next);
            router.refresh();
        } catch (err) {
            setError(friendlyError(err instanceof Error ? err.message : String(err)));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell>
            <div className="bg-white rounded-3xl shadow-xl shadow-brand-900/5 border border-slate-100 p-8 sm:p-10">
                <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
                <p className="mt-2 text-sm text-slate-500">Sign in to the HEART Score dashboard and assistant.</p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <AuthField label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" placeholder="you@example.com" />
                    <AuthField label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" placeholder="Your password" />
                    <div className="-mt-2 text-right">
                        <Link href="/forgot-password" className="text-sm font-semibold text-brand-600 hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    {error && (
                        <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-[0.99] disabled:opacity-60 text-white font-semibold shadow-lg shadow-brand-600/25 transition"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <p className="text-sm text-slate-500 mt-8 text-center">
                    New here?{" "}
                    <Link href="/signup" className="text-brand-600 font-semibold hover:underline">
                        Create a free account
                    </Link>
                </p>
            </div>
        </AuthShell>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}
