"use client";

import { useEffect, useRef } from "react";

export default function FlourishEmbed({
    visualisationId,
    title,
}: {
    visualisationId: string;
    title: string;
}) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Avoid duplicate script injection
        const existingScript = document.querySelector(
            'script[src="https://public.flourish.studio/resources/embed.js"]'
        );

        if (!existingScript) {
            const script = document.createElement("script");
            script.src = "https://public.flourish.studio/resources/embed.js";
            script.async = true;
            document.body.appendChild(script);
        } else {
            // Script already present, trigger re-init if Flourish exposes it
            // @ts-ignore
            if (window.Flourish?.rescan) window.Flourish.rescan();
        }
    }, [visualisationId]);

    return (
        <div
            ref={containerRef}
            className="flourish-embed flourish-chart"
            data-src={`visualisation/${visualisationId}`}
        >
            <noscript>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={`https://public.flourish.studio/visualisation/${visualisationId}/thumbnail`}
                    width="100%"
                    alt={title}
                />
            </noscript>
        </div>
    );
}
