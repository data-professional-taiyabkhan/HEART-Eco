import Link from "next/link";
import SiteFooter, { LinkedInIcon } from "@/components/SiteFooter";
import { BRAND, CONTACT, FOUNDER } from "@/lib/brand";

const PILLARS = [
    { letter: "H", title: "Housing & Health", description: "Social infrastructure and well-being: housing availability and healthcare investment." },
    { letter: "E", title: "Energy & Education", description: "Resources and human capital: energy production and use, education outcomes and expenditure." },
    { letter: "A", title: "Affordability", description: "Household purchasing power and the cost of living: income levels, inequality and prices." },
    { letter: "R", title: "Rate", description: "Macroeconomic stability: interest rates, inflation, debt and growth." },
    { letter: "T", title: "Trade", description: "Trade competitiveness: trade balance, tariffs, taxes and global integration." },
];

const FRAMEWORKS = [
    {
        title: "HEART Score Economic Model",
        tag: "Proprietary · Closed-source",
        description: "Country resilience and affordability index, ranking the G-20+3 economies on economic resilience and household affordability.",
    },
    {
        title: "HEART Equity Quality & Price Valuation Framework",
        tag: "Open-source",
        description: "Five-layer equity assessment: US Macro, USC Geopolitics, Sector Alignment, Industry Dynamics and Company Performance.",
    },
    {
        title: "HEART USC Economic Doctrine",
        tag: "Doctrine",
        description: "Positions the United States and China as the System Leaders whose choices shape global trade, capital flows and technology.",
    },
];

// Recent publications on LinkedIn. The curated flagship list from the founder will replace these.
const PUBLICATIONS = [
    { type: "Global Ranking", title: "Launch and Release of the HEART Score Economic Model: Country Global Ranking 2025 and 2026 Outlook" },
    { type: "Market Commentary", title: "November 5, 2026 Market Shock: US$2.5 Trillion Wiped Out – How HEART Identified NVIDIA’s Geopolitical Risk Months Earlier" },
    { type: "Equity Valuation", title: "Anthropic’s $1.4 Trillion IPO: How the HEART Equity Quality Price Valuation Framework Prices Geopolitical Risk" },
    { type: "Doctrine Essay", title: "From Roxas Boulevard, Manila to the “Big Two”: How a 1989 ADB Library Moment Became the HEART USC Economic Doctrine" },
    { type: "Equity Valuation", title: "HEART Equity Framework – Repricing Apple (AAPL) in Five Layers" },
    { type: "Country Reports", title: "Six deep-dive HEART Country Reports: USA, China, India, Saudi Arabia, Germany and Canada" },
];

const MEMBER_ACCESS = [
    { title: "HEART-AI Assistant", description: "Ask questions on HEART scores, rankings and forecasts, with a capped daily query allowance." },
    { title: "Country Dashboard", description: "HEART Scores, resilience and affordability rankings for every country in the model." },
    { title: "Country Comparison", description: "Compare two economies side by side across the HEART pillars." },
    { title: "Rankings by Year", description: "Historical rankings and the model’s forecast outlook." },
];

const FOUNDER_HIGHLIGHTS = [
    "27+ years in commercial and investment banking",
    "Nearly a decade at Emirates NBD, Dubai",
    "Credit & risk, loan syndication and structured finance",
    "MBA (Manila); Graduate Diploma in Business Management (Canada)",
    "3+ years teaching Business Management in Canada",
    "Author of six deep-dive HEART Country Reports",
];

