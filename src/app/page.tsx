/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState, Suspense } from "react";
import React from "react";
import {
  Menu, ShieldCheck, Clock, Headphones, Globe, MonitorSmartphone,
  CheckCircle2, XCircle, Star, Users, BadgeCheck, MessageSquare,
  Ban, UserSearch, Lock, ChevronDown, Sparkles, Mail, CheckCircle,
  Download, Smartphone, Laptop
} from "lucide-react";

// ─── PsalMix Brand Colors ─────────────────────────────────────────────────────
const BRAND = {
  background:   "#111826",  // Page background
  surface:       "#1C2333",  // Cards/containers
  surfaceHover:  "#262D3D",  // Hover state
  primary:       "#8B4BCF",  // Psalmix Purple
  primaryHover:  "#7B3BBF",  // Hover
  primaryLight:  "#A66BD9",  // Light variant
  text:          "#FFFFFF",
  textSecondary: "#94A3B8",
  textMuted:     "#64748B",
  border:        "rgba(255,255,255,0.08)",
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  shieldCheck: ShieldCheck,
  download:    Download,
  smartphone:  Smartphone,
  laptop:      Laptop,
  globe:       Globe,
  mail:        Mail,
  sparkles:    Sparkles,
  checkCircle: CheckCircle,
  users:       Users,
  star:        Star,
  badgeCheck:  BadgeCheck,
  messageSquare: MessageSquare,
  ban:         Ban,
  userSearch:  UserSearch,
  lock:        Lock,
};

// ─── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#111826]/90 backdrop-blur-xl border-b border-white/10">
      <div className="flex justify-between items-center max-w-6xl mx-auto px-6 md:px-8 h-16 md:h-20">
        <div className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <span className="text-[#8B4BCF]">♪</span> Psalmix
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <a href="#features" className="text-[#94A3B8] hover:text-white transition-colors font-medium">Features</a>
          <a href="#how-it-works" className="text-[#94A3B8] hover:text-white transition-colors font-medium">How it Works</a>
          <a href="#faq" className="text-[#94A3B8] hover:text-white transition-colors font-medium">FAQ</a>
          <a
            href="#signup"
            className="bg-[#8B4BCF] text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-[#7B3BBF] hover:shadow-[0_0_20px_rgba(139,75,207,0.4)] transition-all duration-200"
          >
            Save My Spot
          </a>
        </div>
        <button className="md:hidden text-white">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}

