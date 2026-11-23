import Link from "next/link";
import { BRAND, CONTACT, FOUNDER, LEGAL } from "@/lib/brand";

function LinkedInIcon({ className = "h-4 w-4" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
        </svg>
    );
}

export { LinkedInIcon };

/** Legal line used on every page (landing, app pages, auth pages). */
export function LegalNotice({ dark = false }: { dark?: boolean }) {
    return (
        <div className={`text-center text-xs leading-relaxed ${dark ? "text-brand-100/80" : "text-slate-500"}`}>
            <p>&copy; {LEGAL.copyright}</p>
            <p className="mt-1">
                Official IP Registration Number:{" "}
                <span className={`font-semibold ${dark ? "text-white" : "text-slate-700"}`}>
                    {LEGAL.ipRegistrationNumber}
                </span>
            </p>
        </div>
    );
}

/** Full footer for the public homepage. */
export default function SiteFooter() {
    return (
        <footer id="contact-footer" className="bg-brand-900 text-white">
            <div className="container mx-auto px-4 py-14">
                <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr] items-start">
                    <div>
                        <div className="flex items-center gap-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={BRAND.emblem} alt={BRAND.fullName} className="h-16 w-16 rounded-2xl ring-1 ring-white/20" />
                            <div>
                                <p className="font-bold text-lg leading-tight">{BRAND.name}</p>
                                <p className="text-sm text-brand-200">{BRAND.shortTag}</p>
                            </div>
                        </div>
                        <p className="mt-6 text-xl font-semibold italic text-white/95">&ldquo;{BRAND.motto}&rdquo;</p>
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">Explore</p>
                        <nav className="mt-4 flex flex-col gap-2 text-sm text-white/85">
                            <a href="#about" className="hover:text-white">The Model</a>
                            <a href="#founder" className="hover:text-white">Founder &amp; Chief Economist</a>
                            <a href="#publications" className="hover:text-white">Research &amp; Publications</a>
                            <a href="#membership" className="hover:text-white">Member Registration</a>
                            <Link href="/login" className="hover:text-white">Member sign in</Link>
                        </nav>
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">Contact</p>
                        <div className="mt-4 space-y-3 text-sm text-white/85">
                            <p>
                                <span className="block text-white font-semibold">Institutional inquiries</span>
                                <a href={FOUNDER.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white">
                                    <LinkedInIcon /> LinkedIn Direct Message
                                </a>
                            </p>
                            <p>
                                <span className="block text-white font-semibold">General inquiries</span>
                                <a href={`mailto:${CONTACT.generalEmail}`} className="hover:text-white">{CONTACT.generalEmail}</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t border-white/10">
                <div className="container mx-auto px-4 py-6">
                    <LegalNotice dark />
                </div>
            </div>
        </footer>
    );
}

/** Slim footer for signed-in app pages. */
export function AppFooter() {
    return (
        <footer className="border-t border-slate-200 bg-white/70 mt-10">
            <div className="container mx-auto px-4 py-6 space-y-2">
                <p className="text-center text-sm italic text-slate-600">&ldquo;{BRAND.motto}&rdquo;</p>
                <LegalNotice />
            </div>
        </footer>
    );
}
