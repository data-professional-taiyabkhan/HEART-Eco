"use client";

import { useState } from "react";

type Props = {
    label: string;
    type: "text" | "email" | "password";
    value: string;
    onChange: (v: string) => void;
    autoComplete: string;
    placeholder?: string;
    hint?: string;
};

export default function AuthField({ label, type, value, onChange, autoComplete, placeholder, hint }: Props) {
    const [show, setShow] = useState(false);
    const isPassword = type === "password";
    const id = `field-${label.toLowerCase().replace(/\s+/g, "-")}`;

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    type={isPassword && show ? "text" : type}
                    required
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100 ${isPassword ? "pr-16" : ""}`}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow((s) => !s)}
                        className="absolute inset-y-0 right-0 px-4 text-xs font-semibold text-brand-600 hover:text-brand-800"
                        aria-label={show ? "Hide password" : "Show password"}
                    >
                        {show ? "Hide" : "Show"}
                    </button>
                )}
            </div>
            {hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
        </div>
    );
}