// ─── SignupForm (connected to /api/signup) ────────────────────────────────────
function SignupForm({ variant = "hero" }: { variant?: "hero" | "footer" }) {
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
      <div className="rounded-2xl bg-[#1C2333] border border-white/10 p-8 text-center max-w-md mx-auto shadow-xl">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
          <Icons.checkCircle className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          {alreadyOnList ? "You're already on the list!" : "You're in!"}
        </h3>
        <p className="text-[#94A3B8] text-sm">
          We'll send you an email when beta opens.
        </p>
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto" id="signup">
        <div className="rounded-2xl border border-white/10 shadow-xl overflow-hidden flex flex-col sm:flex-row">
          <div className="flex items-center px-5 py-4 flex-grow bg-[#1C2333]">
            <Icons.mail className="w-5 h-5 text-[#64748B] mr-3 flex-shrink-0" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder:text-[#64748B] text-base"
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-[#8B4BCF] text-white px-8 py-4 font-bold text-base hover:bg-[#7B3BBF] transition-all disabled:opacity-60 whitespace-nowrap"
          >
            {status === "loading" ? "Saving your spot..." : "Save My Spot — It's Free"}
          </button>
        </div>
        {status === "error" && errorMessage && (
          <p className="text-red-400 text-sm mt-3 text-center">{errorMessage}</p>
        )}
        <p className="text-xs text-[#64748B] mt-3 text-center flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#8B4BCF]" />
          No credit card. No catch. Takes 30 seconds.
        </p>
      </form>
    );
  }

  // footer variant
  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-grow bg-[#1C2333] border border-white/10 rounded-full px-6 py-3 text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#8B4BCF] transition-colors"
        placeholder="Enter your email"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-[#8B4BCF] text-white px-8 py-3 rounded-full font-bold hover:bg-[#7B3BBF] transition-all disabled:opacity-60 whitespace-nowrap"
      >
        {status === "loading" ? "Saving..." : "Save My Spot"}
      </button>
    </form>
  );
}

// ─── Hero (centered layout, like the reference) ───────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Radial gradient spotlight from center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(139,75,207,0.12) 0%, transparent 70%)",
        }}
      />
      {/* Subtle ambient glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#8B4BCF]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-32 pb-20">
        {/* Trust tag pills above headline */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <span className="px-4 py-1.5 rounded-full border border-[#8B4BCF]/30 text-xs font-bold text-[#A66BD9] uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Human Reviewed
          </span>
          <span className="px-4 py-1.5 rounded-full border border-white/10 text-xs font-bold text-[#94A3B8] uppercase tracking-wider flex items-center gap-2">
            <Download className="w-3.5 h-3.5" /> Offline Ready
          </span>
          <span className="px-4 py-1.5 rounded-full border border-white/10 text-xs font-bold text-[#94A3B8] uppercase tracking-wider flex items-center gap-2">
            <Smartphone className="w-3.5 h-3.5" /> Any Device
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight text-white mb-6">
          Family-Safe Music.{" "}
          <span
            className="italic"
            style={{
              background: "linear-gradient(135deg, #A66BD9 0%, #8B4BCF 50%, #06B6D4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Finally.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-[#94A3B8] max-w-2xl mx-auto mb-10 leading-relaxed">
          Every song verified safe by real humans. Half the price of Spotify. No
          hidden filters, no accidental explicit lyrics.
        </p>

        {/* Email form */}
        <div className="mb-8">
          <SignupForm variant="hero" />
        </div>

        {/* Device icons at bottom */}
        <div className="flex items-center justify-center gap-6 mt-8 opacity-40">
          <Smartphone className="w-5 h-5 text-white" />
          <div className="w-px h-4 bg-white/30" />
          <Laptop className="w-5 h-5 text-white" />
          <div className="w-px h-4 bg-white/30" />
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
      </div>
    </section>
  );
}

// ─── Founder Story ─────────────────────────────────────────────────────────────
function FounderStory() {
  return (
    <section
      id="how-it-works"
      className="py-24 px-6 bg-[#1C2333]/50"
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className="w-48 h-48 md:w-56 md:h-56 rounded-full p-1.5"
            style={{
              background: "linear-gradient(135deg, #8B4BCF, #A66BD9, #06B6D4)",
            }}
          >
            <img
              className="w-full h-full object-cover rounded-full"
              style={{ background: "#1C2333" }}
              alt="McKinzie Bean, Founder"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL6iBh9jfnl_tCUuS9y1mmR8DbCgKvWXayOlW9q_DPotit8-iNNjrOGIu8rSU_E6P_6Ljre-utnwzDHfFCwq-EztU5Ec6ualQYQTisirRY0AxF1UKFD_ffrOtmUpGQ_AcWYUPJiiaA5dtAWlUZ7B_r3xw6T8tURR87jaZng0B0o-1jQHKxgFWh0wqBM5LJ58TFpzaVALoHOwqfm4ZzvtoBDFYu5JEyJRYiwC744-EoBOeGNu-Qn8QqRQbWjg_uTxMwyMzjsfUGvwo"
            />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-5 text-center md:text-left">
          <span className="text-[#8B4BCF] font-bold tracking-widest text-xs uppercase">
            Founder's Story
          </span>
          <blockquote
            className="text-2xl md:text-3xl font-bold leading-snug italic text-white"
            style={{ fontFamily: "Georgia, serif" }}
          >
            "The turning point was realizing I couldn't keep reacting to what my
            kids heard. I needed a space where safety was the default, not an
            option."
          </blockquote>
          <p className="text-[#94A3B8] text-base leading-relaxed">
            McKinzie built Psalmix after years of frustration with "clean" filters
            that missed explicit themes and questionable cover art. Every single
            track is vetted by a human ear.
          </p>
          <div
            className="p-5 rounded-xl border border-white/10 inline-flex items-center gap-3"
            style={{ background: "#1C2333" }}
          >
            <BadgeCheck className="w-5 h-5 text-[#8B4BCF] flex-shrink-0" />
            <p className="text-sm font-medium text-white">
              Every song and cover image is reviewed personally.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Problem Section ───────────────────────────────────────────────────────────
function ProblemSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-black text-white">
            The music industry has a problem.
          </h2>
          <p className="text-[#94A3B8] text-lg">
            Current apps aren't designed for families who care about content.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: ShieldCheck,
              color: "#ef4444",
              title: "Unvetted Lyrics",
              desc: "Your kids are singing songs you would never choose, thanks to algorithmic recommendations.",
            },
            {
              icon: Clock,
              color: "#06B6D4",
              title: "Wasted Time",
              desc: "You spend hours curating playlists just to make sure they're safe for a 15-minute car ride.",
            },
            {
              icon: Headphones,
              color: "#8B4BCF",
              title: "Assumed Consent",
              desc: 'Mainstream apps assume you\'re okay with explicit content and make "clean" versions hard to find.',
            },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div
              key={title}
              className="p-8 rounded-2xl border border-white/10 text-center space-y-4 hover:border-[#8B4BCF]/30 transition-colors"
              style={{ background: "#1C2333" }}
            >
              <div
                className="w-14 h-14 rounded-xl mx-auto flex items-center justify-center"
                style={{ background: `${color}15`, color }}
              >
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Solution Section ─────────────────────────────────────────────────────────
function SolutionSection() {
  return (
    <section
      id="features"
      className="py-24 px-6"
      style={{ background: "#1C2333/40" }}
    >
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Psalmix is the solution.
            </h2>
            <p className="text-[#94A3B8] leading-relaxed">
              We re-imagined the music app from the ground up, placing human
              integrity at the core of every playback.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                icon: ShieldCheck,
                color: "#8B4BCF",
                title: "Every Song, Human-Reviewed",
                desc: "Zero reliance on labels. If it's on Psalmix, a real human has listened and approved it.",
              },
              {
                icon: Globe,
                color: "#06B6D4",
                title: "20+ Genres, All Clean",
                desc: "From Pop to Lo-Fi, Worship to Classical. Your favorite genres, strictly curated.",
              },
              {
                icon: MonitorSmartphone,
                color: "#F59E0B",
                title: "Any Device, Anywhere",
                desc: "Seamless transition from your home speakers to your phone to your desktop.",
              },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="flex gap-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}15`, color }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">{title}</h4>
                  <p className="text-[#94A3B8] text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: musician image */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <img
            className="w-full object-cover h-[400px]"
            alt="Concert stage"
            src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(17,24,38,0.8) 0%, transparent 50%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}

// ─── Comparison Section ────────────────────────────────────────────────────────
function ComparisonSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl md:text-4xl font-black text-white">
            No compromises.
          </h2>
          <p className="text-[#94A3B8]">
            Psalmix undercuts the competition on price while delivering more value.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Psalmix",
              price: "$7.99",
              period: "/mo",
              highlight: true,
              features: [
                { text: "Human-Reviewed Songs", ok: true },
                { text: "Family-Safe Content", ok: true },
                { text: "Offline Listening", ok: true },
                { text: "20+ Genres", ok: true },
                { text: "No Explicit Lyrics", ok: true },
                { text: "Founding Price Lock", ok: true },
                { text: "Cover Art Vetted", ok: true },
              ],
            },
            {
              name: "Spotify",
              price: "$10.99",
              period: "/mo",
              highlight: false,
              features: [
                { text: "Human-Reviewed Songs", ok: false },
                { text: "Family-Safe Content", ok: false },
                { text: "Offline Listening", ok: true },
                { text: "20+ Genres", ok: true },
                { text: "No Explicit Lyrics", ok: false },
                { text: "Founding Price Lock", ok: false },
                { text: "Cover Art Vetted", ok: false },
              ],
            },
            {
              name: "Apple Music",
              price: "$10.99",
              period: "/mo",
              highlight: false,
              features: [
                { text: "Human-Reviewed Songs", ok: false },
                { text: "Family-Safe Content", ok: false },
                { text: "Offline Listening", ok: true },
                { text: "20+ Genres", ok: true },
                { text: "No Explicit Lyrics", ok: false },
                { text: "Founding Price Lock", ok: false },
                { text: "Cover Art Vetted", ok: false },
              ],
            },
          ].map(({ name, price, period, highlight, features }) => (
            <div
              key={name}
              className="rounded-2xl p-6 space-y-5"
              style={{
                background: highlight ? "#1C2333" : "#111826",
                border: highlight
                  ? "2px solid #8B4BCF"
                  : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {highlight && (
                <div className="text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#A66BD9] bg-[#8B4BCF]/10 px-3 py-1 rounded-full">
                    Best Choice
                  </span>
                </div>
              )}
              <div className="text-center">
                <p className="text-white font-bold text-lg mb-1">{name}</p>
                <p className="text-4xl font-black text-white">
                  {price}
                  <span className="text-lg font-normal text-[#64748B]">
                    {period}
                  </span>
                </p>
              </div>
              <div className="space-y-3">
                {features.map(({ text, ok }) => (
                  <div key={text} className="flex items-center gap-3">
                    {ok ? (
                      <CheckCircle2 className="w-4 h-4 text-[#8B4BCF] flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-[#64748B] flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        ok ? "text-white" : "text-[#64748B]"
                      }`}
                    >
                      {text}
                    </span>
                  </div>
                ))}
              </div>
              {highlight && (
                <a
                  href="#signup"
                  className="block text-center bg-[#8B4BCF] text-white font-bold py-3 rounded-xl hover:bg-[#7B3BBF] transition-colors"
                >
                  Join Waitlist
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Founding Family / CTA ────────────────────────────────────────────────────
function FoundingFamily() {
  return (
    <section
      id="signup"
      className="py-24 px-6"
      style={{ background: "#1C2333/50" }}
    >
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-black text-white">
            Become a Founding Family
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-xl mx-auto">
            Early members get permanent price locking and exclusive access to the
            Psalmix roadmap.
          </p>
        </div>

        {/* Progress bar — real dynamic data */}
        <div
          className="p-8 rounded-2xl border border-[#8B4BCF]/20 space-y-4"
          style={{ background: "#1C2333" }}
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-[#8B4BCF] uppercase tracking-widest">
              Spots Claimed
            </span>
            <span className="text-2xl font-black text-white">
              <WaitlistCount />
            </span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "#111826" }}>
            <div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #8B4BCF, #06B6D4)",
                width: "82.4%",
              }}
            />
          </div>
          <p className="text-sm text-[#64748B]">
            88 spots remaining. Founding families get lifetime $7.99/mo pricing.
          </p>
        </div>

        {/* Perks grid */}
        <div className="grid sm:grid-cols-2 gap-4 text-left">
          {[
            { icon: Star, text: "Lifetime Price Lock of $7.99/mo" },
            { icon: BadgeCheck, text: "Exclusive Founding Member Badge" },
            { icon: MessageSquare, text: "Beta Access to New Features" },
            { icon: Users, text: "Direct Feedback Channel to Founder" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-4 p-4 rounded-xl border border-white/10"
              style={{ background: "#111826" }}
            >
              <Icon className="w-5 h-5 text-[#06B6D4] flex-shrink-0" />
              <p className="text-sm font-medium text-white">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Dynamic Waitlist Count ───────────────────────────────────────────────────
function WaitlistCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/waitlist-count")
      .then((r) => r.json())
      .then((d) => {
        if (d.count !== undefined) setCount(d.count);
      })
      .catch(() => {});
  }, []);

  if (count === null) return <span className="text-[#64748B]">—</span>;
  return <>{count.toLocaleString()}</>;
}

// ─── Guarantee ─────────────────────────────────────────────────────────────────
function Guarantee() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6">
        {[
          { icon: Ban, color: "#8B4BCF", title: "Cancel Anytime" },
          { icon: UserSearch, color: "#06B6D4", title: "Human-Reviewed" },
          { icon: Lock, color: "#F59E0B", title: "Founding Price" },
        ].map(({ icon: Icon, color, title }) => (
          <div
            key={title}
            className="p-6 rounded-2xl border border-white/10 flex items-center gap-4"
            style={{ background: "#1C2333" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}15`, color }}
            >
              <Icon className="w-6 h-6" />
            </div>
            <h5 className="font-bold text-white">{title}</h5>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── FAQ ───────────────────────────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-5 text-left font-semibold text-white hover:text-[#A66BD9] transition-colors"
      >
        <span>{question}</span>
        <ChevronDown
          className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#8B4BCF]" : "text-[#64748B]"
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-[#94A3B8] leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "When does Psalmix launch?",
      a: "We are currently in beta and plan to launch publicly later this year. Founding families get immediate access.",
    },
    {
      q: "How is Psalmix different from Spotify's 'Explicit' filter?",
      a: "Spotify's filter only blocks songs with EXPLICIT tags — it misses songs with suggestive lyrics, double entendres, and inappropriate cover art. Psalmix has a human review every track from a family's perspective.",
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes. There are no contracts and no cancellation fees. You can cancel your subscription at any time from your account settings.",
    },
    {
      q: "What devices are supported?",
      a: "Psalmix will be available on iOS, Android, Mac, Windows, and web. All with seamless offline syncing across your devices.",
    },
    {
      q: "How does the Founding Family price lock work?",
      a: "Founding members who join during the waitlist period will be grandfathered into the $7.99/month rate permanently — even if prices increase for new members in the future.",
    },
  ];

  return (
    <section id="faq" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            Frequently asked questions
          </h2>
          <p className="text-[#94A3B8]">
            Can't find the answer you're looking for?{" "}
            <a href="mailto:hello@psalmix.com" className="text-[#8B4BCF] hover:underline">
              Reach out to us.
            </a>
          </p>
        </div>

        <div>
          {faqs.map(({ q, a }) => (
            <FAQItem key={q} question={q} answer={a} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ─────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-black text-white">
            Ready to join?
          </h2>
          <p className="text-[#94A3B8] text-lg">
            Be the first to know when Psalmix opens for founding families.
          </p>
        </div>
        <SignupForm variant="footer" />
        <p className="text-xs text-[#64748B] flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#8B4BCF]" />
          No credit card required. We'll email you when beta opens.
        </p>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="w-full py-12 px-6 border-t border-white/10">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-white font-bold text-lg flex items-center gap-2">
          <span className="text-[#8B4BCF]">♪</span> Psalmix
        </div>
        <div className="flex items-center gap-6 text-sm text-[#64748B]">
          <a href="mailto:hello@psalmix.com" className="hover:text-white transition-colors">
            Contact
          </a>
          <a href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
        </div>
        <p className="text-sm text-[#64748B]">
          © 2026 Psalmix. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ─── Sticky CTA ────────────────────────────────────────────────────────────────
function StickyCTA({ spotsRemaining }: { spotsRemaining: number | null }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      <a
        href="#signup"
        className="flex items-center gap-3 bg-[#8B4BCF] text-white px-6 py-4 rounded-full font-bold shadow-2xl shadow-[#8B4BCF]/30 hover:scale-105 transition-transform"
      >
        <Sparkles className="w-5 h-5" />
        <span>Save My Spot — It's Free</span>
        {spotsRemaining !== null && spotsRemaining < 500 && (
          <span className="text-white/70 text-sm">• {spotsRemaining} spots left</span>
        )}
      </a>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/waitlist-count")
      .then((r) => r.json())
      .then((d) => { if (d.count !== undefined) setCount(d.count); })
      .catch(() => {});
  }, []);

  const spotsRemaining = count !== null ? Math.max(0, 500 - count) : null;

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#111826] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#8B4BCF] border-t-transparent rounded-full animate-spin" />
    </div>}>
      <div className="min-h-screen" style={{ background: "#111826", color: "white" }}>
        <Navbar />
        <main>
          <Hero />
          <FounderStory />
          <ProblemSection />
          <SolutionSection />
          <ComparisonSection />
          <Guarantee />
          <FoundingFamily />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer />
        <StickyCTA spotsRemaining={spotsRemaining} />
      </div>
    </Suspense>
  );
}
