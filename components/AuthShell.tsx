import Link from "next/link";

const PILLARS = [
    { letter: "H", label: "Housing & Health" },
    { letter: "E", label: "Energy & Education" },
    { letter: "A", label: "Affordability" },
    { letter: "R", label: "Rate" },
    { letter: "T", label: "Trade" },
];

export default function AuthShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
            {/* Brand panel */}
            <aside className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 text-white px-6 py-8 lg:px-14 lg:py-12 flex flex-col">
                <div
                    aria-hidden
                    className="absolute inset-0 opacity-[0.12] animate-gridDrift"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />
                <div aria-hidden className="absolute -top-24 -left-20 h-80 w-80 rounded-full bg-brand-400/40 blur-3xl animate-floatA" />
                <div aria-hidden className="absolute -bottom-28 -right-16 h-96 w-96 rounded-full bg-sky-300/30 blur-3xl animate-floatB" />

                <Link href="/" className="relative z-10 inline-flex items-center gap-3 w-fit">
                    <span className="bg-white rounded-xl p-1.5 shadow-sm">
                        <img src="/brand/eco-logo.png" alt="ECO HEART AI" className="h-8 w-auto" />
                    </span>
                    <span className="font-semibold tracking-wide">ECO HEART AI</span>
                </Link>

                <div className="relative z-10 mt-8 lg:mt-auto lg:mb-auto">
                    <p className="hidden lg:block text-sm uppercase tracking-[0.2em] text-brand-100 mb-4">
                        HEART Economic Model
                    </p>
                    <div className="flex gap-2 sm:gap-3">
                        {PILLARS.map((p, i) => (
                            <div
                                key={p.letter}
                                className="animate-letterRise h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-xl sm:text-3xl font-bold shadow-lg"
                                style={{ animationDelay: `${150 + i * 120}ms` }}
                                title={p.label}
                            >
                                {p.letter}
                            </div>
                        ))}
                    </div>
                    <h2 className="hidden lg:block mt-8 text-3xl xl:text-4xl font-bold leading-tight max-w-md">
                        New innovative global economic performance analysis system.
                    </h2>
                    <ul className="hidden lg:grid mt-8 grid-cols-2 gap-x-6 gap-y-2 text-sm text-brand-50/90 max-w-md">
                        {PILLARS.map((p) => (
                            <li key={p.letter} className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
                                <span>
                                    <span className="font-semibold text-white">{p.letter}</span> · {p.label}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="relative z-10 hidden lg:block text-xs text-brand-100/80">
                    HEART Score Economic Model by Khurshid Imtiaz Ul Haque
                </p>
            </aside>

            {/* Form panel */}
            <main className="flex items-center justify-center px-4 py-10 sm:px-8">
                <div className="w-full max-w-md animate-fadeIn">{children}</div>
            </main>
        </div>
    );
}
