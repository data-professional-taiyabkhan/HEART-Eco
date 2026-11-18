"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/AuthShell";
import AuthField from "@/components/AuthField";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const site = (process.env.NEXT_PUBLIC_SITE_URL || window.location.origin).replace(/\/+$/, "");
            const supabase = createClient();
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${site}/auth/callback?next=/reset-password`,
            });
            // Show rate-limit errors; otherwise show the same neutral message so
            // the page doesn't reveal which emails have accounts.
            if (resetError && /rate|limit|seconds/i.test(resetError.message)) {
                setError("Too many requests. Please wait a minute and try again.");
                return;
            }
            setSent(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    };

    const card = "bg-white rounded-3xl shadow-xl shadow-brand-900/5 border border-slate-100 p-8 sm:p-10";

    if (sent) {
        return (
            <AuthShell>
                <div className={`${card} text-center`}>
                    <div className="mx-auto mb-5 h-14 w-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center text-2xl">✉</div>
                    <h1 className="text-2xl font-bold text-slate-900">Check your email</h1>
                    <p className="mt-3 text-sm text-slate-600">
                        If an account exists for <span className="font-semibold text-slate-900">{email}</span>, we&apos;ve sent a link to
                        reset your password. It may take a minute, and it can land in spam.
                    </p>
                    <Link href="/login" className="inline-block mt-8 text-brand-600 font-semibold hover:underline text-sm">
                        Back to sign in
                    </Link>
                </div>
            </AuthShell>
        );
    }

    return (
        <AuthShell>
            <div className={card}>
                <h1 className="text-3xl font-bold text-slate-900">Reset your password</h1>
                <p className="mt-2 text-sm text-slate-500">Enter your account email and we&apos;ll send you a reset link.</p>
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <AuthField label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" placeholder="you@example.com" />
                    {error && (
                        <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-[0.99] disabled:opacity-60 text-white font-semibold shadow-lg shadow-brand-600/25 transition"
                    >
                        {loading ? "Sending..." : "Send reset link"}
                    </button>
                </form>
                <p className="text-sm text-slate-500 mt-8 text-center">
                    Remembered it?{" "}
                    <Link href="/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
                </p>
            </div>
        </AuthShell>
    );
}
