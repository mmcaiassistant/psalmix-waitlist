"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function WelcomeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Staggered entrance — let CSS transitions fire after mount
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const shareUrl = "https://psalmix-waitlist.vercel.app";
  const shareText = "I just joined the Psalmix waitlist — family-safe music that actually sounds good. Check it out:";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // silently fail
    }
  };

  return (
    <div className="relative min-h-screen bg-[#111826] flex flex-col items-center justify-center px-6 py-16 overflow-hidden">

      {/* Deep radial glow — strong purple center, cyan accent corners */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(139,75,207,0.35) 0%, transparent 65%), " +
            "radial-gradient(ellipse 50% 40% at 85% 10%, rgba(6,182,212,0.20) 0%, transparent 55%), " +
            "radial-gradient(ellipse 40% 30% at 15% 85%, rgba(139,75,207,0.15) 0%, transparent 60%)",
        }}
      />

      {/* Subtle noise grain texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* Logo wordmark */}
      <div
        className="relative z-10 mb-12 flex items-center gap-2.5"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #8B4BCF, #06B6D4)" }}>
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </div>
        <span className="text-white font-black text-xl tracking-tight">Psalmix</span>
      </div>

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md text-center">

        {/* Checkmark — glowing ring, purple→cyan gradient stroke */}
        <div
          className="mx-auto mb-7"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "scale(1)" : "scale(0.7)",
            transition: "opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            transitionDelay: "0.05s",
          }}
        >
          <div
            className="w-24 h-24 mx-auto rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(139,75,207,0.25), rgba(6,182,212,0.15))",
              border: "2px solid transparent",
              backgroundClip: "padding-box",
              boxShadow: "0 0 0 1px rgba(139,75,207,0.4), 0 0 60px rgba(139,75,207,0.25), 0 0 120px rgba(6,182,212,0.08)",
            }}
          >
            <svg
              className="w-12 h-12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="url(#checkGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <defs>
                <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B4BCF" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1
          className="text-5xl sm:text-6xl font-black mb-4 leading-tight"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            transitionDelay: "0.15s",
          }}
        >
          <span className="text-white">You&apos;re </span>
          <span style={{
            background: "linear-gradient(135deg, #8B4BCF 0%, #A66BD9 40%, #06B6D4 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>in!</span>
        </h1>

        {/* Primary subtext */}
        <p
          className="text-white/80 text-lg mb-2 font-medium"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            transitionDelay: "0.25s",
          }}
        >
          {email ? (
            <>We&apos;ll email <span className="text-white font-semibold">{email}</span> when beta opens.</>
          ) : (
            <>You&apos;re on the list. We&apos;ll reach out when beta opens.</>
          )}
        </p>

        {/* Secondary subtext */}
        <p
          className="text-slate-500 text-sm mb-10"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            transitionDelay: "0.3s",
          }}
        >
          Beta opens <span className="text-[#06B6D4] font-semibold">April 15, 2026</span> — early joiners get first access.
        </p>

        {/* Share nudge — gradient border card */}
        <div
          className="mb-8 p-[2px] rounded-2xl"
          style={{
            background: "linear-gradient(135deg, #8B4BCF 0%, #06B6D4 100%)",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            transitionDelay: "0.38s",
          }}
        >
        <div className="rounded-2xl bg-[#1a2235] p-6">
          <p className="text-white font-semibold mb-1 text-sm">Know a family who&apos;d love this?</p>
          <p className="text-slate-500 text-xs mb-4">Share Psalmix — the more families join, the faster we build.</p>
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Copy link — primary action, filled purple */}
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #8B4BCF, #7B3BBF)" }}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  Copy link
                </>
              )}
            </button>

            {/* Share on X */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#06B6D4]/40 bg-[#06B6D4]/5 text-[#06B6D4] text-sm font-medium hover:bg-[#06B6D4]/10 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              Share on X
            </a>
          </div>
        </div>
        </div>

        {/* Back link */}
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#8B4BCF] transition-colors"
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.5s ease",
            transitionDelay: "0.45s",
          }}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          Back to Psalmix
        </a>
      </div>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#111826] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#8B4BCF] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <WelcomeContent />
    </Suspense>
  );
}
