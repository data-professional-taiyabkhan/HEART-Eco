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

const VALUE_PILLARS = [
    "HEART Value as economic resilience",
    "HEART Affordability Value",
    "Heart Affordability Ranking",
];

const HEART_OVERVIEW = [
    { letter: "H", text: "Housing & Health" },
    { letter: "E", text: "Energy + Education" },
    { letter: "A", text: "Affordability" },
    { letter: "R", text: "Rate (interest rate, inflation rate, Debt to GDP Ratio and GDP growth rate)" },
    { letter: "T", text: "Trade (trade, tariffs, taxes & trade balance)" },
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
                    <span className="text-xl font-black text-indigo-700">HEART</span>
                    <nav className="hidden sm:flex items-center gap-6 text-sm font-semibold text-slate-600">
                        <Link href="/" className="hover:text-indigo-700 transition-colors">
                            Home
                        </Link>
                        <a href="#about" className="hover:text-indigo-700 transition-colors">
                            About Us
                        </a>
                        <a href="#contact" className="hover:text-indigo-700 transition-colors">
                            Contact Us
                        </a>
                    </nav>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-700 transition-colors"
                        >
                            Sign in
                        </Link>
                        <Link
                            href="/signup"
                            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                        >
                            Create free account
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="container mx-auto px-4 py-20 md:py-28 text-center">
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 mb-6">
                    Economic Model
                </span>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                    ECO-HEART AI Heart Economic Model
                </h1>
                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                    New innovative global economic performance analysis system.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                        href="#about"
                        className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
                    >
                        Learn More
                    </a>
                    <Link
                        href="/signup"
                        className="w-full sm:w-auto px-8 py-3.5 border border-slate-300 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 font-semibold rounded-lg transition-colors"
                    >
                        Create free account
                    </Link>
                </div>
            </section>

            {/* Welcome / About */}
            <section id="about" className="bg-slate-50 border-y border-slate-200">
                <div className="container mx-auto px-4 py-16 md:py-20">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">
                            Welcome to ECO HEART AI
                        </h2>
                        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700 mb-6">
                            Global Economic Analysis &amp; Scoring AI Model
                        </p>
                        <p className="text-slate-600 mb-4">
                            An innovative economic model qualitative and quantified AI assessment
                            and scoring application — the digital product that delivers the model
                            dashboard, web app, and AI assistant.
                        </p>
                        <p className="text-slate-600">
                            ECO HEART AI scores the dataset, visualizes comparisons, and generates
                            explanations of the global economic performance and positioning of
                            countries for real-time users — sovereign, commercial, and financial
                            institutions.
                        </p>
                    </div>
                </div>
            </section>

            {/* Pillars */}
            <section className="container mx-auto px-4 py-16 md:py-20">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">
                        The five HEART pillars
                    </h2>
                    <p className="text-slate-600">
                        HEART is a new economic concept, assessed as a HEART Score computed by
                        generative economic value indicators.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
                    {PILLARS.map((pillar) => (
                        <div
                            key={pillar.letter}
                            className="bg-white rounded-xl border border-slate-200 p-6"
                        >
                            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-lg mb-4">
                                {pillar.letter}
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">{pillar.title}</h3>
                            <p className="text-sm text-slate-600">{pillar.description}</p>
                        </div>
                    ))}
                </div>
                <div className="max-w-2xl mx-auto">
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                        {VALUE_PILLARS.map((item) => (
                            <li
                                key={item}
                                className="text-sm font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-3 text-center"
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                    <p className="text-slate-600 text-center">
                        HEART Score merges hard mathematical and statistically based coded models
                        to produce a new country ranking, applying AI as a way to analyze a
                        country&apos;s present economic performance.
                    </p>
                </div>
            </section>

            {/* Heart Ranking Economic Model / Introduction */}
            <section className="bg-slate-50 border-y border-slate-200">
                <div className="container mx-auto px-4 py-16 md:py-20">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">
                            Heart Ranking Economic Model
                        </h2>
                        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700 mb-6">
                            Introduction
                        </p>
                        <p className="text-slate-600 mb-4">
                            The author, Khurshid Imtiaz Haque, has created and developed an economic
                            model named the &ldquo;HEART SCORE&rdquo; Economic Model.
                        </p>
                        <p className="text-slate-600 mb-8">
                            The model presents a qualitative and quantitative approach that focuses
                            on fundamental factors influencing global economies — Housing &amp;
                            Health (H), Energy &amp; Education (E), Affordability (A), Rate (R),
                            and Trade (T). It is designed to be applicable to all economies,
                            whether developed, developing, or emerging, and aims to provide
                            practical solutions for economic stability and growth. By emphasizing
                            root causes of economic instability rather than just quantitative
                            indicators, it provides a more comprehensive and adaptable perspective
                            for policy-making and economic planning.
                        </p>

                        <h3 className="font-bold text-slate-900 mb-4">Heart overview:</h3>
                        <ul className="space-y-3 mb-8">
                            {HEART_OVERVIEW.map((item) => (
                                <li key={item.letter} className="flex gap-3 items-start">
                                    <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-md bg-indigo-600 text-white font-bold text-xs">
                                        {item.letter}
                                    </span>
                                    <span className="text-sm text-slate-600 pt-0.5">{item.text}</span>
                                </li>
                            ))}
                        </ul>

                        <a
                            href="#contact"
                            className="inline-block text-indigo-700 font-semibold hover:underline"
                        >
                            Learn More &rarr;
                        </a>
                    </div>
                </div>
            </section>

            {/* Conclusion */}
            <section className="container mx-auto px-4 py-16 md:py-20">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">Conclusion</h2>
                    <p className="text-slate-600 mb-4">
                        The HEART Economic Model is an AI-integrated, innovative framework that
                        offers a holistic and interconnected view of the global economy. By
                        focusing on Housing, Energy, Affordability, Rate, and Trade — and
                        expanding to include Health and Education — the model provides a more
                        realistic, inclusive, and applicable alternative to traditional economic
                        models that often overlook socio-economic interdependencies.
                    </p>
                    <p className="text-slate-600">
                        The model&apos;s interdisciplinary approach makes it a powerful tool for
                        economists, analysts, and policymakers seeking to drive long-term
                        stability, resilience, and equitable growth. Its strength lies in
                        connecting economic indicators with quality-of-life outcomes, ensuring
                        that macroeconomic success does not come at the expense of human
                        development.
                    </p>
                </div>
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
                </div>
            </section>

            {/* Final CTA */}
            <section className="container mx-auto px-4 py-16 md:py-20 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                    Heart Score Economic Model
                </h2>
                <p className="text-slate-600 max-w-2xl mx-auto mb-10">
                    Addressing Housing, Health, Energy, Education, Affordability, Rate, and
                    Trade impacts.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/signup"
                        className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
                    >
                        Learn More
                    </Link>
                    <a
                        href="mailto:info@ecoheartai.com"
                        className="w-full sm:w-auto px-8 py-3.5 border border-slate-300 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 font-semibold rounded-lg transition-colors"
                    >
                        Contact Us Now
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" className="border-t border-slate-200">
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-2xl mx-auto text-center">
                        <span className="text-xl font-black text-indigo-700">HEART</span>
                        <p className="text-sm text-slate-600 mt-4">
                            ECO HEART AI is an innovative artificial intelligence global economic
                            performance and ranking platform designed to analyze global economic
                            performance and provide structured economic rankings.
                        </p>
                        <nav className="flex items-center justify-center gap-6 text-sm font-semibold text-slate-600 mt-6">
                            <Link href="/" className="hover:text-indigo-700 transition-colors">
                                Home
                            </Link>
                            <a href="#about" className="hover:text-indigo-700 transition-colors">
                                About Us
                            </a>
                            <a href="#contact" className="hover:text-indigo-700 transition-colors">
                                Contact Us
                            </a>
                        </nav>
                        <p className="text-sm text-slate-500 mt-6">
                            Email:{" "}
                            <a
                                href="mailto:info@ecoheartai.com"
                                className="text-indigo-700 hover:underline"
                            >
                                info@ecoheartai.com
                            </a>
                        </p>
                    </div>
                </div>
                <div className="border-t border-slate-200">
                    <div className="container mx-auto px-4 py-6 text-center">
                        <p className="text-sm text-slate-500">
                            Developed by Khurshid Imtiaz Ul Haque
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            © 2026 ECO HEART AI | All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
