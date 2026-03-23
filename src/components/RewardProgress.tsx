import { getProgressToNextTier } from "@/lib/rewards";

type RewardProgressProps = {
  referrals: number;
};

export default function RewardProgress({ referrals }: RewardProgressProps) {
  const progress = getProgressToNextTier(referrals);

  if (!progress.nextTier) {
    return (
      <div className="rounded-2xl border border-[#8B4BCF]/40 bg-[#8B4BCF]/10 p-4 text-white">
        <p className="text-sm font-semibold">All rewards unlocked</p>
        <p className="text-xs text-slate-400">
          You&apos;re at the top tier — thank you for sharing the Psalmix love.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between text-sm font-semibold text-white">
        <span>Next reward: {progress.nextTier.badge}</span>
        <span className="text-slate-400">
          {progress.current}/{progress.required} referrals
        </span>
      </div>
      <div className="mt-3 h-3 w-full rounded-full bg-white/10">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-[#8B4BCF] to-[#06B6D4]"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Unlock &ldquo;{progress.nextTier.reward}&rdquo; at {progress.nextTier.referrals} total
        referrals.
      </p>
    </div>
  );
}
