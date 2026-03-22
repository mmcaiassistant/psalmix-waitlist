export const MOVE_PER_REFERRAL = 2;

export type PositionStats = {
  initialPosition: number;
  currentPosition: number;
  movedUpBy: number;
  peopleAhead: number;
};

export function calculatePosition(
  initialPosition: number,
  referrals: number,
  movePerReferral: number = MOVE_PER_REFERRAL
): PositionStats {
  const movedUpBy = Math.max(0, referrals * movePerReferral);
  const currentPosition = Math.max(1, initialPosition - movedUpBy);
  return {
    initialPosition,
    currentPosition,
    movedUpBy,
    peopleAhead: Math.max(0, currentPosition - 1),
  };
}
