import { prisma } from '@/lib/prisma';
import { calculateLevel } from './levels';

export type EventType =
  | 'lesson.completed'
  | 'quiz.passed'
  | 'quiz.failed'
  | 'login'
  | 'day.active'
  | 'content.unlocked';

export interface GameEvent {
  userId: string;
  type: EventType;
  meta?: Record<string, unknown>;
}

export interface BadgeRule {
  type: 'complete_lessons' | 'quiz_pass_streak' | 'level_reached' | 'first_quiz_pass' | 'login_streak';
  count?: number;
  days?: number;
  level?: number;
}

export interface EvaluationResult {
  pointsAwarded: number;
  badgesEarned: string[];
  leveledUp: boolean;
  previousLevel?: number;
  newLevel?: number;
  streakIncreased: boolean;
  unlockedContent: string[];
}

/**
 * Core rule engine - evaluates an event and updates user stats
 */
export async function evaluateEvent(event: GameEvent): Promise<EvaluationResult> {
  const result: EvaluationResult = {
    pointsAwarded: 0,
    badgesEarned: [],
    leveledUp: false,
    streakIncreased: false,
    unlockedContent: [],
  };

  // Get user
  const user = await prisma.user.findUnique({
    where: { id: event.userId },
    include: {
      earnedBadges: {
        include: { badge: true },
      },
      events: {
        where: {
          type: event.type,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // last 24h
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error(`User ${event.userId} not found`);
  }

  const previousLevel = user.level;

  // Calculate points for this event
  result.pointsAwarded = await calculatePointsForEvent(event, user);

  // Record the event
  await prisma.event.create({
    data: {
      userId: event.userId,
      type: event.type,
      points: result.pointsAwarded,
      meta: event.meta || {},
    },
  });

  // Update user points
  const newPoints = user.points + result.pointsAwarded;
  const newLevel = calculateLevel(newPoints);
  result.leveledUp = newLevel > previousLevel;
  result.previousLevel = previousLevel;
  result.newLevel = newLevel;

  // Update streak for day.active events
  if (event.type === 'day.active') {
    const lastActive = user.lastActiveAt;
    const now = new Date();
    
    // Check if it's a new day
    if (!lastActive || isNewDay(lastActive, now)) {
      const newStreak = user.streakDays + 1;
      result.streakIncreased = true;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          streakDays: newStreak,
          longestStreak: Math.max(user.longestStreak, newStreak),
          lastActiveAt: now,
          points: newPoints,
          level: newLevel,
        },
      });

      // Bonus points every 7-day streak
      if (newStreak % 7 === 0) {
        result.pointsAwarded += 20;
        await prisma.event.create({
          data: {
            userId: user.id,
            type: 'day.active',
            points: 20,
            meta: { reason: '7-day-streak-bonus' },
          },
        });
      }
    }
  } else {
    // Just update points and level
    await prisma.user.update({
      where: { id: user.id },
      data: {
        points: newPoints,
        level: newLevel,
        lastActiveAt: new Date(),
      },
    });
  }

  // Evaluate badges
  const badges = await prisma.badge.findMany();
  for (const badge of badges) {
    const alreadyEarned = user.earnedBadges.some((eb) => eb.badgeId === badge.id);
    if (alreadyEarned) continue;

    const rule = badge.rule as BadgeRule;
    const earned = await evaluateBadgeRule(rule, user.id);

    if (earned) {
      await prisma.badgeEarned.create({
        data: {
          userId: user.id,
          badgeId: badge.id,
        },
      });
      result.badgesEarned.push(badge.slug);
    }
  }

  // Evaluate unlock rules
  const unlockRules = await prisma.rule.findMany({
    where: { kind: 'unlock', active: true },
  });

  for (const rule of unlockRules) {
    const config = rule.config as { level: number; contentId: string };
    if (newLevel >= config.level) {
      // Check if already unlocked
      const existing = await prisma.progress.findUnique({
        where: {
          userId_contentId: {
            userId: user.id,
            contentId: config.contentId,
          },
        },
      });

      if (!existing) {
        await prisma.progress.create({
          data: {
            userId: user.id,
            contentId: config.contentId,
            contentType: 'module',
            status: 'in_progress',
            percent: 0,
          },
        });
        result.unlockedContent.push(config.contentId);
        
        // TODO: Call whopClient.unlockContent() here
      }
    }
  }

  return result;
}

/**
 * Calculate points for an event with anti-gaming measures
 */
async function calculatePointsForEvent(event: GameEvent, user: any): Promise<number> {
  const pointRules = await prisma.rule.findMany({
    where: { kind: 'points', active: true },
  });

  let points = 0;

  for (const rule of pointRules) {
    const config = rule.config as { eventType: string; points: number; maxPerDay?: number };
    if (config.eventType !== event.type) continue;

    points = config.points;

    // Check daily cap
    if (config.maxPerDay) {
      const todayEvents = user.events.filter(
        (e: any) => e.type === event.type
      );

      if (todayEvents.length >= config.maxPerDay) {
        points = 0;
      }
    }
  }

  return points;
}

/**
 * Evaluate if a badge rule is satisfied
 */
async function evaluateBadgeRule(rule: BadgeRule, userId: string): Promise<boolean> {
  switch (rule.type) {
    case 'complete_lessons': {
      const count = await prisma.event.count({
        where: {
          userId,
          type: 'lesson.completed',
        },
      });
      return count >= (rule.count || 0);
    }

    case 'quiz_pass_streak': {
      // Check for consecutive days with quiz passes
      const events = await prisma.event.findMany({
        where: {
          userId,
          type: 'quiz.passed',
        },
        orderBy: { createdAt: 'desc' },
        take: rule.days || 7,
      });

      if (events.length < (rule.days || 7)) return false;

      // Check if events span required consecutive days
      const days = new Set(events.map((e) => e.createdAt.toDateString()));
      return days.size >= (rule.days || 7);
    }

    case 'level_reached': {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      return (user?.level || 0) >= (rule.level || 0);
    }

    case 'first_quiz_pass': {
      const count = await prisma.event.count({
        where: {
          userId,
          type: 'quiz.passed',
        },
      });
      return count >= 1;
    }

    case 'login_streak': {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      return (user?.streakDays || 0) >= (rule.days || 0);
    }

    default:
      return false;
  }
}

/**
 * Check if two dates are on different days
 */
function isNewDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() !== date2.toDateString();
}
