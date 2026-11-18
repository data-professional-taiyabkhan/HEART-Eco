"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/AuthShell";
import AuthField from "@/components/AuthField";

export default function SignupPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const supabase = createClient();
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: fullName },
                    emailRedirectTo: `${(process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "")}/auth/callback`,
                },
            });
            if (signUpError) {
                setError(signUpError.message);
                return;
            }
            // With email confirmation on, Supabase returns success with no identities
            // when the email is already registered, and sends no email.
            if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
                setError("An account with this email already exists. Please sign in instead.");
                return;
            }
            setSubmitted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    };

    const card = "bg-white rounded-3xl shadow-xl shadow-brand-900/5 border border-slate-100 p-8 sm:p-10";

    if (submitted) {
        return (
            <AuthShell>
                <div className={`${card} text-center`}>
                    <div className="mx-auto mb-5 h-14 w-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center text-2xl">✉</div>
                    <h1 className="text-2xl font-bold text-slate-900">Check your email</h1>
                    <p className="mt-3 text-sm text-slate-600">
                        We sent a confirmation link to <span className="font-semibold text-slate-900">{email}</span>.
                        Click it to activate your account. It may take a minute, and it can land in spam.
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
                <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
                <p className="mt-2 text-sm text-slate-500">Free access to the HEART Score dashboard, comparisons and assistant.</p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <AuthField label="Full name" type="text" value={fullName} onChange={setFullName} autoComplete="name" placeholder="Jane Smith" />
                    <AuthField label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" placeholder="you@example.com" />
                    <AuthField label="Password" type="password" value={password} onChange={setPassword} autoComplete="new-password" placeholder="At least 8 characters" />
                    <AuthField label="Confirm password" type="password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" placeholder="Repeat your password" />

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
                        {loading ? "Creating account..." : "Create free account"}
                    </button>
                </form>

                <p className="text-sm text-slate-500 mt-8 text-center">
                    Already have an account?{" "}
                    <Link href="/login" className="text-brand-600 font-semibold hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </AuthShell>
    );
}
