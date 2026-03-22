import { RewardTier as RewardTierType } from "@/lib/rewards";

type RewardTierProps = {
  tier: RewardTierType;
  isUnlocked: boolean;
};

export default function RewardTier({ tier, isUnlocked }: RewardTierProps) {
  return (
    <div
      className={`rounded-2xl border p-4 transition ${
        isUnlocked
          ? "border-emerald-200 bg-emerald-50"
          : "border-amber-100 bg-white/80"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-amber-900">
            {tier.badge}
          </p>
          <p className="text-xs text-amber-700">{tier.reward}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isUnlocked
              ? "bg-emerald-500 text-white"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {tier.referrals} referrals
        </span>
      </div>
      <p className="mt-3 text-xs text-amber-700">
        {isUnlocked ? "Unlocked 🎉" : "Keep sharing to unlock"}
      </p>
    </div>
  );
}
