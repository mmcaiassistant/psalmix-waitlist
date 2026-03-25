"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Download, Smartphone, Laptop, Globe } from "lucide-react";

interface HeroSectionProps {
  displayCount: number | null;
  SignupForm: React.ComponentType<{ variant: "hero" | "footer" }>;
  Icons: {
    sparkles: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    users: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  };
  CustomIcon: React.ComponentType<{ name: string; size?: number }>;
}

// ─── Animated waveform ────────────────────────────────────────────────────────
function HeroWaveform() {
  const bars = [0.4, 0.7, 1, 0.6, 0.85, 0.5, 0.75, 0.9, 0.55, 0.65, 0.8, 0.45, 0.7, 0.6];
  return (
    <div className="flex items-end gap-[3px] h-12 opacity-40">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full"
          style={{ 
            originY: 1, 
            background: 'linear-gradient(to top, #5b21b6, #8B4BCF, #06B6D4)' 
          }}
          animate={{ scaleY: [h, h * 0.3, h * 1.2, h * 0.5, h] }}
          transition={{ 
            duration: 2 + (i % 4) * 0.3, 
            repeat: Infinity, 
            ease: 'easeInOut', 
            delay: i * 0.1 
          }}
          initial={{ scaleY: h }}
        />
      ))}
    </div>
  );
}

// ─── Feature pills ────────────────────────────────────────────────────────────
const heroPills = [
  { icon: ShieldCheck, label: 'Human Reviewed' },
  { icon: Download, label: 'Offline Ready' },
  { icon: Smartphone, label: 'Any Device' },
];

export function HeroSection({
  displayCount,
  SignupForm,
}: HeroSectionProps) {
  return (
    <section className="relative pt-24 pb-28 overflow-hidden">
      {/* Hide chat widgets */}
      <style
        dangerouslySetInnerHTML={{
          __html: `.intercom-lightweight-app, #crisp-chatbox, [data-id="zsiq_float"], .zopim { display: none !important; }`,
        }}
      />

      {/* Very subtle ambient depth — invisible, just felt */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent pointer-events-none" />

      {/* Animated waveform background */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 z-0">
        <HeroWaveform />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">

        {/* Floating pill badges with icons */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {heroPills.map((pill, i) => (
            <motion.div
              key={pill.label}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
            >
              <pill.icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-white">{pill.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Pill badge — clean */}
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            First 500 Families · 50% Off Forever
          </span>
        </div>

        {/* Headline */}
        <motion.h1 
          className="text-5xl md:text-7xl font-black leading-[1.08] tracking-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Family-Safe Music.{" "}
          <em className="not-italic text-primary">Finally.</em>
        </motion.h1>

        {/* Subheadline — short, direct, two claims */}
        <motion.p 
          className="text-lg md:text-xl text-text-secondary mb-10 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Every song verified safe by real humans. Half the price of Spotify.
        </motion.p>

        {/* Signup Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <SignupForm variant="hero" />
        </motion.div>

        {/* Waitlist count — minimal, only when meaningful */}
        {displayCount !== null && displayCount >= 50 && (
          <p className="mt-8 text-sm text-text-secondary">
            <span className="text-white font-semibold">{displayCount.toLocaleString()} families</span> already on the waitlist
          </p>
        )}

        {/* Platform row — quiet, no clutter */}
        <div className="mt-10 flex flex-wrap justify-center items-center gap-6 text-sm text-text-secondary/60">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <span>iOS</span>
          </div>
          <span className="text-text-secondary/20">·</span>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="m12.954 11.616 2.957-2.957L6.36 3.291c-.633-.342-1.226-.39-1.683-.122l8.277 8.447Zm3.356 3.356 3.617-1.958c.526-.292.526-.768 0-1.06l-3.617-1.879-3.162 3.162 3.162 1.735Zm-9.7 4.061c.457.268 1.05.22 1.683-.122l9.516-5.163-3.086-3.086-8.113 8.371ZM3.678 4.701C3.456 5.049 3.333 5.5 3.333 6.02v11.96c0 .52.123.97.345 1.318l7.657-7.657-7.657-7.94Z" />
            </svg>
            <span>Android</span>
          </div>
          <span className="text-text-secondary/20">·</span>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>Web</span>
          </div>
          <span className="text-text-secondary/20">·</span>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Secure</span>
          </div>
        </div>

      </div>
    </section>
  );
}
