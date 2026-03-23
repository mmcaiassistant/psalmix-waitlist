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
          ? "border-[#8B4BCF]/40 bg-[#8B4BCF]/10"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">
            {tier.badge}
          </p>
          <p className="text-xs text-slate-400">{tier.reward}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${
            isUnlocked
              ? "bg-[#8B4BCF] text-white"
              : "bg-white/10 text-slate-400"
          }`}
        >
          {tier.referrals} referrals
        </span>
      </div>
      <p className="mt-3 text-xs text-slate-400">
        {isUnlocked ? "Unlocked" : "Keep sharing to unlock"}
      </p>
    </div>
  );
}
