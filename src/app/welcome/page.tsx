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
    setCode(params.get("code") || "");
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
      } catch (error) {
        console.error(error);
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
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-rose-50 px-6 py-12 text-amber-950">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <section className="rounded-3xl bg-white/90 p-8 shadow-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">
                PsalMix Waitlist
              </p>
              <h1 className="text-3xl font-bold sm:text-4xl">
                You&apos;re in!
              </h1>
              <p className="mt-2 text-sm text-amber-700">
                Share your link to move up the line and earn sweet rewards.
              </p>
            </div>
            <Celebration />
          </div>

          {loading ? (
            <p className="mt-6 text-sm text-amber-700">Loading your stats…</p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <PositionDisplay label="Your position" value={data?.position ?? 0} prefix="#" />
              <PositionDisplay
                label="People ahead of you"
                value={data?.peopleAhead ?? 0}
              />
            </div>
          )}

          <div className="mt-8 flex flex-col gap-4">
            <ReferralLink url={shareUrl} />
            <ShareButtons url={shareUrl} onShare={trackShare} />
          </div>
        </section>

        <section className="rounded-3xl border border-amber-100 bg-white/90 p-8 shadow-sm">
          <h2 className="text-2xl font-bold">Referral rewards</h2>
          <p className="mt-2 text-sm text-amber-700">
            Each referral moves you closer to premium perks.
          </p>
          <div className="mt-5">
            <RewardProgress referrals={data?.referrals ?? 0} />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
