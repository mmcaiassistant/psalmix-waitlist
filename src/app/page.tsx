/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState, Suspense } from "react";
import React from "react";
import {
  Menu, ShieldCheck, Clock, Headphones, Globe, MonitorSmartphone,
  CheckCircle2, XCircle, Star, Users, BadgeCheck, MessageSquare,
  Ban, UserSearch, Lock, ChevronDown, Sparkles, Mail,
  Download, Smartphone, Laptop, SkipForward, AlertTriangle, Eye, Heart
} from "lucide-react";

// ─── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
            Get Early Access
          </a>
        </div>
        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>
      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[#111826] border-t border-white/10 px-6 py-6 flex flex-col gap-5">
          <a href="#features" onClick={() => setMenuOpen(false)} className="text-[#94A3B8] hover:text-white transition-colors font-medium">Features</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="text-[#94A3B8] hover:text-white transition-colors font-medium">How it Works</a>
          <a href="#faq" onClick={() => setMenuOpen(false)} className="text-[#94A3B8] hover:text-white transition-colors font-medium">FAQ</a>
          <a href="#signup" onClick={() => setMenuOpen(false)} className="bg-[#8B4BCF] text-white px-5 py-3 rounded-full font-bold text-sm text-center hover:bg-[#7B3BBF] transition-all">
            Get Early Access
          </a>
        </div>
      )}
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
          <CheckCircle2 className="w-8 h-8 text-green-400" />
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
      <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto" id="signup">
        <div className="rounded-2xl border border-white/10 shadow-xl overflow-hidden flex flex-col sm:flex-row">
          <div className="flex items-center px-5 h-14 flex-grow bg-[#1C2333]">
            <Mail className="w-5 h-5 text-[#64748B] mr-3 flex-shrink-0" />
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
            className="bg-[#8B4BCF] text-white px-8 h-14 font-bold text-base hover:bg-[#7B3BBF] transition-all disabled:opacity-60 whitespace-nowrap flex items-center justify-center"
          >
            {status === "loading" ? "Saving your spot..." : "Get Early Access — It's Free"}
          </button>
        </div>
        {status === "error" && errorMessage && (
          <p className="text-red-400 text-sm mt-3 text-center">{errorMessage}</p>
        )}
        <p className="text-xs text-[#64748B] mt-3 text-center flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#8B4BCF]" />
          No credit card. No catch. Takes 10 seconds.
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
        {status === "loading" ? "Saving..." : "Get Early Access"}
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
            <ShieldCheck className="w-3.5 h-3.5" /> Mom-Approved
          </span>
          <span className="px-4 py-1.5 rounded-full border border-white/10 text-xs font-bold text-[#94A3B8] uppercase tracking-wider flex items-center gap-2">
            <Download className="w-3.5 h-3.5" /> Offline Ready
          </span>
          <span className="px-4 py-1.5 rounded-full border border-white/10 text-xs font-bold text-[#94A3B8] uppercase tracking-wider flex items-center gap-2">
            <Smartphone className="w-3.5 h-3.5" /> Any Device
          </span>
        </div>

        {/* Headline — from PsalMix Messaging Guide */}
        <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight text-white mb-6">
          Music I'd Let My Own Kids{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #A66BD9 0%, #8B4BCF 50%, #06B6D4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Listen To.
          </span>
        </h1>

        {/* Subheadline — from PsalMix Messaging Guide */}
        <p className="text-lg md:text-xl text-[#94A3B8] max-w-2xl mx-auto mb-10 leading-relaxed">
          Every song on PsalMix is personally approved by me — a conservative Christian mom. Not just no bad words. Songs that won't fill your kids with rebellion, angst, or content you'd never choose for them.
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
      className="py-24 px-6 bg-[#1C2333]/50 scroll-mt-20"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section label */}
        <div className="text-center mb-12">
          <span className="text-[#8B4BCF] font-bold tracking-widest text-xs uppercase">
            I Got Tired of Hitting Skip
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-14 items-center">

          {/* Photo column */}
          <div className="flex-shrink-0 flex flex-col items-center gap-4">
            {/* Gradient ring */}
            <div
              className="w-48 h-48 md:w-56 md:h-56 rounded-full p-1.5"
              style={{
                background: "linear-gradient(135deg, #8B4BCF, #A66BD9, #06B6D4)",
              }}
            >
              <img
                className="w-full h-full object-cover object-top rounded-full"
                style={{ background: "#1C2333" }}
                alt="McKinzie Bean, Founder"
                src="/images/mckinzie-headshot.jpg"
              />
            </div>
            {/* Name + title */}
            <div className="text-center">
              <p className="font-bold text-white text-base">McKinzie Bean</p>
              <p className="text-xs text-[#94A3B8] mt-0.5">Founder · Singer/songwriter · Mom of 3</p>
            </div>
            {/* Role tags */}
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#8B4BCF]/15 border border-[#8B4BCF]/25 text-[#A66BD9] text-xs font-semibold">Singer & songwriter</span>
              <span className="px-3 py-1 rounded-full bg-[#8B4BCF]/15 border border-[#8B4BCF]/25 text-[#A66BD9] text-xs font-semibold">Homeschool mom of 3</span>
            </div>
          </div>

          {/* Quote column */}
          <div className="flex-1">
            {/* Big decorative quote mark */}
            <div
              className="text-[96px] leading-none select-none mb-[-24px]"
              style={{ color: "rgba(139,75,207,0.25)", fontFamily: "Georgia, serif" }}
            >
              &ldquo;
            </div>
            <blockquote className="text-white text-xl md:text-2xl leading-relaxed font-medium mb-5">
              The turning point was realizing I couldn't keep reacting. I'd hear something on the radio or catch a lyric on Spotify and think — how long has my kid been singing along to that?
            </blockquote>
            <p className="text-white/80 text-base leading-relaxed mb-6">
              I'm a singer and songwriter — I know how deeply music shapes the way we see the world. As a homeschool mom juggling a preteen, an elementary-aged child, and a toddler, I couldn't keep reacting. So I built the thing I couldn't find anywhere else: music my kids actually love, with zero surprises. That's Psalmix.
            </p>
            {/* Trust badge */}
            <div className="flex items-start gap-3 bg-[#8B4BCF]/8 border border-[#8B4BCF]/20 rounded-2xl px-5 py-4">
              <svg className="w-5 h-5 text-[#8B4BCF] mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <p className="text-white/70 text-sm leading-relaxed">
                Every song and cover image is reviewed by McKinzie and our team of Christian musicians and educators before it reaches your family. Not an algorithm — real people who care.
              </p>
            </div>
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
            Sound familiar?
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            Even with filters on, mainstream music still carries messages most parents never chose for their kids.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: SkipForward,
              color: "#ef4444",
              title: "The skip button is your nemesis",
              desc: "You said yes to music, not to hitting skip every 90 seconds. Filters catch the f-bombs but not the 'I want to die' in the bridge.",
            },
            {
              icon: Clock,
              color: "#06B6D4",
              title: "Playlist curation is a full-time job",
              desc: "You spend hours carefully curating playlists — and you're still one song away from an awkward car ride moment.",
            },
            {
              icon: AlertTriangle,
              color: "#8B4BCF",
              title: "Filters are a suggestion, not a wall",
              desc: 'Mainstream apps assume you\'re okay with "clean" versions — they make them hard to find and they\'re still full of questionable content.',
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

// ─── Custom SVG Phone Mockup ──────────────────────────────────────────────────
function PhoneMockup() {
  return (
    <div className="flex justify-center">
      <div
        className="relative w-[270px] rounded-[36px] overflow-hidden shadow-2xl shadow-black/50"
        style={{
          border: "3px solid #8B4BCF",
          background: "#111826",
        }}
      >
        {/* Status bar */}
        <div
          className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-2"
          style={{ background: "rgba(17,24,38,0.9)" }}
        >
          <span className="text-white/60 text-xs font-medium">11:59</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-2 rounded-sm bg-white/80" />
            <div className="w-4 h-2 rounded-sm bg-white/80" />
            <div className="w-4 h-2 rounded-sm bg-[#8B4BCF]" />
          </div>
        </div>

        {/* App screenshot */}
        <img
          src="/images/psalmix-now-playing.jpg"
          alt="PsalMix app - Now Playing screen"
          className="w-full h-auto block"
        />

        {/* Bottom nav bar */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center justify-around py-3 px-6"
          style={{ background: "rgba(17,24,38,0.95)" }}
        >
          <div className="text-[#64748B] text-[10px] font-medium">Share</div>
          <div className="text-white text-[10px] font-bold flex flex-col items-center gap-0.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 19V6l12-3v13M9 19c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-3c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"/>
            </svg>
            <span>Queue</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Solution Section ─────────────────────────────────────────────────────────
function SolutionSection() {
  return (
    <section
      id="features"
      className="py-24 px-6 scroll-mt-20"
      style={{ background: "#1C2333/40" }}
    >
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Built on trust.
            </h2>
            <p className="text-[#94A3B8] leading-relaxed">
              We didn't just filter content — we rebuilt the entire streaming model
              around one principle: your family deserves to feel safe.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                icon: Heart,
                color: "#8B4BCF",
                title: "Songs That Actually Resonate",
                desc: "Teens feel real things — sadness, anger, frustration, heartbreak. We don't dumb that down. Every song meets your kid where they are and lifts them back up.",
              },
              {
                icon: ShieldCheck,
                color: "#06B6D4",
                title: "Actually Safe Music",
                desc: "No bad words. No questionable themes. No album covers you'd be embarrassed to see on the family TV. Every pixel designed to be something you'd feel good about.",
              },
              {
                icon: Star,
                color: "#A66BD9",
                title: "I Approved Every Single Song",
                desc: "I'm not a tech company. I'm a mom who cares too much. Every song on PsalMix is something I personally let my own kids listen to. That's a promise I make.",
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

        {/* Right: custom phone mockup */}
        <PhoneMockup />
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
                { text: "No Bad Words", ok: true },
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
                { text: "No Bad Words", ok: false },
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
                { text: "No Bad Words", ok: false },
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
// Accepts count and spotsRemaining as props for real data
function FoundingFamily({
  totalCount,
  spotsRemaining,
  progressPercent,
}: {
  totalCount: number | null;
  spotsRemaining: number | null;
  progressPercent: number;
}) {
  return (
    <section
      id="signup"
      className="py-24 px-6 scroll-mt-20"
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
              {totalCount !== null ? totalCount.toLocaleString() : "—"}
            </span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "#111826" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                background: "linear-gradient(90deg, #8B4BCF, #06B6D4)",
                width: `${progressPercent}%`,
              }}
            />
          </div>
          <p className="text-sm text-[#64748B]">
            {spotsRemaining !== null
              ? `${spotsRemaining.toLocaleString()} spots remaining.`
              : "Spots filling up fast."}{" "}
            Founding families get lifetime $7.99/mo pricing.
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
    // Endpoint is /api/stats which returns { total: N }
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.total !== undefined) setCount(d.total);
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
          {
            icon: ShieldCheck,
            color: "#8B4BCF",
            title: "Every Song Reviewed",
            desc: "Real people — not an algorithm — listen to every song before it goes live."
          },
          {
            icon: Eye,
            color: "#06B6D4",
            title: "Beyond the Lyrics",
            desc: "We review mood, themes, and intent — not just whether a bad word appears."
          },
          {
            icon: Ban,
            color: "#F59E0B",
            title: "Cancel Anytime",
            desc: "No contracts. No catch. If it's not working, you can walk away."
          },
        ].map(({ icon: Icon, color, title, desc }) => (
          <div
            key={title}
            className="p-6 rounded-2xl border border-white/10 flex flex-col items-start gap-3"
            style={{ background: "#1C2333" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}15`, color }}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white mb-1">{title}</h5>
              <p className="text-[#94A3B8] text-xs leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── FAQ ───────────────────────────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const answerId = `faq-answer-${question.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase().slice(0, 20)}`;
  const buttonId = `faq-btn-${question.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase().slice(0, 20)}`;

  const toggle = () => setIsOpen((v) => !v);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div className="border-b border-white/10">
      <button
        id={buttonId}
        aria-expanded={isOpen}
        aria-controls={answerId}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        className="w-full flex justify-between items-center py-5 text-left font-semibold text-white hover:text-[#A66BD9] transition-colors"
      >
        <span>{question}</span>
        <ChevronDown
          aria-hidden="true"
          className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#8B4BCF]" : "text-[#64748B]"
          }`}
        />
      </button>
      <div
        id={answerId}
        role="region"
        aria-labelledby={buttonId}
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
      a: "We're in private beta now. Founding families get early access and a locked-in $7.99/month rate for life — you'll get an invite as soon as your spot opens up.",
    },
    {
      q: "Is this just Christian music?",
      a: "No. Psalmix includes Pop, Rock, Country, Worship, Hip-Hop, Lo-Fi, Classical, and more. Every genre — as long as the content meets our family-friendly standard. Think mainstream radio energy without the mainstream baggage.",
    },
    {
      q: "How is Psalmix different from a mainstream filter?",
      a: "Filters catch words. We catch intent. We review every song from a parent's perspective — not just the lyrics, but the mood, themes, and what the song is actually trying to do to your kid's heart. That includes cover art, too.",
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes. No contracts, no cancellation fees. If it's not working for your family, you can walk away — no hard feelings.",
    },
    {
      q: "How does the Founding Family price lock work?",
      a: "Founding families who join during the waitlist period are grandfathered into $7.99/month for life — even when we raise prices for new members later. You keep your rate. Always.",
    },
    {
      q: "Will my teen actually like this?",
      a: "Your teen will either love it or tolerate it. They might not love every song — I don't either. But they won't feel like they're being preached at. The songs have real emotions — sadness, anger, confusion, heartbreak. They just don't end in a dark place. And honestly? Some teens prefer knowing there's a mom behind the music. It makes them feel looked after instead of just... managed.",
    },
  ];

  return (
    <section id="faq" className="py-24 px-6 scroll-mt-20">
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
        <span>Get Early Access — It's Free</span>
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
    // Correct endpoint: /api/stats returns { total: N }
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => { if (d.total !== undefined) setCount(d.total); })
      .catch(() => {});
  }, []);

  const spotsRemaining = count !== null ? Math.max(0, 500 - count) : null;
  const progressPercent = count !== null ? Math.min(100, (count / 500) * 100) : 82.4;

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
          <FoundingFamily
            totalCount={count}
            spotsRemaining={spotsRemaining}
            progressPercent={progressPercent}
          />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer />
        <StickyCTA spotsRemaining={spotsRemaining} />
      </div>
    </Suspense>
  );
}
