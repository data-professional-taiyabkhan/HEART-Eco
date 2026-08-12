import Link from "next/link";

const PILLARS = [
    {
        letter: "H",
        title: "Housing & Health",
        description:
            "Social infrastructure and well-being: housing availability and healthcare investment.",
    },
    {
        letter: "E",
        title: "Energy & Education",
        description:
            "Development of resources and human capital: energy production and usage, education outcomes and expenditure.",
    },
    {
        letter: "A",
        title: "Affordability",
        description:
            "Purchasing power of citizens and general standard of living: income levels, inequality, and cost of living.",
    },
    {
        letter: "R",
        title: "Rate",
        description:
            "Macroeconomic stability via interest rates, inflation rate, and GDP growth rate.",
    },
    {
        letter: "T",
        title: "Trade",
        description:
            "Trade competitiveness: trade balance, tariffs, taxes, and integration into global trade.",
    },
];

const FEATURES = [
    {
        emoji: "📊",
        title: "Dashboard",
        description: "Explore detailed economic metrics for any country in the model.",
    },
    {
        emoji: "⚖️",
        title: "Compare",
        description: "Compare two countries side-by-side across every HEART metric.",
    },
    {
        emoji: "🧮",
        title: "Calculator",
        description: "Calculate a HEART Score yourself using the model's formula.",
    },
    {
        emoji: "🤖",
        title: "Assistant",
        description: "Ask questions about HEART scores, rankings, and forecasts.",
    },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900">
            {/* Header */}
            <header className="border-b border-slate-200 sticky top-0 z-30 bg-white/90 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <span className="text-xl font-black text-blue-700">HEART</span>
                    <nav className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors"
                        >
                            Sign in
                        </Link>
                        <Link
                            href="/signup"
                            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                            Create free account
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero */}
            <section className="container mx-auto px-4 py-20 md:py-28 text-center">
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 mb-6">
                    Economic Model
                </span>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                    HEART Score Economic Model
                </h1>
                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                    A multidimensional framework for evaluating economic performance —
                    combining macroeconomic indicators with human development factors to
                    measure a nation&apos;s inclusivity, sustainability, and social equity.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/signup"
                        className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
                    >
                        Create free account
                    </Link>
                    <Link
                        href="/login"
                        className="w-full sm:w-auto px-8 py-3.5 border border-slate-300 hover:border-blue-300 hover:bg-blue-50 text-slate-700 font-semibold rounded-lg transition-colors"
                    >
                        Sign in
                    </Link>
                </div>
            </section>

            {/* Pillars */}
            <section className="bg-slate-50 border-y border-slate-200">
                <div className="container mx-auto px-4 py-16 md:py-20">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">
                            The five HEART pillars
                        </h2>
                        <p className="text-slate-600">
                            &ldquo;HEART&rdquo; is an acronym representing five pillars of
                            economic performance.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {PILLARS.map((pillar) => (
                            <div
                                key={pillar.letter}
                                className="bg-white rounded-xl border border-slate-200 p-6"
                            >
                                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg mb-4">
                                    {pillar.letter}
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">{pillar.title}</h3>
                                <p className="text-sm text-slate-600">{pillar.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What the HEART Score is */}
            <section className="container mx-auto px-4 py-16 md:py-20">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">
                        What the HEART Score is
                    </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    <div className="rounded-xl border border-slate-200 p-6">
                        <h3 className="font-bold text-blue-700 mb-2">Heart Value (HV)</h3>
                        <p className="text-sm text-slate-600">
                            A numerical score from 0 to 1, combining the contributions of
                            Housing, Health, Energy, and Education to GDP, together with
                            global GDP share, trade balance, and interest payments on debt.
                            A higher HV reflects stronger economic resilience.
                        </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-6">
                        <h3 className="font-bold text-blue-700 mb-2">
                            Heart Affordability Ranking (HAR)
                        </h3>
                        <p className="text-sm text-slate-600">
                            A letter grade from A+ to D-, based on Adjusted Per Capita
                            Income and an inequality-adjusted Human Development Index. HAR
                            reflects how well economic prosperity translates into citizens&apos;
                            well-being.
                        </p>
                    </div>
                </div>
                <p className="text-center text-slate-600 mt-8">
                    The final HEART Score combines both: HV + HAR — for example,{" "}
                    <span className="font-semibold text-slate-900">0.76C</span>.
                </p>
            </section>

            {/* What you get */}
            <section className="bg-slate-50 border-y border-slate-200">
                <div className="container mx-auto px-4 py-16 md:py-20">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">What you get</h2>
                        <p className="text-slate-600">
                            Create a free account to access the full HEART platform.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {FEATURES.map((feature) => (
                            <div
                                key={feature.title}
                                className="bg-white rounded-xl border border-slate-200 p-6 text-center"
                            >
                                <div className="text-3xl mb-3">{feature.emoji}</div>
                                <h3 className="font-bold text-slate-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-slate-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <Link
                            href="/signup"
                            className="inline-block px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
                        >
                            Create free account
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="container mx-auto px-4 py-10 text-center">
                <p className="text-sm text-slate-500">
                    Developed by Khurshid Imtiaz Ul Haque
                </p>
                <p className="text-xs text-slate-400 mt-1">
                    © 2026 HEART Score Economic Model. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
