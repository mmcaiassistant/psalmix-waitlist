export type RewardTier = {
  referrals: number;
  reward: string;
  badge: string;
};

export const REWARD_TIERS: RewardTier[] = [
  {
    referrals: 3,
    reward: "Beta access before public launch",
    badge: "Beta Insider",
  },
  {
    referrals: 10,
    reward: "Founding Family status (50% off forever)",
    badge: "Founding Family",
  },
  {
    referrals: 25,
    reward: "Golden Ticket to give away",
    badge: "Golden Ticket",
  },
  {
    referrals: 50,
    reward: "Lifetime FREE subscription",
    badge: "Lifetime Listener",
  },
];

export function getEarnedRewards(referrals: number) {
  return REWARD_TIERS.filter((tier) => referrals >= tier.referrals);
}

export function getNextRewardTier(referrals: number) {
  return REWARD_TIERS.find((tier) => referrals < tier.referrals) || null;
}

export function getProgressToNextTier(referrals: number) {
  const nextTier = getNextRewardTier(referrals);
  if (!nextTier) {
    return {
      nextTier: null,
      percent: 100,
      current: referrals,
      required: referrals,
    };
  }

  const previousTier =
    [...REWARD_TIERS]
      .reverse()
      .find((tier) => referrals >= tier.referrals) ||
    ({ referrals: 0 } as RewardTier);

  const required = nextTier.referrals - previousTier.referrals;
  const current = Math.max(0, referrals - previousTier.referrals);
  const percent = Math.min(100, Math.round((current / required) * 100));

  return { nextTier, percent, current, required };
}
