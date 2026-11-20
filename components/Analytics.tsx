"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

// Microsoft Clarity (heatmaps + session recordings) with a consent banner.
// UK/EEA/CH visitors need a ConsentV2 signal (enforced by Microsoft since
// 31 Oct 2025, and required by PECR/UK GDPR for analytics cookies). Until the
// visitor accepts, Clarity runs in its cookieless no-consent mode.
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "zgl1ju8ku3";
const CONSENT_KEY = "heart-analytics-consent"; // "granted" | "denied"
const LIVE_HOST = /(^|\.)ecoheartai\.com$/;

type Consent = "granted" | "denied";

declare global {
    interface Window {
        clarity?: (...args: unknown[]) => void;
    }
}

function readConsent(): Consent | null {
    try {
        const v = window.localStorage.getItem(CONSENT_KEY);
        return v === "granted" || v === "denied" ? v : null;
    } catch {
        return null;
    }
}

function sendConsent(c: Consent) {
    window.clarity?.("consentv2", {
        ad_Storage: "denied",
        analytics_Storage: c,
    });
}

export default function Analytics() {
    const [enabled, setEnabled] = useState(false);
    const [consent, setConsent] = useState<Consent | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setEnabled(LIVE_HOST.test(window.location.hostname));
        setConsent(readConsent());
        setReady(true);
    }, []);

    // Re-send the stored choice once Clarity's queue exists.
    useEffect(() => {
        if (enabled && consent) sendConsent(consent);
    }, [enabled, consent]);

    const choose = (c: Consent) => {
        try {
            window.localStorage.setItem(CONSENT_KEY, c);
        } catch {
            /* storage blocked: choice applies to this page view only */
        }
        setConsent(c);
        sendConsent(c);
    };

    if (!enabled) return null;

    return (
        <>
            <Script id="ms-clarity" strategy="afterInteractive">
                {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
            </Script>

            {ready && consent === null && (
                <div
                    role="dialog"
                    aria-label="Cookie preferences"
                    className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6"
                >
                    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-brand-900/10 p-5 sm:flex sm:items-center sm:gap-6">
                        <p className="text-sm text-slate-600 leading-relaxed">
                            We use Microsoft Clarity analytics cookies to see how the site is used, so we can improve it.
                            No advertising cookies. You can accept or decline.
                        </p>
                        <div className="mt-4 flex shrink-0 gap-3 sm:mt-0">
                            <button
                                onClick={() => choose("denied")}
                                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Decline
                            </button>
                            <button
                                onClick={() => choose("granted")}
                                className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 shadow-lg shadow-brand-600/25"
                            >
                                Accept
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
