"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CustomIcon } from "@/components/CustomIcon";

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
  referralCode,
}: {
  variant?: "hero" | "footer";
  referralCode?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<{ position?: number; referralCode?: string; message?: string } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setResult(null);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, referralCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setStatus("success");
      setResult({
        position: data.position,
        referralCode: data.referralCode,
        message: data.already ? "You're already on the list!" : "You're in!",
      });
      setEmail("");

      if (data.referralCode) {
        router.push(`/dashboard/${data.referralCode}`);
      }
    } catch (err: unknown) {
      setStatus("error");
      const message = err instanceof Error ? err.message : "Unable to join right now.";
      setResult({ message });
    }
  };

  if (status === "success" && result) {
    return (
      <div className="rounded-2xl bg-surface border border-white/10 p-6 text-center max-w-md shadow-xl">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <Icons.checkCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{result.message}</h3>
        <p className="text-text-secondary mb-4">
          Your position: <span className="text-primary font-bold">#{result.position?.toLocaleString()}</span>
        </p>
        <p className="text-sm text-text-secondary">Redirecting to your dashboard…</p>
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
        {status === "error" && result?.message && (
          <p className="text-red-500 text-sm mt-2 text-center">{result.message}</p>
        )}
        {referralCode && (
          <p className="text-xs text-text-secondary mt-3 text-center">
            You were referred by a friend — you&apos;ll both move up the line.
          </p>
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
      {status === "error" && result?.message && (
        <p className="text-red-300 text-sm mt-2 text-center">{result.message}</p>
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
  const referralCode = searchParams.get("ref") ?? undefined;

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
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#referrals">Referrals</a>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#faq">FAQ</a>
          </nav>
          <a href="#signup" className="bg-primary text-white px-5 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform active:scale-95 min-h-[44px] flex items-center">
            Save My Spot
          </a>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            {/* HERO: pill badge with more horizontal padding */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8">
              <Icons.sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Free Beta Starts April 15 — 500 spots only</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-6 max-w-4xl mx-auto">
              Family-Safe Music. <span className="text-primary">Finally.</span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
              Every song human-verified. Every genre covered. So you can just&hellip; press play.
            </p>
            <SignupForm variant="hero" referralCode={referralCode} />

            {/* Counter — only show when we have 50+ real signups */}
            {displayCount !== null && displayCount >= 50 && (
              <div className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-surface/50 border border-primary/30 shadow-[0_0_20px_rgba(124,59,237,0.2)]">
                <Icons.users className="w-5 h-5 text-primary" />
                <span className="text-white font-bold">{displayCount.toLocaleString()} {displayCount === 1 ? "family" : "families"}</span>
                <span className="text-text-secondary">already on the waitlist</span>
              </div>
            )}
            {/* HERO: simplified fallback badge — no redundancy with top pill */}
            {(displayCount === null || displayCount < 50) && (
              <div className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-surface/50 border border-primary/30">
                <Icons.sparkles className="w-5 h-5 text-primary" />
                <span className="text-white font-bold">Beta opens April 15 · First 500 families get founding perks</span>
              </div>
            )}

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap justify-center items-center gap-6 md:gap-8 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                <span>iOS</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.226a.75.75 0 0 0-1.046 0l-3.796 3.97-1.927-2.014a.75.75 0 0 0-1.085 0l-6.87 7.18a.75.75 0 0 0 0 1.035l1.927 2.014L.93 18.382a.75.75 0 0 0 0 1.035l3.796 3.97a.75.75 0 0 0 1.085 0l3.796-3.97 1.927 2.014a.75.75 0 0 0 1.085 0l6.87-7.18a.75.75 0 0 0 0-1.035l-1.927-2.014 3.796-3.97a.75.75 0 0 0 0-1.035l-3.835-4.007z"/></svg>
                <span>Android</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <span>Web</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span>Secure</span>
              </div>
            </div>
          </div>
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        </section>

        {/* Founder Story — shown early for credibility */}
        <section className="py-16 bg-background-elevated">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-surface rounded-3xl p-8 md:p-12 border border-primary/20 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-shrink-0 flex flex-col items-center gap-2">
                  <img src="/images/mckinzie-headshot.jpg" alt="McKinzie Bean" className="w-20 h-20 rounded-full object-cover shadow-lg" />
                  <p className="text-sm font-bold text-white text-center">McKinzie</p>
                  <p className="text-xs text-text-secondary text-center">Founder, singer/songwriter &amp; mom of 3</p>
                </div>
                <div>
                  {/* FOUNDER STORY: trimmed to 2 paragraphs */}
                  <p className="text-white text-lg leading-relaxed mb-4">
                    &ldquo;The turning point was realizing I couldn&apos;t keep reacting. I&apos;d hear something on the radio or catch a lyric on Spotify and think — how long has my kid been singing along to that?
                  </p>
                  <p className="text-white text-lg leading-relaxed mb-4">
                    I&apos;m a singer and songwriter — I know how deeply music shapes the way we see the world. As a homeschool mom juggling a preteen, an elementary-aged child, and a toddler, I couldn&apos;t keep reacting. So I built the thing I couldn&apos;t find anywhere else: music my kids actually love, with zero surprises. That&apos;s Psalmix.&rdquo;
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Every song and every cover image is reviewed by McKinzie and our team of Christian musicians and educators before it ever reaches your family. Not an algorithm — real people who care.
                  </p>
                  <div className="mt-6 pt-6 border-t border-white/10">
                    {/* FOUNDER STORY: removed "Built for families like yours" chip */}
                    <div className="flex flex-wrap gap-3">
                      <span className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">Singer &amp; songwriter</span>
                      <span className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">Homeschool mom of 3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-24 bg-background" id="problem">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-4xl font-bold mb-4">Tired of Hovering Over Skip?</h2>
              <p className="text-lg text-text-secondary">
                Spotify&apos;s clean filter only catches labeled profanity. It doesn&apos;t catch the rest.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Sexual themes and innuendo", sub: "Slips through 'clean' filters constantly — labeled versions still contain it." },
                { title: "Drug glorification", sub: "Presented as normal and aspirational in songs your kids are requesting by name." },
                { title: "Violence and dark imagery", sub: "Common in rap and pop — including songs explicitly marketed to teens." },
                { title: "Explicit album art", sub: "Your child sees it the moment they tap on any playlist." },
                { title: "Podcasts with adult content", sub: "The same app that plays music also surfaces adult podcasts — no separation." },
                { title: 'Songs in "Kids" playlists that aren\'t for kids', sub: "Spotify's algorithm doesn't know your family's values." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 bg-surface rounded-2xl p-6 border border-white/10 shadow-sm">
                  {/* PROBLEM: proper inline SVG X icon */}
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-sm text-text-secondary">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-text-secondary">
              <strong>More than half of Billboard&apos;s top 100 songs contain content not safe for kids</strong> — and most of it slips right through Spotify&apos;s filter undetected. You deserve better.
            </p>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-24 bg-background-elevated" id="solution">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Every Song. Verified Safe.</h2>
              <p className="text-text-secondary max-w-2xl mx-auto">
                Every song in Psalmix is an original track — created clean from the ground up, exclusive to our platform. No filters. No edited radio hits. Music made right the first time.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { title: "All Genres", body: "Original pop, hip-hop, country, rock & R&B — created clean, exclusive to Psalmix.", icon: "musicNote" },
                { title: "Family Plan", body: "Up to 5 members, 3 simultaneous streams — one subscription for the whole family.", icon: "users" },
                { title: "Zero Surprises", body: "No filtered mainstream hits. No clean radio edits. Music created safe from the very first note.", icon: "shield" },
                { title: "Simple Pricing", body: "$7.99/mo or $59.99/year — less than half of Spotify Family", icon: "tag" },
              ].map((feature) => (
                <div key={feature.title} className="bg-primary/5 p-6 rounded-3xl border border-primary/10 text-center">
                  {/* SOLUTION: icon containers w-16 h-16 rounded-2xl */}
                  <div className="w-16 h-16 rounded-2xl bg-surface shadow-sm flex items-center justify-center mx-auto mb-5 overflow-hidden">
                    {feature.icon === "musicNote" && <CustomIcon name="musicNote" size={32} />}
                    {feature.icon === "users" && <Icons.users className="w-6 h-6 text-primary" />}
                    {feature.icon === "shield" && <Icons.shieldCheck className="w-6 h-6 text-primary" />}
                    {/* SOLUTION: tag icon replaced with inline SVG */}
                    {feature.icon === "tag" && (
                      <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0l7.41-7.41a1 1 0 0 0 0-1.41z"/><circle cx="7" cy="7" r="1.5" fill="currentColor"/></svg>
                    )}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-text-secondary">{feature.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-20 bg-background-elevated">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-4">See the Difference</h2>
            <p className="text-center text-text-secondary mb-10">Human-verified. Half the price. Complete peace of mind.</p>
            <div className="overflow-x-auto rounded-3xl border border-white/10 bg-surface shadow-sm">
              <table className="w-full min-w-[480px] text-left">
                <thead className="bg-surface-hover">
                  <tr className="text-sm uppercase tracking-wider text-text-secondary">
                    <th className="p-4 md:p-6"> </th>
                    <th className="p-4 md:p-6">Spotify Family</th>
                    <th className="p-4 md:p-6 bg-primary/10 border-l border-primary/20">
                      <span className="text-primary font-bold">Psalmix</span>
                      {/* COMPARISON: removed animate-pulse from badge */}
                      <span className="ml-2 text-sm bg-primary text-white px-3 py-1 rounded-full font-bold">✓ RECOMMENDED</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { label: "Price", spotify: "$19.99/mo", psalmix: "$7.99/mo", highlight: true },
                    { label: "Content Safety", spotify: "Labels only", psalmix: "Human-verified", highlight: false },
                    { label: "Content Library", spotify: "Mainstream (filtered)", psalmix: "Original, exclusive tracks", highlight: false },
                    { label: "Parental Dashboard", spotify: "No", psalmix: "Yes", highlight: false },
                    { label: "Human Review", spotify: "No", psalmix: "Every song & cover image", highlight: false },
                  ].map((row) => (
                    <tr key={row.label}>
                      <td className="p-4 md:p-6 font-semibold text-white">{row.label}</td>
                      <td className={`p-4 md:p-6 text-text-secondary ${row.highlight ? "line-through opacity-60" : ""}`}>{row.spotify}</td>
                      <td className={`p-4 md:p-6 bg-primary/5 border-l border-primary/20 ${row.highlight ? "text-2xl font-black text-primary" : "font-semibold text-primary"}`}>
                        {row.psalmix}
                        {row.highlight && <span className="ml-2 text-sm font-normal text-green-400">Save $12/mo!</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Founding Families Section */}
        <section className="py-20 bg-background-elevated" id="founding">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-gradient-to-br from-slate-900 to-[#251b36] rounded-3xl p-8 md:p-16 text-white overflow-hidden relative">
              <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-bold mb-6">Be a Founding Family</h2>
                  <p className="text-slate-300 mb-4 text-lg">
                    <strong className="text-primary text-xl">Beta is FREE 🎉</strong> — no credit card, no risk.
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
                        <p className="text-sm text-slate-400 mt-2">Be one of the very first founding families. 🎉</p>
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
                    ✦ Founding Family Status
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

        {/* Referral Section */}
        <section className="py-24 bg-background" id="referrals">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Share Psalmix, Get Rewarded</h2>
              <p className="text-text-secondary">Tell a friend about Psalmix. They&apos;ll thank you — and so will we.</p>
            </div>
            <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 items-start">
              <div className="rounded-3xl border border-white/10 bg-surface p-8 shadow-sm">
                {/* REFERRAL: extra line above tier grid */}
                <p className="text-sm text-text-secondary mb-4">The more friends you invite, the better the perks — for both of you.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                    <p className="font-bold text-primary">Each referral</p>
                    {/* REFERRAL: updated subtext */}
                    <p className="text-text-secondary">Move up the line — and your friend does too</p>
                  </div>
                  {[3, 10, 25, 50].map((tier) => (
                    <div key={tier} className={`rounded-2xl p-4 ${tier === 50 ? "border border-primary/30 bg-primary/5" : "border border-white/10"}`}>
                      <p className="text-xs uppercase tracking-wider text-text-secondary">{tier} referrals</p>
                      <p className="font-semibold text-white">
                        {tier === 3 && "Beta access (before launch)"}
                        {tier === 10 && "Founding Family status"}
                        {tier === 25 && "Golden Ticket to give away"}
                        {tier === 50 && "Lifetime FREE subscription"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-surface p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-3">Ready to share?</h3>
                <p className="text-sm text-text-secondary mb-6">Join the waitlist to get your personal referral link.</p>
                <a href="#signup" className="inline-flex items-center justify-center w-full rounded-xl bg-primary px-6 py-3 font-semibold text-white hover:bg-primary/90">
                  Get my referral link
                </a>
                {/* REFERRAL: updated "you both move up the waitlist" */}
                <p className="mt-4 text-xs text-text-secondary">Share your link — you both move up the waitlist</p>
              </div>
            </div>
          </div>
        </section>

        {/* Guarantee Section */}
        <section className="py-16 bg-background-elevated">
          <div className="max-w-3xl mx-auto px-6">
            {/* GUARANTEE: purple tones, 30-day post-launch guarantee */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12 border border-primary/20 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                <Icons.shieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4">30-Day Love It Guarantee</h2>
              <p className="text-xl text-text-secondary mb-6">
                After beta, if Psalmix isn&apos;t everything we promised in your first 30 days — you get a <span className="text-primary font-semibold">full refund</span>. No questions. No games.
              </p>
              <p className="text-sm text-text-secondary">
                We&apos;re building this for the long run. If it doesn&apos;t deliver, you shouldn&apos;t pay for it. Simple as that.
              </p>
            </div>
          </div>
        </section>

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
        <section className="py-24 bg-primary text-white overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to Just Press Play?</h2>
            <p className="text-white/80 mb-10 max-w-xl mx-auto text-lg">
              Beta opens April 15. Reserve your spot now — it&apos;s free.
            </p>
            <SignupForm variant="footer" referralCode={referralCode} />
            <p className="mt-6 text-sm text-white/80">🎉 Beta is FREE • $7.99/mo at launch • No credit card required</p>
          </div>
        </section>
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
              <p className="text-xs text-text-secondary">Built by McKinzie Bean · Mom of 3 · Singer &amp; songwriter</p>
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
