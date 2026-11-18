"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/AuthShell";
import AuthField from "@/components/AuthField";

// Reached from the reset email: /auth/callback exchanges the code for a session,
// then redirects here. The user is signed in for this one step.
export default function ResetPasswordPage() {
    const router = useRouter();
    const [hasSession, setHasSession] = useState<boolean | null>(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    useEffect(() => {
        createClient()
            .auth.getUser()
            .then(({ data }) => setHasSession(!!data.user));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (password.length < 8) return setError("Password must be at least 8 characters.");
        if (password !== confirmPassword) return setError("Passwords do not match.");
        setLoading(true);
        try {
            const { error: updateError } = await createClient().auth.updateUser({ password });
            if (updateError) {
                setError(updateError.message);
                return;
            }
            setDone(true);
            setTimeout(() => {
                router.push("/dashboard");
                router.refresh();
            }, 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    };

    const card = "bg-white rounded-3xl shadow-xl shadow-brand-900/5 border border-slate-100 p-8 sm:p-10";

    if (hasSession === false) {
        return (
            <AuthShell>
                <div className={`${card} text-center`}>
                    <h1 className="text-2xl font-bold text-slate-900">Reset link expired</h1>
                    <p className="mt-3 text-sm text-slate-600">
                        This reset link is no longer valid. Links work once and expire after a while. Request a new one below.
                    </p>
                    <Link href="/forgot-password" className="inline-block mt-8 text-brand-600 font-semibold hover:underline text-sm">
                        Send a new reset link
                    </Link>
                </div>
            </AuthShell>
        );
    }

    if (done) {
        return (
            <AuthShell>
                <div className={`${card} text-center`}>
                    <h1 className="text-2xl font-bold text-slate-900">Password updated</h1>
                    <p className="mt-3 text-sm text-slate-600">Taking you to your dashboard…</p>
                </div>
            </AuthShell>
        );
    }

    return (
        <AuthShell>
            <div className={card}>
                <h1 className="text-3xl font-bold text-slate-900">Choose a new password</h1>
                <p className="mt-2 text-sm text-slate-500">Use at least 8 characters.</p>
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <AuthField label="New password" type="password" value={password} onChange={setPassword} autoComplete="new-password" placeholder="At least 8 characters" />
                    <AuthField label="Confirm new password" type="password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" placeholder="Repeat your password" />
                    {error && (
                        <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
                    )}
                    <button
                        type="submit"
                        disabled={loading || hasSession === null}
                        className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-[0.99] disabled:opacity-60 text-white font-semibold shadow-lg shadow-brand-600/25 transition"
                    >
                        {loading ? "Saving..." : "Update password"}
                    </button>
                </form>
            </div>
        </AuthShell>
    );
}
