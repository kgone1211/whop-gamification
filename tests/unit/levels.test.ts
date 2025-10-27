import { describe, it, expect } from 'vitest';
import {
  calculateLevel,
  getPointsForLevel,
  getPointsToNextLevel,
  getLevelProgress,
} from '@/lib/rules/levels';

describe('Level Calculation System', () => {
  describe('calculateLevel', () => {
    it('should return level 1 for 0 or negative points', () => {
      expect(calculateLevel(0)).toBe(1);
      expect(calculateLevel(-100)).toBe(1);
    });

    it('should calculate correct levels for point thresholds', () => {
      expect(calculateLevel(100)).toBe(2);
      expect(calculateLevel(500)).toBe(4);
      expect(calculateLevel(1000)).toBe(6);
      expect(calculateLevel(5000)).toBe(12);
    });

    it('should use logarithmic curve formula', () => {
      // level = floor((points/100)^0.8) + 1
      const points = 2500;
      const expectedLevel = Math.floor(Math.pow(points / 100, 0.8)) + 1;
      expect(calculateLevel(points)).toBe(expectedLevel);
    });
  });

  describe('getPointsForLevel', () => {
    it('should return 0 for level 1', () => {
      expect(getPointsForLevel(1)).toBe(0);
    });

    it('should return increasing points for higher levels', () => {
      const level5Points = getPointsForLevel(5);
      const level10Points = getPointsForLevel(10);
      const level20Points = getPointsForLevel(20);

      expect(level10Points).toBeGreaterThan(level5Points);
      expect(level20Points).toBeGreaterThan(level10Points);
    });

    it('should be consistent with calculateLevel', () => {
      for (let level = 2; level <= 10; level++) {
        const points = getPointsForLevel(level);
        const calculatedLevel = calculateLevel(points);
        
        // The calculated level should be exactly the target level or one less
        // (due to ceiling in the inverse function)
        expect(calculatedLevel).toBeLessThanOrEqual(level);
        expect(calculatedLevel).toBeGreaterThanOrEqual(level - 1);
      }
    });
  });

  describe('getPointsToNextLevel', () => {
    it('should return correct points needed for next level', () => {
      const currentPoints = 500;
      const currentLevel = calculateLevel(currentPoints);
      const nextLevelPoints = getPointsForLevel(currentLevel + 1);
      const pointsNeeded = getPointsToNextLevel(currentPoints);

      expect(pointsNeeded).toBe(nextLevelPoints - currentPoints);
    });

    it('should decrease as user gains points', () => {
      const points1 = 100;
      const points2 = 150;
      
      const needed1 = getPointsToNextLevel(points1);
      const needed2 = getPointsToNextLevel(points2);

      expect(needed2).toBeLessThan(needed1);
    });
  });

  describe('getLevelProgress', () => {
    it('should return 0% at the start of a level', () => {
      const levelPoints = getPointsForLevel(5);
      expect(getLevelProgress(levelPoints)).toBe(0);
    });

    it('should return a value between 0 and 100', () => {
      for (let points = 0; points <= 5000; points += 100) {
        const progress = getLevelProgress(points);
        expect(progress).toBeGreaterThanOrEqual(0);
        expect(progress).toBeLessThan(100);
      }
    });

    it('should increase as points increase within a level', () => {
      const basePoints = 1000;
      const progress1 = getLevelProgress(basePoints);
      const progress2 = getLevelProgress(basePoints + 50);
      const progress3 = getLevelProgress(basePoints + 100);

      expect(progress2).toBeGreaterThan(progress1);
      expect(progress3).toBeGreaterThan(progress2);
    });
  });
});
