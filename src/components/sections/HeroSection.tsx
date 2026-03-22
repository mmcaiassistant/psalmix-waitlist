"use client";

import React from "react";

interface HeroSectionProps {
  displayCount: number | null;
  referralCode?: string;
  SignupForm: React.ComponentType<{ variant: "hero" | "footer"; referralCode?: string }>;
  Icons: {
    sparkles: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    users: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  };
  CustomIcon: React.ComponentType<{ name: string; size?: number }>;
}

export function HeroSection({
  displayCount,
  referralCode,
  SignupForm,
  Icons,
  CustomIcon: _CustomIcon,
}: HeroSectionProps) {
  return (
    <section className="relative pt-20 pb-24 overflow-hidden">
      {/* Hide chat widgets */}
      <style
        dangerouslySetInnerHTML={{
          __html: `.intercom-lightweight-app, #crisp-chatbox, [data-id="zsiq_float"], .zopim { display: none !important; }`,
        }}
      />

      {/* Ambient glow blobs */}
      <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        {/* Urgency Banner — "Free Beta · April 15" only (NO spot count) */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-primary/20 border border-primary/40 shadow-[0_0_20px_rgba(124,59,237,0.3)] mb-8">
          {/* Pulsing amber dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
          </span>
          <Icons.sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Free Beta · April 15
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-6 max-w-4xl mx-auto">
          Family-Safe Music.{" "}
          <span className="bg-gradient-to-r from-primary via-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Finally.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-text-secondary mb-6 max-w-2xl mx-auto [text-wrap:balance]">
          Every song human-verified. Every genre covered. So you can just&hellip; press play.
        </p>

        {/* Signup Form */}
        <SignupForm variant="hero" referralCode={referralCode} />

        {/* Count Badge — spot count lives HERE only */}
        {displayCount !== null && displayCount >= 50 ? (
          <div className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-surface/50 border border-primary/30 shadow-[0_0_20px_rgba(124,59,237,0.2)]">
            <Icons.users className="w-5 h-5 text-primary" />
            <span className="text-white font-bold">
              {displayCount.toLocaleString()}{" "}
              {displayCount === 1 ? "family" : "families"}
            </span>
            <span className="text-text-secondary">already on the waitlist</span>
          </div>
        ) : (
          <div className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-surface/50 border border-primary/30 shadow-[0_0_20px_rgba(124,59,237,0.2)]">
            <Icons.sparkles className="w-5 h-5 text-primary" />
            <span className="text-white font-bold">
              500 founding spots — first come, first served
            </span>
          </div>
        )}

        {/* Platform Icons — ALL same color, ✓ Secure with checkmark */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-6 md:gap-8 text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <span>iOS</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.523 2.226a.75.75 0 0 0-1.046 0l-3.796 3.97-1.927-2.014a.75.75 0 0 0-1.085 0l-6.87 7.18a.75.75 0 0 0 0 1.035l1.927 2.014L.93 18.382a.75.75 0 0 0 0 1.035l3.796 3.97a.75.75 0 0 0 1.085 0l3.796-3.97 1.927 2.014a.75.75 0 0 0 1.085 0l6.87-7.18a.75.75 0 0 0 0-1.035l-1.927-2.014 3.796-3.97a.75.75 0 0 0 0-1.035l-3.835-4.007z" />
            </svg>
            <span>Android</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>Web</span>
          </div>
          {/* ✓ Secure — same color as siblings, checkmark prefix instead of green */}
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>✓ Secure</span>
          </div>
        </div>
      </div>
    </section>
  );
}
