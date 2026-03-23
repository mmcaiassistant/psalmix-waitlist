"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import React from "react";
import { CustomIcon as CustomIconComponent } from "@/components/CustomIcon";
type AnyCustomIcon = React.ComponentType<{ name: string; size?: number }>;
const CustomIcon = CustomIconComponent as AnyCustomIcon;
import { HeroSection } from "@/components/sections/HeroSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { ComparisonSection } from "@/components/sections/ComparisonSection";
import { GuaranteeSection } from "@/components/sections/GuaranteeSection";
import { CTASection } from "@/components/sections/CTASection";

/**
 * Psalmix Waitlist Landing Page
 * Design: Purple (#7c3aed) + Cream color scheme
 */

// Lucide-style Icon Components (consistent 24x24, strokeWidth 2)
const Icons = {
  mail: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="16" x="2" y="4" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  ),
  sparkles: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  ),
  checkCircle: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
    </svg>
  ),
  shieldCheck: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  ),
  users: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
};

function SignupForm({
  variant = "hero",
}: {
  variant?: "hero" | "footer";
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [alreadyOnList, setAlreadyOnList] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setAlreadyOnList(!!data.already);
      setStatus("success");
      setEmail("");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Unable to join right now.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-surface border border-white/10 p-6 text-center max-w-md shadow-xl">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
          <Icons.checkCircle className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          {alreadyOnList ? "You're already on the list!" : "You're in!"}
        </h3>
        <p className="text-text-secondary text-sm">
          We&apos;ll send you an email when beta opens on April 15.
        </p>
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <form onSubmit={handleSubmit} className="max-w-md mx-auto" id="signup">
        <div className="p-2 bg-surface rounded-2xl shadow-xl border border-white/10 flex flex-col gap-2">
          <div className="flex items-center px-4 py-2">
            <Icons.mail className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // On mobile, scrollIntoView ensures the submit button stays visible when the keyboard opens
              onFocus={(e) => {
                setTimeout(() => e.target.scrollIntoView({ behavior: "smooth", block: "center" }), 300);
              }}
              className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder:text-slate-400 text-base"
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-70 animate-pulse-subtle shadow-lg shadow-primary/30"
          >
            {status === "loading" ? "Saving your spot..." : "Save My Spot — It's Free"}
          </button>
        </div>
        {status === "error" && errorMessage && (
          <p className="text-red-500 text-sm mt-2 text-center">{errorMessage}</p>
        )}
        <p className="text-xs text-text-secondary mt-3 text-center flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          No credit card. No catch. Takes 30 seconds.
        </p>
      </form>
    );
  }

  // Footer variant — card-style layout matching the hero
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto" id="signup-footer">
      <div className="p-2 bg-white/10 rounded-2xl shadow-xl border border-white/20 flex flex-col gap-2">
        <div className="flex items-center px-4 py-2">
          <Icons.mail className="w-5 h-5 text-white/60 mr-3 flex-shrink-0" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder:text-white/60 text-base"
            placeholder="Enter your email"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-white/90 transition-all disabled:opacity-70 shadow-lg"
        >
          {status === "loading" ? "Saving your spot..." : "Save My Spot — It's Free"}
        </button>
      </div>
      {status === "error" && errorMessage && (
        <p className="text-red-300 text-sm mt-2 text-center">{errorMessage}</p>
      )}
      <p className="text-xs text-white/60 mt-3 text-center">Free to join · $7.99/mo at launch · Cancel anytime</p>
    </form>
  );
}

function FAQItem({ question, answer, defaultOpen = false }: { question: string; answer: string; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="group bg-surface rounded-2xl border border-white/10 overflow-hidden transition-all hover:border-white/20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left font-bold text-white"
      >
        <span>{question}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-64" : "max-h-0"}`}>
        <div className="px-6 pb-6 text-text-secondary text-sm">
          {answer}
        </div>
      </div>
    </div>
  );
}

