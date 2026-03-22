import { getProgressToNextTier } from "@/lib/rewards";

type RewardProgressProps = {
  referrals: number;
};

export default function RewardProgress({ referrals }: RewardProgressProps) {
  const progress = getProgressToNextTier(referrals);

  if (!progress.nextTier) {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-900">
        <p className="text-sm font-semibold">All rewards unlocked 🎉</p>
        <p className="text-xs text-emerald-700">
          You&apos;re at the top tier—thank you for sharing the PsalMix love.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
      <div className="flex items-center justify-between text-sm font-semibold text-amber-900">
        <span>Next reward: {progress.nextTier.badge}</span>
        <span>
          {progress.current}/{progress.required} referrals
        </span>
      </div>
      <div className="mt-3 h-3 w-full rounded-full bg-white">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-amber-400 to-rose-400"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-amber-700">
        Unlock “{progress.nextTier.reward}” at {progress.nextTier.referrals} total
        referrals.
      </p>
    </div>
  );
}