const LINKEDIN_ACTIVITY = `${FOUNDER.linkedin}/recent-activity/all/`;

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900">
            {/* Header */}
            <header className="border-b border-slate-200 sticky top-0 z-30 bg-white/90 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-3 min-w-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={BRAND.emblem} alt={BRAND.fullName} className="h-11 w-11 rounded-xl shrink-0" />
                        <span className="leading-tight hidden sm:block">
                            <span className="block font-bold text-brand-800 text-sm md:text-base">{BRAND.name}</span>
                            <span className="block text-xs text-slate-500">{BRAND.shortTag}</span>
                        </span>
                    </Link>
                    <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
                        <a href="#about" className="hover:text-brand-700 transition-colors">The Model</a>
                        <a href="#founder" className="hover:text-brand-700 transition-colors">Founder</a>
                        <a href="#publications" className="hover:text-brand-700 transition-colors">Publications</a>
                        <a href="#contact" className="hover:text-brand-700 transition-colors">Contact</a>
                    </nav>
                    <div className="flex items-center gap-2 shrink-0">
                        <Link href="/login" className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-brand-700 transition-colors">
                            Member sign in
                        </Link>
                        <Link href="/signup" className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors">
                            Member Registration
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 to-white">
                <div className="container mx-auto px-4 py-16 md:py-20">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="text-center md:text-left">
                            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-brand-700 bg-white border border-brand-100 rounded-full px-3 py-1 mb-6">
                                Proprietary IP &middot; Registered with the Government of Canada
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-brand-900">
                                {BRAND.name}
                            </h1>
                            <p className="mt-2 text-xl md:text-2xl font-semibold text-brand-600">{BRAND.shortTag}</p>
                            <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto md:mx-0">
                                A human-centred country index that ranks the G-20+3 economies on two lenses at once:
                                economic resilience and household affordability.
                            </p>
                            <blockquote className="mt-8 border-l-4 border-brand-500 pl-4 text-left max-w-xl mx-auto md:mx-0">
                                <p className="text-xl md:text-2xl font-semibold italic text-brand-800">&ldquo;{BRAND.motto}&rdquo;</p>
                            </blockquote>
                            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                                <Link href="/signup" className="w-full sm:w-auto px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition-colors shadow-sm">
                                    Member Registration
                                </Link>
                                <a href="#about" className="w-full sm:w-auto px-8 py-3.5 border border-slate-300 hover:border-brand-300 hover:bg-brand-50 text-slate-700 font-semibold rounded-lg transition-colors">
                                    Explore the Model
                                </a>
                            </div>
                        </div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={BRAND.pyramid}
                            alt="HEART Five-Pillar Pyramid: Housing-Health, Energy-Education, Affordability, Rate, Trade"
                            className="w-full max-w-md mx-auto h-auto rounded-2xl shadow-xl shadow-brand-900/10"
                        />
                    </div>
                </div>
            </section>

            {/* The Model */}
            <section id="about" className="container mx-auto px-4 py-16 md:py-20 scroll-mt-20">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 mb-3">The Model</p>
                    <h2 className="text-2xl md:text-4xl font-bold text-brand-900">Five pillars. Two lenses.</h2>
                    <p className="mt-4 text-slate-600">
                        HEART starts with household affordability and works up to the macro picture. Each economy is assessed
                        on its economic resilience and on how that performance lands in people&apos;s lives, across five pillars
                        that apply equally to developed, developing and emerging economies.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {PILLARS.map((pillar) => (
                        <div key={pillar.letter} className="bg-white rounded-xl border border-slate-200 p-6 hover:border-brand-200 hover:shadow-md transition">
                            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-lg mb-4">
                                {pillar.letter}
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">{pillar.title}</h3>
                            <p className="text-sm text-slate-600">{pillar.description}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-14 grid gap-4 md:grid-cols-3">
                    {FRAMEWORKS.map((f) => (
                        <div key={f.title} className="rounded-2xl bg-slate-50 border border-slate-200 p-6">
                            <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">{f.tag}</span>
                            <h3 className="mt-2 font-bold text-slate-900">{f.title}</h3>
                            <p className="mt-2 text-sm text-slate-600">{f.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Founder & Chief Economist */}
            <section id="founder" className="bg-slate-50 border-y border-slate-200 scroll-mt-20">
                <div className="container mx-auto px-4 py-16 md:py-20">
                    <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 items-start">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 mb-3">Founder &amp; Chief Economist</p>
                            <h2 className="text-3xl md:text-4xl font-bold text-brand-900">{FOUNDER.name}</h2>
                            <p className="mt-3 text-base font-semibold text-brand-700">{FOUNDER.title}</p>
                            <p className="mt-6 text-slate-600">
                                {FOUNDER.name} is the creator, owner and author of the HEART Score Economic Model. A
                                practitioner-scholar, he brings more than 27 years of commercial and investment banking
                                experience to the study of economic resilience, shocks and affordability.
                            </p>
                            <ul className="mt-6 grid sm:grid-cols-2 gap-3">
                                {FOUNDER_HIGHLIGHTS.map((h) => (
                                    <li key={h} className="flex gap-3 items-start text-sm text-slate-700">
                                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                                        <span>{h}</span>
                                    </li>
                                ))}
                            </ul>
                            <a
                                href={FOUNDER.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold transition-colors"
                            >
                                <LinkedInIcon className="h-5 w-5" /> Follow on LinkedIn
                            </a>
                        </div>
                        <a href={BRAND.founderBio} target="_blank" rel="noopener noreferrer" className="block group" title="Open the full biography">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={BRAND.founderBio}
                                alt={`Executive biography of ${FOUNDER.name}`}
                                className="w-full max-w-lg mx-auto h-auto rounded-2xl shadow-xl shadow-brand-900/15 ring-1 ring-slate-200 group-hover:shadow-2xl transition"
                            />
                            <span className="block text-center text-xs text-slate-500 mt-3">Click to view full size</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* Research & Publications */}
            <section id="publications" className="container mx-auto px-4 py-16 md:py-20 scroll-mt-20">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
                    <div className="max-w-2xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 mb-3">Research &amp; Publications</p>
                        <h2 className="text-2xl md:text-4xl font-bold text-brand-900">125+ institutional deliverables</h2>
                        <p className="mt-4 text-slate-600">
                            Deep-dive country reports, research monographs and market commentaries, published on LinkedIn.
                        </p>
                    </div>
                    <a
                        href={LINKEDIN_ACTIVITY}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 self-start md:self-auto px-5 py-3 rounded-lg border border-slate-300 hover:border-brand-300 hover:bg-brand-50 text-slate-700 font-semibold transition-colors"
                    >
                        <LinkedInIcon className="h-4 w-4 text-[#0A66C2]" /> View all on LinkedIn
                    </a>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {PUBLICATIONS.map((p) => (
                        <a
                            key={p.title}
                            href={LINKEDIN_ACTIVITY}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 hover:border-brand-300 hover:shadow-lg transition"
                        >
                            <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">{p.type}</span>
                            <h3 className="mt-3 font-semibold text-slate-900 leading-snug group-hover:text-brand-700">{p.title}</h3>
                            <span className="mt-auto pt-6 text-sm font-semibold text-brand-600">Read on LinkedIn &rarr;</span>
                        </a>
                    ))}
                </div>
            </section>

            {/* Freemium Member Registration */}
            <section id="membership" className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white scroll-mt-20">
                <div className="container mx-auto px-4 py-16 md:py-20">
                    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-200 mb-3">Freemium Member Registration</p>
                            <h2 className="text-3xl md:text-4xl font-bold">Complimentary access for registered members</h2>
                            <p className="mt-4 text-brand-50/90">
                                Register to explore HEART Scores and rankings and to put questions to the HEART-AI Assistant.
                                The HEART methodology is proprietary and closed-source: members see scores, grades and rankings,
                                not the model behind them.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <Link href="/signup" className="px-8 py-3.5 bg-white text-brand-800 hover:bg-brand-50 font-semibold rounded-lg text-center transition-colors">
                                    Register as a Member
                                </Link>
                                <Link href="/login" className="px-8 py-3.5 border border-white/40 hover:bg-white/10 font-semibold rounded-lg text-center transition-colors">
                                    Member sign in
                                </Link>
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {MEMBER_ACCESS.map((m) => (
                                <div key={m.title} className="rounded-2xl bg-white/10 border border-white/15 p-6 backdrop-blur">
                                    <h3 className="font-bold">{m.title}</h3>
                                    <p className="mt-2 text-sm text-brand-50/85">{m.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Two-tier contact */}
            <section id="contact" className="container mx-auto px-4 py-16 md:py-20 scroll-mt-20">
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 mb-3">Contact</p>
                    <h2 className="text-2xl md:text-4xl font-bold text-brand-900">How to reach us</h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
                    <div className="rounded-2xl border border-slate-200 p-8 flex flex-col">
                        <h3 className="text-lg font-bold text-slate-900">Institutional Collaboration, Licensing &amp; Acquisition</h3>
                        <p className="mt-3 text-sm text-slate-600">
                            For banks, asset managers, sovereign funds and institutional partners. Please contact the Founder
                            directly by LinkedIn Direct Message.
                        </p>
                        <a
                            href={FOUNDER.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-auto pt-6 inline-flex"
                        >
                            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold transition-colors">
                                <LinkedInIcon className="h-5 w-5" /> Message on LinkedIn
                            </span>
                        </a>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-8 flex flex-col">
                        <h3 className="text-lg font-bold text-slate-900">All Other General Inquiries</h3>
                        <p className="mt-3 text-sm text-slate-600">
                            For member support, media and every other question, email us and we will respond.
                        </p>
                        <a href={`mailto:${CONTACT.generalEmail}`} className="mt-auto pt-6 inline-flex">
                            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-colors">
                                {CONTACT.generalEmail}
                            </span>
                        </a>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </div>
    );
}
