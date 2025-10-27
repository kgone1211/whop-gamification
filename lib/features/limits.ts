import { Role } from '@prisma/client';

/**
 * Feature Limits by Role
 * 
 * Defines what each role can and cannot do
 */

export const FEATURE_LIMITS = {
  FREE: {
    maxPointsPerDay: 100,
    maxBadges: 3,
    leaderboardView: 'top10', // Can only see top 10
    canEarnStreaks: false,
    canUnlockContent: false,
    canEarnPremiumBadges: false,
    levelCap: 5, // Max level 5
  },
  MEMBER: {
    maxPointsPerDay: Infinity,
    maxBadges: Infinity,
    leaderboardView: 'full',
    canEarnStreaks: true,
    canUnlockContent: true,
    canEarnPremiumBadges: true,
    levelCap: Infinity,
  },
  COACH: {
    maxPointsPerDay: Infinity,
    maxBadges: Infinity,
    leaderboardView: 'full',
    canEarnStreaks: true,
    canUnlockContent: true,
    canEarnPremiumBadges: true,
    levelCap: Infinity,
  },
  OWNER: {
    maxPointsPerDay: Infinity,
    maxBadges: Infinity,
    leaderboardView: 'full',
    canEarnStreaks: true,
    canUnlockContent: true,
    canEarnPremiumBadges: true,
    levelCap: Infinity,
  },
};

/**
 * Check if user can earn points
 */
export function canEarnPoints(
  role: Role,
  currentDailyPoints: number
): boolean {
  const limit = FEATURE_LIMITS[role].maxPointsPerDay;
  return currentDailyPoints < limit;
}

/**
 * Check if user can earn a specific badge
 */
export function canEarnBadge(
  role: Role,
  currentBadgeCount: number,
  isPremiumBadge: boolean
): boolean {
  // Check badge count limit
  if (currentBadgeCount >= FEATURE_LIMITS[role].maxBadges) {
    return false;
  }

  // Check if premium badge is allowed
  if (isPremiumBadge && !FEATURE_LIMITS[role].canEarnPremiumBadges) {
    return false;
  }

  return true;
}

/**
 * Check if user can level up
 */
export function canLevelUp(role: Role, currentLevel: number): boolean {
  return currentLevel < FEATURE_LIMITS[role].levelCap;
}

/**
 * Get upgrade message for limited features
 */
export function getUpgradeMessage(role: Role, feature: string): string | null {
  if (role !== 'FREE') return null;

  const messages: Record<string, string> = {
    points: `Free users can earn up to ${FEATURE_LIMITS.FREE.maxPointsPerDay} points per day. Upgrade for unlimited points!`,
    badges: `Free users can unlock ${FEATURE_LIMITS.FREE.maxBadges} badges. Upgrade to collect them all!`,
    leaderboard: 'Upgrade to see the full leaderboard and compete with everyone!',
    streaks: 'Unlock streak bonuses with Premium!',
    levels: `Free users can reach level ${FEATURE_LIMITS.FREE.levelCap}. Upgrade to unlock higher levels!`,
    content: 'Upgrade to unlock premium content and courses!',
  };

  return messages[feature] || 'Upgrade to Premium for full access!';
}

/**
 * Check what features are locked for a role
 */
export function getLockedFeatures(role: Role): string[] {
  if (role !== 'FREE') return [];

  return [
    'Unlimited points',
    'Full leaderboard',
    'All badges',
    'Streak bonuses',
    'Level 6+',
    'Content unlocks',
    'Premium badges',
  ];
}
