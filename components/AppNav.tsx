"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAV_LINKS = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/compare", label: "Compare" },
    { href: "/calculator", label: "Calculator" },
    { href: "/doctrine", label: "Doctrine" },
    { href: "/assistant", label: "Assistant" },
];

export default function AppNav() {
    const pathname = usePathname();
    const [email, setEmail] = useState<string | null>(null);
    const [firstName, setFirstName] = useState<string | null>(null);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => {
            setEmail(data.user?.email ?? null);
            const fullName = data.user?.user_metadata?.full_name as string | undefined;
            setFirstName(fullName ? fullName.trim().split(/\s+/)[0] : null);
        });
    }, []);

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
            <div className="container mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
                <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/brand/eco-logo.png" alt="ECO HEART AI" className="h-9 w-auto" />
                </Link>

                <div className="flex flex-wrap items-center gap-1">
                    {NAV_LINKS.map((link) => {
                        const active = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${active
                                    ? "bg-brand-600 text-white"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    {firstName ? (
                        <span className="text-xs text-gray-600 hidden sm:inline">
                            Hello, <span className="font-semibold text-gray-800">{firstName}</span> 👋
                        </span>
                    ) : (
                        email && (
                            <span className="text-xs text-gray-500 hidden sm:inline">{email}</span>
                        )
                    )}
                    <form action="/auth/signout" method="POST">
                        <button
                            type="submit"
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                        >
                            Sign out
                        </button>
                    </form>
                </div>
            </div>
        </nav>
    );
}
