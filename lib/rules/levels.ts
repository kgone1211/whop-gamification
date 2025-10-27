/**
 * Level Calculation System
 * 
 * Implements a logarithmic curve for level progression:
 * level = floor((points / 100) ^ 0.8) + 1
 * 
 * This creates a smooth progression where early levels are quick,
 * but higher levels require exponentially more points.
 */

export function calculateLevel(points: number): number {
  if (points <= 0) return 1;
  return Math.floor(Math.pow(points / 100, 0.8)) + 1;
}

export function getPointsForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.ceil(Math.pow(level - 1, 1.25) * 100);
}

export function getPointsToNextLevel(currentPoints: number): number {
  const currentLevel = calculateLevel(currentPoints);
  const nextLevelPoints = getPointsForLevel(currentLevel + 1);
  return nextLevelPoints - currentPoints;
}

export function getLevelProgress(currentPoints: number): number {
  const currentLevel = calculateLevel(currentPoints);
  const currentLevelPoints = getPointsForLevel(currentLevel);
  const nextLevelPoints = getPointsForLevel(currentLevel + 1);
  
  const pointsIntoLevel = currentPoints - currentLevelPoints;
  const pointsNeeded = nextLevelPoints - currentLevelPoints;
  
  return Math.floor((pointsIntoLevel / pointsNeeded) * 100);
}

/**
 * Generate level milestones for display
 */
export function getLevelMilestones(): Array<{ level: number; points: number }> {
  return [1, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100].map((level) => ({
    level,
    points: getPointsForLevel(level),
  }));
}