function HomeInner() {
  const [count, setCount] = useState<number | null>(null);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const searchParams = useSearchParams();
  void searchParams; // referral feature removed — keeping hook for future use

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => setCount(d.total ?? 0))
      .catch(() => setCount(null));
  }, []);

  // Show sticky CTA after scrolling past hero
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCTA(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show real count only — no seeding with fake numbers
  const displayCount = count !== null ? Math.max(count, 1) : null;
  const foundingCount = displayCount !== null ? Math.min(displayCount, 500) : 0;
  const spotsRemaining = foundingCount > 0 ? Math.max(500 - foundingCount, 0) : 500;

  return (
    <div className="min-h-screen bg-background font-display text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center overflow-hidden">
              <CustomIcon name="musicNote" size={28} />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Psalmix</h2>
          </div>
          <nav className="hidden md:flex items-center gap-10">
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#problem">Problem</a>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#solution">Solution</a>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#founding">Founding</a>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#faq">FAQ</a>
          </nav>
          <a href="#signup" className="bg-primary text-white px-5 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform active:scale-95 min-h-[44px] flex items-center">
            Save My Spot
          </a>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <HeroSection
          displayCount={displayCount}
          SignupForm={SignupForm}
          Icons={Icons}
          CustomIcon={CustomIcon}
        />

        {/* Founder Story — shown early for credibility */}
        <section className="py-20 bg-background-elevated relative overflow-hidden">
          {/* ambient glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px]" />
          </div>
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row gap-14 items-center">

              {/* Photo column */}
              <div className="flex-shrink-0 flex flex-col items-center gap-4">
                {/* gradient ring */}
                <div className="p-[3px] rounded-full bg-gradient-to-br from-primary via-accent to-cyan-400 shadow-[0_0_40px_rgba(139,75,207,0.4)]">
                  <img
                    src="/images/mckinzie-headshot.jpg"
                    alt="McKinzie Bean"
                    className="w-48 h-48 rounded-full object-cover object-top"
                  />
                </div>
                <div className="text-center">
                  <p className="font-bold text-white text-base">McKinzie Bean</p>
                  <p className="text-xs text-text-secondary mt-0.5">Founder · Singer/songwriter · Mom of 3</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary/15 border border-primary/25 text-primary text-xs font-semibold"> Singer & songwriter</span>
                  <span className="px-3 py-1 rounded-full bg-primary/15 border border-primary/25 text-primary text-xs font-semibold">‍‍ Homeschool mom of 3</span>
                </div>
              </div>

              {/* Quote column */}
              <div className="flex-1">
                {/* big decorative quote mark */}
                <div className="text-[96px] leading-none font-serif text-primary/25 select-none mb-[-24px]">&ldquo;</div>
                <blockquote className="text-white text-xl leading-relaxed font-medium mb-5">
                  The turning point was realizing I couldn&apos;t keep reacting. I&apos;d hear something on the radio or catch a lyric on Spotify and think — how long has my kid been singing along to that?
                </blockquote>
                <p className="text-white/80 text-base leading-relaxed mb-6">
                  I&apos;m a singer and songwriter — I know how deeply music shapes the way we see the world. As a homeschool mom juggling a preteen, an elementary-aged child, and a toddler, I couldn&apos;t keep reacting. So I built the thing I couldn&apos;t find anywhere else: music my kids actually love, with zero surprises. That&apos;s Psalmix.
                </p>
                <div className="flex items-start gap-3 bg-primary/8 border border-primary/20 rounded-2xl px-5 py-4">
                  <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Every song and cover image is reviewed by McKinzie and our team of Christian musicians and educators before it reaches your family. Not an algorithm — real people who care.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Problem Section */}
        <ProblemSection />

        {/* Solution + Comparison Sections */}
        <ComparisonSection Icons={Icons} CustomIcon={CustomIcon} />

        {/* Founding Families Section */}
        <section className="py-20 bg-background-elevated" id="founding">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-gradient-to-br from-slate-900 to-[#251b36] rounded-3xl p-8 md:p-16 text-white overflow-hidden relative">
              <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-bold mb-6">Be a Founding Family</h2>
                  <p className="text-slate-300 mb-4 text-lg">
                    <strong className="text-primary text-xl">Beta is FREE</strong> — no credit card, no risk.
                  </p>
                  <p className="text-slate-300 mb-8">
                    Beta opens <strong className="text-white">April 15</strong> — and we&apos;re saving the first 500 spots for families who get in early. Founding members lock in the launch rate forever — no price increases, ever.
                  </p>
                  <div className="mb-10">
                    {foundingCount >= 50 ? (
                      <>
                        <div className="flex justify-between mb-3 text-sm font-bold uppercase tracking-wider">
                          <span>{foundingCount} Spots Claimed</span>
                          <span>500 Total Spots</span>
                        </div>
                        <div className="w-full h-4 bg-surface/10 rounded-full overflow-hidden border border-white/10">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-primary/80 shadow-[0_0_20px_rgba(124,59,237,0.5)]"
                            style={{ width: `${Math.min((foundingCount / 500) * 100, 100)}%` }}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between mb-3 text-sm font-bold uppercase tracking-wider">
                          <span>500 Founding Spots Available</span>
                          <span>First come, first served</span>
                        </div>
                        <p className="text-sm text-slate-400 mt-2">Be one of the very first founding families.</p>
                      </>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {[
                      { perk: "Free beta access starting April 15", value: "Exclusive" },
                      { perk: "Founding Family badge in the app", value: "Exclusive" },
                      { perk: "Direct line to McKinzie for feedback", value: "Priceless" },
                      { perk: "First access to new features", value: "VIP" },
                      { perk: "Shape the app from day one", value: "Rare" },
                    ].map((item) => (
                      <div key={item.perk} className="flex items-center gap-3">
                        <Icons.checkCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>{item.perk}</span>
                        <span className="text-xs text-primary/70 ml-auto">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/10 text-center">
                    <p className="text-sm text-slate-400">At launch: <span className="text-white font-bold">$7.99/mo or $59.99/year</span></p>
                  </div>
                </div>
                {/* FOUNDING FAMILIES: replaced right card */}
                <div className="bg-surface/5 backdrop-blur-md rounded-2xl p-8 border border-primary/30 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                    Founding Family Status
                  </div>
                  <h3 className="text-2xl font-bold mb-2">What you&apos;re locking in</h3>
                  <p className="text-slate-400 text-sm mb-6">Reserved for the first 500 families only.</p>
                  <ul className="space-y-3 text-left mb-8">
                    {["Free beta access starting April 15", "Launch-day pricing, locked forever", "Direct feedback line to McKinzie", "First access to every new feature", "Founding Family badge in-app"].map(perk => (
                      <li key={perk} className="flex items-center gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m9 12 2 2 4-4"/></svg>
                        </div>
                        <span className="text-white">{perk}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="#signup" className="w-full inline-flex justify-center py-4 bg-primary rounded-xl font-bold hover:bg-primary/90 transition-all">
                    Save My Spot — It&apos;s Free
                  </a>
                </div>
              </div>
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle at 70% 30%, #7c3aed 0%, transparent 50%)" }} />
            </div>
          </div>
        </section>

        {/* Guarantee Section */}
        <GuaranteeSection />

        {/* FAQ Section */}
        <section className="py-24 bg-background" id="faq">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12">Questions? We&apos;ve Got Answers.</h2>
            <div className="space-y-4">
              <FAQItem
                question="When does Psalmix launch?"
                answer="Beta opens April 15, 2026. Join the waitlist now to lock in your spot — Founding Families (first 500) get free beta access before anyone else."
                defaultOpen
              />
              <FAQItem
                question="How much does it cost?"
                answer="$7.99/month or $59.99/year for a family plan (up to 5 members). Beta access is FREE — no credit card required."
              />
              {/* FAQ: updated answer for "Will my kids actually like the music?" */}
              <FAQItem
                question="Will my kids actually like the music?"
                answer="Real talk: they won't find Taylor Swift or Olivia Rodrigo here. What they will find is fresh, current-sounding music across every genre they already love — pop, hip-hop, country, R&B — crafted to sound like the music kids gravitate toward today. Just without the content you'd have to skip. Most families are surprised how quickly their kids stop asking for the old stuff."
              />
              <FAQItem
                question="Is it only Christian music?"
                answer="Not at all. Psalmix is for every family, not just faith-based ones. Every song is an original, exclusive track across all genres. The common thread isn't genre or religion — it's that every song was created clean and verified by a real human before it ever reaches your family."
              />
              <FAQItem
                question="How do you know the music is actually safe?"
                answer="Every song and every cover image is reviewed by McKinzie and our team before it goes live — not an algorithm, not a content policy checkbox. Real people who genuinely care what kids hear. We don't filter mainstream music. We start clean."
              />
              <FAQItem
                question="What devices does it work on?"
                answer="Psalmix will be available on iOS, Android, and web. Family members can stream on up to 3 devices simultaneously."
              />
              <FAQItem
                question="Can I cancel anytime?"
                answer="Absolutely! Cancel with one click, no questions asked. We don&apos;t do sneaky retention tactics or make you call a phone number. If Psalmix isn&apos;t for you, canceling takes 10 seconds."
              />
              <FAQItem
                question="Is my data secure?"
                answer="100%. We take privacy seriously — your email is only used to keep you updated on Psalmix beta access and launch news. We never sell or share your info."
              />
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <CTASection
          spotsRemaining={spotsRemaining}
          SignupForm={SignupForm}
        />
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-background">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6 md:flex-row md:justify-between md:gap-8 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center overflow-hidden">
              <CustomIcon name="musicNote" size={22} />
            </div>
            <div>
              {/* FOOTER: fixed "Psalmix" → "Psalmix" */}
              <h2 className="text-lg font-bold tracking-tight">Psalmix</h2>
              <p className="text-xs text-text-secondary">Built by McKinzie Bean · Mom of 3 · Singer & songwriter</p>
            </div>
          </div>
          <div className="flex gap-8 text-sm font-medium text-text-secondary">
            <a className="hover:text-primary transition-colors" href="mailto:hello@psalmix.com">Contact</a>
            {/* FOOTER: added Privacy Policy link */}
            <a className="hover:text-primary transition-colors" href="/privacy">Privacy Policy</a>
          </div>
          {/* FOOTER: fixed copyright "Psalmix" → "Psalmix" */}
          <p className="text-sm text-slate-400">© 2026 Psalmix. All rights reserved.</p>
        </div>
      </footer>

      {/* Sticky CTA - appears when scrolling */}
      <div 
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          showStickyCTA ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <a
          href="#signup"
          className="flex items-center gap-3 bg-primary text-white px-6 py-4 rounded-full font-bold shadow-2xl shadow-primary/30 hover:scale-105 transition-transform active:scale-95 animate-pulse-subtle"
        >
          <Icons.sparkles className="w-5 h-5" />
          <span>Save My Spot — It&apos;s Free</span>
          {spotsRemaining < 500 && (
            <span className="text-white/70 text-sm">• {spotsRemaining} spots left</span>
          )}
        </a>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <HomeInner />
    </Suspense>
  );
}
