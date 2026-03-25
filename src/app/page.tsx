"use client";

/* eslint-disable react/no-unescaped-entities */

import { useEffect, useState, Suspense } from "react";
import React from "react";
import {
  Menu, ShieldCheck, Shield, Clock, Headphones, Globe, MonitorSmartphone,
  CheckCircle2, XCircle, Star, Users, BadgeCheck, MessageSquare,
  Ban, UserSearch, Lock, ChevronDown, Sparkles
} from "lucide-react";

// ─── Design tokens (match Stitch design) ──────────────────────────────────────
const colors = {
  background: "#0c1321",
  surface: "#19202e",
  "surface-high": "#232a39",
  "surface-highest": "#2e3544",
  primary: "#dbb8ff",
  "primary-container": "#8b4bcf",
  secondary: "#4cd7f6",
  tertiary: "#f2bf5c",
  error: "#ffb4ab",
  "on-surface": "#dce2f6",
  "on-surface-variant": "#cec2d5",
  outline: "#978d9e",
  "outline-variant": "#4c4452",
  "on-primary": "#480082",
};

// ─── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0c1321]/80 backdrop-blur-xl border-b border-[#4c4452]/20">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
        <div className="text-2xl font-extrabold tracking-tighter text-[#dce2f6]">
          Psalmix
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <a href="#features" className="text-[#cec2d5] hover:text-[#dce2f6] transition-colors font-semibold">Features</a>
          <a href="#how-it-works" className="text-[#cec2d5] hover:text-[#dce2f6] transition-colors font-semibold">How it Works</a>
          <a href="#faq" className="text-[#cec2d5] hover:text-[#dce2f6] transition-colors font-semibold">FAQ</a>
          <a
            href="#signup"
            className="bg-[#dbb8ff] text-[#480082] px-6 py-2.5 rounded-full font-bold hover:bg-[#dbb8ff]/90 hover:shadow-[0_0_20px_rgba(219,184,255,0.4)] hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
          >
            Save My Spot
          </a>
        </div>
        <button className="md:hidden text-[#dce2f6]">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative pt-32 pb-24 px-8 overflow-hidden min-h-screen flex items-center">
      {/* Ambient glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#8b4bcf]/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#4cd7f6]/10 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left: text + form */}
        <div className="space-y-8">
          {/* Pill badges */}
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-1.5 rounded-full bg-[#232a39] border border-[#4c4452]/20 text-xs font-bold tracking-wider uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#dbb8ff] animate-pulse"></span> Human Reviewed
            </span>
            <span className="px-4 py-1.5 rounded-full bg-[#232a39] border border-[#4c4452]/20 text-xs font-bold tracking-wider uppercase">Offline Ready</span>
            <span className="px-4 py-1.5 rounded-full bg-[#232a39] border border-[#4c4452]/20 text-xs font-bold tracking-wider uppercase">Any Device</span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-[#dce2f6]">
            Family-Safe Music. <br />
            <span className="text-[#dbb8ff] italic">Finally.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-[#cec2d5] max-w-lg leading-relaxed">
            Every song verified safe by real humans. Half the price of Spotify. No hidden filters, no accidental explicit lyrics.
          </p>

          {/* Email form */}
          <div className="space-y-4 max-w-md">
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                className="flex-grow bg-[#151c2a] border border-[#4c4452]/20 rounded-full px-6 py-4 focus:ring-2 focus:ring-[#dbb8ff] focus:border-transparent outline-none text-[#dce2f6] transition-all placeholder:text-[#cec2d5]/50"
                placeholder="Enter your email"
                type="email"
              />
              <button
                type="submit"
                className="bg-[#dbb8ff] text-[#480082] px-8 py-4 rounded-full font-bold whitespace-nowrap hover:bg-[#dbb8ff]/90 hover:shadow-[0_0_24px_rgba(219,184,255,0.4)] hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
              >
                Save My Spot — It's Free
              </button>
            </form>
            <p className="text-sm text-[#cec2d5]/60 flex items-center gap-2 px-1">
              <ShieldCheck className="w-4 h-4 text-[#dbb8ff]/80" />
              No credit card. No catch. Takes 30 seconds.
            </p>
          </div>

          {/* Waveform */}
          <div className="flex items-end gap-1.5 h-16 opacity-40">
            {[0.4, 0.7, 1, 0.6, 0.85, 0.5, 0.75, 0.9, 0.55, 0.65, 0.8, 0.45, 0.7, 0.6].map((h, i) => (
              <div
                key={i}
                className="waveform-bar w-1.5 rounded-full"
                style={{
                  height: `${h * 48 + 12}px`,
                  background: 'linear-gradient(to top, #8b4bcf, #dbb8ff, #4cd7f6)',
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Right: app screenshot */}
        <div className="relative group">
          <div className="absolute inset-0 bg-[#dbb8ff]/20 blur-[100px] rounded-full group-hover:bg-[#dbb8ff]/30 transition-all duration-500"></div>
          <div className="relative bg-[#232a39] border border-[#4c4452]/30 rounded-3xl p-4 overflow-hidden shadow-2xl transform group-hover:-translate-y-2 transition-transform duration-500">
            <img
              className="rounded-2xl w-full h-auto object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
              alt="Modern high-fidelity music app interface"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAETcAEPuC6MNR1e30v1McNt4t1xwjf5POJsm6Qw1NhpDjo4BDnCgQ6SFHCjGU_HL1JpzMeSz0gOsenlN9VbfeIy95nS1sWT1JBmNw2_IDlM6l2OEHNdHWkSP-DPdP5c26I-zFztOW9tIjoYFJhwUIwev-WZZ6u7try_cwA55QE1E9yK7yNUWa90rQ5QaIkDGlpvWhIHCxjGFQFte_to6yQVgVvGIpPqUzstweoiZi0Ou6ZNsly15LrN7Ry7l2mtvKMNno-KY1wBLk"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Founder Story ─────────────────────────────────────────────────────────────
function FounderStory() {
  return (
    <section className="py-24 px-8 bg-[#151c2a] relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-64 h-64 rounded-full p-1.5 bg-gradient-to-tr from-[#8b4bcf] via-[#dbb8ff] to-[#4cd7f6] shadow-[0_0_40px_rgba(219,184,255,0.15)]">
            <img
              className="w-full h-full object-cover rounded-full border-4 border-[#151c2a]"
              alt="Founder portrait"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL6iBh9jfnl_tCUuS9y1mmR8DbCgKvWXayOlW9q_DPotit8-iNNjrOGIu8rSU_E6P_6Ljre-utnwzDHfFCwq-EztU5Ec6ualQYQTisirRY0AxF1UKFD_ffrOtmUpGQ_AcWYUPJiiaA5dtAWlUZ7B_r3xw6T8tURR87jaZng0B0o-1jQHKxgFWh0wqBM5LJ58TFpzaVALoHOwqfm4ZzvtoBDFYu5JEyJRYiwC744-EoBOeGNu-Qn8QqRQbWjg_uTxMwyMzjsfUGvwo"
            />
          </div>
        </div>

        {/* Text */}
        <div className="flex-grow space-y-6">
          <span className="text-[#4cd7f6] font-bold tracking-widest text-xs uppercase">Founder's Story</span>
          <blockquote className="text-3xl font-extrabold leading-tight italic text-[#dce2f6]">
            "The turning point was realizing I couldn't keep reacting to what my kids heard. I needed a space where safety was the default, not an option."
          </blockquote>
          <p className="text-[#cec2d5] text-lg leading-relaxed max-w-2xl">
            McKinzie built Psalmix after years of frustration with "clean" filters that missed explicit themes and questionable cover art. She envisioned a service where every single track is vetted by a human ear, ensuring a truly family-safe environment.
          </p>
          <div className="p-6 bg-[#232a39]/40 rounded-2xl border border-[#4c4452]/20 inline-block">
            <p className="text-sm font-semibold flex items-center gap-3 text-[#dce2f6]">
              <BadgeCheck className="text-[#dbb8ff] w-6 h-6" />
              Every song and cover image is reviewed by McKinzie personally.
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
    <section className="py-32 px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#dce2f6]">The music industry has a problem.</h2>
          <p className="text-[#cec2d5] text-lg">Current apps aren't designed for families who care about content.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Shield, color: "#ffb4ab", title: "Unvetted Lyrics", desc: "Your kids are singing songs you would never choose, thanks to algorithmic recommendations." },
            { icon: Clock, color: "#4cd7f6", title: "Wasted Time", desc: "You spend hours curating playlists just to make sure they're safe for a 15-minute car ride." },
            { icon: Headphones, color: "#dbb8ff", title: "Assumed Consent", desc: "Mainstream apps assume you're okay with explicit content and make \"clean\" versions hard to find." },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div
              key={title}
              className="p-10 rounded-3xl bg-[#232a39]/30 border border-[#4c4452]/10 flex flex-col items-center text-center space-y-6 hover:bg-[#232a39]/50 transition-colors"
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${color}10`, color }}>
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#dce2f6]">{title}</h3>
              <p className="text-[#cec2d5]">{desc}</p>
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
    <section className="py-32 px-8 bg-[#19202e]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#dce2f6]">Psalmix is the solution.</h2>
            <p className="text-[#cec2d5] text-lg leading-relaxed">We re-imagined the music app from the ground up, placing human integrity at the core of every playback.</p>
          </div>

          <div className="space-y-8">
            {[
              { icon: ShieldCheck, color: "#dbb8ff", title: "Every Song, Human-Reviewed", desc: "Zero reliance on labels. If it's on Psalmix, a real human has listened and approved it." },
              { icon: Globe, color: "#4cd7f6", title: "20+ Genres, All Clean", desc: "From Pop to Lo-Fi, Worship to Classical. Your favorite genres, strictly curated." },
              { icon: MonitorSmartphone, color: "#f2bf5c", title: "Any Device, Anywhere", desc: "Seamless transition from your home speakers to your phone to your desktop." },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="flex gap-6 group">
                <div
                  className="w-14 h-14 flex-shrink-0 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${color}10`, color }}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#dce2f6] mb-1">{title}</h4>
                  <p className="text-[#cec2d5]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: image */}
        <div className="relative">
          <div className="absolute inset-0 bg-[#4cd7f6]/10 blur-[100px] rounded-full"></div>
          <img
            className="rounded-3xl shadow-2xl relative z-10 w-full object-cover h-[500px]"
            alt="Concert silhouette"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuARo3cCkDfR8pZPniVoyEpFMDV0MFxgI-eOVN77VZQdN7o30kZTfwXsOqeG-9e8MnneWqloUsGU7WsX8orOHeUf8UZVbzlzzwa2Ztsf5j1ts6UWEjD4hdtyM5i1UfcoXWc2cR2ERg61sWzD_paofZHFZKEa6guO5VBH1GZ56i2KImCrMjS_Mh8T7BLXY_7k6nVTNB_ckSQ0cFteVkKoegN8Wf18A9Quc6VMty2N29IFnlU5VCNMZDcB3cenyFumLGlf8Yfizl-sQ9I"
          />
        </div>
      </div>
    </section>
  );
}

// ─── Comparison Table ─────────────────────────────────────────────────────────
function ComparisonTable() {
  return (
    <section className="py-32 px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-[#dce2f6]">
          Better for your wallet.<br />Better for your home.
        </h2>

        <div className="overflow-x-auto pb-8">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr>
                <th className="py-8 px-6 text-sm font-medium uppercase tracking-widest text-[#cec2d5] w-1/3">Feature</th>
                <th className="py-8 px-6 text-2xl font-extrabold text-[#dbb8ff] text-center w-[22%] bg-[#8b4bcf]/10 border-x border-t border-[#8b4bcf]/20 rounded-t-3xl relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#dbb8ff] text-[#480082] text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-full shadow-[0_0_15px_rgba(219,184,255,0.5)] whitespace-nowrap">
                    Best Choice
                  </div>
                  Psalmix
                </th>
                <th className="py-8 px-6 text-lg font-bold text-[#cec2d5]/60 text-center w-[22%]">Spotify</th>
                <th className="py-8 px-6 text-lg font-bold text-[#cec2d5]/60 text-center w-[22%]">Apple Music</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4c4452]/10">
              {[
                { label: "Monthly Cost", psalmix: "$7.99", spotify: "$10.99", apple: "$10.99" },
                { label: "Review Method", psalmix: <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#dbb8ff]/20 text-[#dbb8ff] text-xs rounded-full font-bold uppercase"><ShieldCheck size={14} /> Human</span>, spotify: "Automated", apple: "Automated" },
                { label: "Genres", psalmix: "20+ Curated", spotify: "All", apple: "All" },
                { label: "Family Safe", psalmix: <CheckCircle2 className="w-8 h-8 mx-auto text-[#dbb8ff]" />, spotify: <XCircle className="w-6 h-6 mx-auto text-[#cec2d5]/40" />, apple: <XCircle className="w-6 h-6 mx-auto text-[#cec2d5]/40" /> },
                { label: "No Ads", psalmix: <CheckCircle2 className="w-8 h-8 mx-auto text-[#dbb8ff]" />, spotify: <CheckCircle2 className="w-6 h-6 mx-auto text-[#cec2d5]/60" />, apple: <CheckCircle2 className="w-6 h-6 mx-auto text-[#cec2d5]/60" />, last: true },
              ].map(({ label, psalmix, spotify, apple, last }) => (
                <tr key={label}>
                  <td className={`py-6 px-6 font-semibold text-lg text-[#dce2f6] ${last ? "border-b-0" : ""}`}>{label}</td>
                  <td className={`py-6 px-6 text-center bg-[#8b4bcf]/10 border-x ${last ? "border-b-0 rounded-b-3xl border-b" : ""} border-[#8b4bcf]/20`}>{psalmix}</td>
                  <td className={`py-6 px-6 text-center text-[#cec2d5]/60 ${last ? "border-b-0" : ""}`}>{spotify}</td>
                  <td className={`py-6 px-6 text-center text-[#cec2d5]/60 ${last ? "border-b-0" : ""}`}>{apple}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ─── Founding Family ───────────────────────────────────────────────────────────
function FoundingFamily() {
  return (
    <section className="py-32 px-8 bg-gradient-to-br from-[#0c1321] to-[#251b36] relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
        <div className="space-y-4">
          <h2 className="text-4xl font-extrabold text-[#dce2f6]">Become a Founding Family</h2>
          <p className="text-[#cec2d5] max-w-2xl mx-auto text-lg">Early members get permanent price locking and exclusive access to the Psalmix roadmap.</p>
        </div>

        {/* Progress card */}
        <div className="bg-[#232a39]/30 p-8 rounded-3xl border border-[#8b4bcf]/20 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-[#dbb8ff] uppercase tracking-widest">Spots Remaining</span>
            <span className="text-3xl font-black text-[#dce2f6]">88 <span className="text-lg text-[#cec2d5] font-medium">/ 500</span></span>
          </div>
          <div className="w-full h-4 bg-[#0c1321] rounded-full overflow-hidden border border-[#4c4452]/20 p-1">
            <div className="h-full bg-gradient-to-r from-[#8b4bcf] to-[#4cd7f6] rounded-full" style={{ width: '82.4%' }}></div>
          </div>
          <p className="mt-4 text-sm text-[#cec2d5]">412 spots claimed by families like yours.</p>
        </div>

        {/* Perks grid */}
        <div className="grid sm:grid-cols-2 gap-6 text-left">
          {[
            { icon: Star, text: "Lifetime Price Lock of $7.99/mo" },
            { icon: Users, text: "Exclusive Founding Member Badge" },
            { icon: BadgeCheck, text: "Beta Access to New Features" },
            { icon: MessageSquare, text: "Direct Feedback Channel to Founder" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-start gap-4 p-5 rounded-2xl bg-[#19202e]/50 border border-[#4c4452]/10 hover:bg-[#19202e] transition-colors"
            >
              <Icon className="w-6 h-6 text-[#4cd7f6] flex-shrink-0" />
              <p className="font-semibold text-[#dce2f6]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Guarantee ─────────────────────────────────────────────────────────────────
function Guarantee() {
  return (
    <section className="py-24 px-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {[
          { icon: Ban, color: "#dbb8ff", title: "Cancel Anytime" },
          { icon: UserSearch, color: "#4cd7f6", title: "Human-Reviewed" },
          { icon: Lock, color: "#f2bf5c", title: "Founding Price" },
        ].map(({ icon: Icon, color, title }) => (
          <div
            key={title}
            className="p-8 bg-[#151c2a] rounded-3xl flex items-center gap-6 border border-[#4c4452]/10 hover:bg-[#19202e] transition-colors"
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}10`, color }}>
              <Icon className="w-7 h-7" />
            </div>
            <h5 className="font-bold text-lg text-[#dce2f6]">{title}</h5>
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
    <div className="border-b border-[#4c4452]/20 pb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-6 text-left font-bold text-lg hover:text-[#dbb8ff] transition-colors group"
      >
        <span>{question}</span>
        <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#dbb8ff]" : "text-[#cec2d5]"}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-40 opacity-100 mb-6" : "max-h-0 opacity-0"}`}>
        <p className="text-[#cec2d5] text-lg leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

function FAQ() {
  const faqs = [
    { q: "When does Psalmix launch?", a: "We are currently in beta and plan to launch publicly later this year. Founding families get immediate access." },
    { q: "How much does it cost?", a: "The founding family price is locked in at $7.99/mo for life. The regular price will be higher upon public launch." },
    { q: "Is the music quality high?", a: "Yes, we stream at high bitrates comparable to other major streaming services to ensure a premium listening experience." },
    { q: "Is it only Christian music?", a: "No! We offer over 20 curated genres including Pop, Lo-Fi, Classical, and more. All songs are human-reviewed for safety, regardless of genre." },
    { q: "How do you ensure safety?", a: "Every single track and album cover on our platform is listened to and reviewed by a real human. We don't rely on automated 'clean' tags from record labels." },
  ];

  return (
    <section className="py-32 px-8 bg-[#070e1c]">
      <div className="max-w-3xl mx-auto space-y-12">
        <h2 className="text-4xl font-extrabold text-center text-[#dce2f6]">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ─────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section className="py-40 px-8 relative">
      <div className="absolute inset-0 bg-[#8b4bcf]/5 rounded-t-[100px] pointer-events-none"></div>
      <div className="max-w-4xl mx-auto text-center space-y-12">
        <div className="space-y-6">
          <h2 className="text-5xl md:text-6xl font-black leading-tight text-[#dce2f6]">
            Ready to join? <br /> <span className="text-[#4cd7f6]">88 spots remaining.</span>
          </h2>
          <p className="text-[#cec2d5] text-xl">Lock in your founding price and secure your family's musical future today.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <input
            className="bg-[#232a39] border border-[#4c4452]/30 rounded-full px-8 py-5 text-lg w-full max-w-sm focus:ring-2 focus:ring-[#dbb8ff] outline-none transition-all text-[#dce2f6] placeholder:text-[#cec2d5]/50"
            placeholder="your@email.com"
            type="email"
          />
          <button className="bg-[#dbb8ff] text-[#480082] px-10 py-5 rounded-full font-black text-lg hover:bg-[#dbb8ff]/90 hover:shadow-[0_0_30px_rgba(219,184,255,0.4)] hover:-translate-y-1 transition-all duration-300 active:scale-95">
            Save My Spot
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="w-full py-12 mt-24 border-t border-[#4c4452]/20 bg-[#0c1321]">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-lg font-bold text-[#dce2f6]">Psalmix</div>
        <p className="text-sm text-[#cec2d5] text-center md:text-left">© 2024 Psalmix. Elevating the digital editorial experience.</p>
        <div className="flex gap-8">
          <a className="text-[#cec2d5] hover:text-[#4cd7f6] transition-colors text-sm font-medium" href="#">Twitter</a>
          <a className="text-[#cec2d5] hover:text-[#4cd7f6] transition-colors text-sm font-medium" href="#">Instagram</a>
          <a className="text-[#cec2d5] hover:text-[#4cd7f6] transition-colors text-sm font-medium" href="#">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}

// ─── Sticky CTA ───────────────────────────────────────────────────────────────
function StickyCTA() {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 md:px-0">
      <div className="bg-[#2e3544]/90 backdrop-blur-xl p-1.5 rounded-full shadow-2xl flex items-center justify-between border border-[#4c4452]/30">
        <div className="flex items-center gap-2 pl-5">
          <Sparkles className="w-4 h-4 text-[#4cd7f6]" />
          <span className="text-[#dce2f6] font-black text-sm uppercase tracking-tighter">88 spots left</span>
        </div>
        <button className="bg-[#dbb8ff] text-[#480082] px-6 py-3 rounded-full font-bold text-sm hover:bg-[#dbb8ff]/90 hover:shadow-[0_0_20px_rgba(219,184,255,0.4)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300">
          Save My Spot
        </button>
      </div>
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────────
function HomeInner() {
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 700);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#0c1321] text-[#dce2f6] font-['Inter',sans-serif] selection:bg-[#dbb8ff]/30 selection:text-[#efdbff] min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <FounderStory />
        <ProblemSection />
        <SolutionSection />
        <ComparisonTable />
        <FoundingFamily />
        <Guarantee />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      {showSticky && <StickyCTA />}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0c1321] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#dbb8ff] border-t-transparent rounded-full animate-spin" /></div>}>
      <HomeInner />
    </Suspense>
  );
}