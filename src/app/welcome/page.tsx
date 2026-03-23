"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PositionDisplay from "@/components/PositionDisplay";
import ReferralLink from "@/components/ReferralLink";
import ShareButtons from "@/components/ShareButtons";
import RewardTier from "@/components/RewardTier";
import RewardProgress from "@/components/RewardProgress";
import { REWARD_TIERS } from "@/lib/rewards";

const Celebration = () => (
  <div className="relative flex items-center justify-center">
    <motion.div
      animate={{ scale: [1, 1.1, 1], rotate: [0, 6, -6, 0] }}
      transition={{ duration: 1.6, repeat: Infinity }}
      className="text-5xl"
    >
      🎉
    </motion.div>
    <motion.span
      className="absolute -left-8 -top-4 h-3 w-3 rounded-full bg-amber-400"
      animate={{ y: [-4, -16], opacity: [0, 1, 0] }}
      transition={{ duration: 1.4, repeat: Infinity }}
    />
    <motion.span
      className="absolute right-6 -top-6 h-2 w-2 rounded-full bg-rose-400"
      animate={{ y: [-2, -18], opacity: [0, 1, 0] }}
      transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
    />
    <motion.span
      className="absolute -right-10 -bottom-4 h-3 w-3 rounded-full bg-emerald-400"
      animate={{ y: [2, -14], opacity: [0, 1, 0] }}
      transition={{ duration: 1.6, repeat: Infinity, delay: 0.4 }}
    />
  </div>
);

type UserStats = {
  referralCode: string;
  referrals: number;
  position: number;
  peopleAhead: number;
};

export default function WelcomePage() {
  const [data, setData] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    const params = new URLSearchParams(window.location.search);
    const c = params.get("code") || "";
    setCode(c);
    // Persist code in localStorage so the user can always return to their dashboard
    if (c) {
      try {
        localStorage.setItem("psalmix_referral_code", c);
      } catch {
        // storage blocked — not critical
      }
    }
  }, []);

  useEffect(() => {
    if (!code) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/user/${code}`);
        if (!res.ok) throw new Error("Failed to fetch stats");
        const json = await res.json();
        setData(json);
      } catch {
        // non-critical — show dashboard without live stats
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [code]);

  const shareUrl = `${origin}/?ref=${data?.referralCode || code}`;

  const trackShare = async (channel: string) => {
    if (!data?.referralCode && !code) return;
    try {
      await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referralCode: data?.referralCode || code,
          channel,
        }),
      });
    } catch {
      // share tracking is non-critical — silently ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#111826] px-6 py-12 text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        {/* Header */}
        <div className="text-center pt-4 pb-2">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#8B4BCF]/30 bg-[#8B4BCF]/10 mb-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#8B4BCF]">
              Psalmix Waitlist
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-3">You&apos;re in!</h1>
          <p className="text-slate-400 text-lg">Share your link to move up the line and unlock rewards.</p>
        </div>

        <section className="rounded-2xl bg-[#1C2333] border border-white/10 p-8">
          {loading ? (
            <p className="text-slate-400 text-sm">Loading your stats…</p>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 mb-6">
                <PositionDisplay label="Your position" value={data?.position ?? 0} prefix="#" />
                <PositionDisplay
                  label={data?.peopleAhead === 1 ? "Person ahead of you" : "People ahead of you"}
                  value={data?.peopleAhead ?? 0}
                />
              </div>
              {code && (
                <p className="text-xs text-slate-500 mb-6">
                  Bookmark this page or{" "}
                  <a
                    href={`/dashboard/${code}`}
                    className="text-[#8B4BCF] underline font-semibold hover:text-[#A66BD9] transition-colors"
                  >
                    visit your dashboard anytime
                  </a>{" "}
                  using your unique link.
                </p>
              )}
            </>
          )}

          <div className="flex flex-col gap-4">
            <ReferralLink url={shareUrl} />
            <ShareButtons url={shareUrl} onShare={trackShare} />
          </div>
        </section>

        <section className="rounded-2xl bg-[#1C2333] border border-white/10 p-8">
          <h2 className="text-2xl font-bold mb-2">Referral rewards</h2>
          <p className="text-slate-400 text-sm mb-5">
            Each referral moves you closer to exclusive perks.
          </p>
          <div className="mb-6">
            <RewardProgress referrals={data?.referrals ?? 0} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {REWARD_TIERS.map((tier) => (
              <RewardTier
                key={tier.badge}
                tier={tier}
                isUnlocked={(data?.referrals ?? 0) >= tier.referrals}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
