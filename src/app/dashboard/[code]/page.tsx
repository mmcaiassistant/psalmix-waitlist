"use client";

import { useEffect, useState } from "react";
import PositionDisplay from "@/components/PositionDisplay";
import RewardProgress from "@/components/RewardProgress";
import ReferralLink from "@/components/ReferralLink";
import RewardTier from "@/components/RewardTier";
import ShareButtons from "@/components/ShareButtons";
import { REWARD_TIERS } from "@/lib/rewards";

type DashboardData = {
  referralCode: string;
  referrals: number;
  position: number;
  peopleAhead: number;
};

export default function DashboardPage({
  params,
}: {
  params: { code: string };
}) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/user/${params.code}`);
        if (!res.ok) {
          setFetchError(true);
          return;
        }
        const json = await res.json();
        setData(json);
      } catch {
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [params.code]);

  const shareUrl = `${origin}/r/${data?.referralCode || params.code}`;

  const trackShare = async (channel: string) => {
    if (!data?.referralCode && !params.code) return;
    try {
      await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referralCode: data?.referralCode || params.code,
          channel,
        }),
      });
    } catch {
      // share tracking is non-critical — silently ignore failures
    }
  };

  return (
    <div className="min-h-screen bg-[#111826] px-6 py-12 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="rounded-2xl bg-[#1C2333] border border-white/10 p-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-[#8B4BCF]/30 bg-[#8B4BCF]/10 mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#8B4BCF]">
              Referral Dashboard
            </span>
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl text-white">
            Your Psalmix progress
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Track your position, referrals, and rewards anytime.
          </p>
        </header>

        {loading ? (
          <p className="text-sm text-slate-400">Loading your dashboard…</p>
        ) : fetchError ? (
          <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-6 text-center text-red-400">
            <p className="font-semibold">Could not load your dashboard.</p>
            <p className="text-sm mt-1 text-red-400/70">
              The link may be invalid, or there was a server error. Please try again or re-join at{" "}
              <a href="/" className="underline text-[#8B4BCF]">psalmix-waitlist.vercel.app</a>.
            </p>
          </div>
        ) : (
          <section className="grid gap-4 sm:grid-cols-3">
            <PositionDisplay label="Current position" value={data?.position ?? 0} prefix="#" />
            <PositionDisplay
              label={data?.peopleAhead === 1 ? "Person ahead of you" : "People ahead of you"}
              value={data?.peopleAhead ?? 0}
            />
            <PositionDisplay
              label="Total referrals"
              value={data?.referrals ?? 0}
            />
          </section>
        )}

        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-[#1C2333] p-6">
            <h2 className="text-xl font-bold text-white">Move up the list</h2>
            <p className="mt-2 text-sm text-slate-400">
              Each friend who joins through your link bumps you forward. 3 referrals = beta access. You&apos;re one share away.
            </p>
            <div className="mt-4 flex flex-col gap-4">
              <ReferralLink url={shareUrl} />
              <ShareButtons url={shareUrl} onShare={trackShare} />
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#1C2333] p-6">
            <h2 className="text-xl font-bold text-white">Next reward</h2>
            <div className="mt-4">
              <RewardProgress referrals={data?.referrals ?? 0} />
            </div>
            <div className="mt-6 grid gap-3">
              {REWARD_TIERS.map((tier) => (
                <RewardTier
                  key={tier.badge}
                  tier={tier}
                  isUnlocked={(data?.referrals ?? 0) >= tier.referrals}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
