"use client";

import { useEffect, useState } from "react";

const SLIDES = [
    { src: "/brand/heart-model.png", alt: "HEART Economic Model diagram" },
    { src: "/brand/blue-heart.png", alt: "HEART pillars pyramid" },
    { src: "/brand/heart-score.png", alt: "HEART Score Economic Model emblem" },
];

export default function HeroCarousel() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setIndex((i) => (i + 1) % SLIDES.length);
        }, 4000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="relative w-full max-w-md mx-auto aspect-square">
            {SLIDES.map((slide, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    key={slide.src}
                    src={slide.src}
                    alt={slide.alt}
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ${
                        i === index ? "opacity-100" : "opacity-0"
                    }`}
                />
            ))}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {SLIDES.map((slide, i) => (
                    <button
                        key={slide.src}
                        onClick={() => setIndex(i)}
                        aria-label={`Show slide ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all ${
                            i === index ? "w-6 bg-brand-600" : "w-1.5 bg-brand-200"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}
