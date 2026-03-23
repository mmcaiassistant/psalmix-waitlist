"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function WelcomeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <div className="min-h-screen bg-[#111826] px-6 py-20 text-white flex items-center justify-center">
      <div className="max-w-lg w-full text-center">
        {/* Check icon */}
        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-[#8B4BCF]/20 border border-[#8B4BCF]/40 flex items-center justify-center">
          <svg className="w-10 h-10 text-[#8B4BCF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#8B4BCF]/30 bg-[#8B4BCF]/10 mb-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#8B4BCF]">
            Psalmix Waitlist
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black mb-4">You&apos;re in!</h1>

        <p className="text-slate-400 text-lg mb-3">
          {email ? (
            <>We&apos;ll email <span className="text-white font-semibold">{email}</span> when beta opens.</>
          ) : (
            <>We&apos;ll send you an email when beta opens on April 15.</>
          )}
        </p>

        <p className="text-slate-500 text-sm mb-10">
          Beta opens <strong className="text-white">April 15, 2026</strong> — you&apos;ll be among the first to know.
        </p>

        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#8B4BCF] text-white font-semibold text-sm hover:bg-[#7B3BBF] transition-colors"
        >
          ← Back to Psalmix
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
