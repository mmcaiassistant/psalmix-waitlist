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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-rose-50 px-6 py-12 text-amber-950">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="rounded-3xl bg-white/90 p-8 shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">
            Referral Dashboard
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Your PsalMix progress
          </h1>
          <p className="mt-2 text-sm text-amber-700">
            Track your position, referrals, and rewards anytime.
          </p>
        </header>

        {loading ? (
          <p className="text-sm text-amber-700">Loading your dashboard…</p>
        ) : fetchError ? (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-6 text-center text-rose-700">
            <p className="font-semibold">Could not load your dashboard.</p>
            <p className="text-sm mt-1">
              The link may be invalid, or there was a server error. Please try again or re-join at{" "}
              <a href="/" className="underline">psalmix.com</a>.
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
          <div className="rounded-3xl border border-amber-100 bg-white/90 p-6 shadow-sm">
            <h2 className="text-xl font-bold">Move up the list</h2>
            <p className="mt-2 text-sm text-amber-700">
              Each friend who joins through your link bumps you forward. 3 referrals = beta access. You&apos;re one share away.
            </p>
            <div className="mt-4 flex flex-col gap-4">
              <ReferralLink url={shareUrl} />
              <ShareButtons url={shareUrl} onShare={trackShare} />
            </div>
          </div>
          <div className="rounded-3xl border border-amber-100 bg-white/90 p-6 shadow-sm">
            <h2 className="text-xl font-bold">Next reward</h2>
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
