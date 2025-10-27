import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo users
  const owner = await prisma.user.upsert({
    where: { whopUserId: 'whop_owner_demo' },
    update: {},
    create: {
      whopUserId: 'whop_owner_demo',
      email: 'owner@example.com',
      displayName: 'Alex (Owner)',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
      role: 'OWNER',
      workspaceId: 'workspace_demo',
      points: 5000,
      level: 12,
      streakDays: 15,
      longestStreak: 21,
      lastActiveAt: new Date(),
    },
  });

  const coach = await prisma.user.upsert({
    where: { whopUserId: 'whop_coach_demo' },
    update: {},
    create: {
      whopUserId: 'whop_coach_demo',
      email: 'coach@example.com',
      displayName: 'Sarah (Coach)',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
      role: 'COACH',
      workspaceId: 'workspace_demo',
      points: 3200,
      level: 9,
      streakDays: 8,
      longestStreak: 12,
      lastActiveAt: new Date(),
    },
  });

  const member = await prisma.user.upsert({
    where: { whopUserId: 'whop_member_demo' },
    update: {},
    create: {
      whopUserId: 'whop_member_demo',
      email: 'member@example.com',
      displayName: 'Jamie (Member)',
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
      role: 'MEMBER',
      workspaceId: 'workspace_demo',
      points: 750,
      level: 4,
      streakDays: 3,
      longestStreak: 5,
      lastActiveAt: new Date(),
    },
  });

  console.log('✅ Created demo users');

  // Create badges
  const badges = [
    {
      slug: 'first-steps',
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      rule: { type: 'complete_lessons', count: 1 },
    },
    {
      slug: 'lesson-10',
      name: 'Dedicated Learner',
      description: 'Complete 10 lessons',
      icon: '📚',
      rule: { type: 'complete_lessons', count: 10 },
    },
    {
      slug: 'lesson-50',
      name: 'Knowledge Seeker',
      description: 'Complete 50 lessons',
      icon: '🔥',
      rule: { type: 'complete_lessons', count: 50 },
    },
    {
      slug: 'rookie-quizzer',
      name: 'Quiz Rookie',
      description: 'Pass your first quiz',
      icon: '✅',
      rule: { type: 'first_quiz_pass' },
    },
    {
      slug: 'quiz-master',
      name: 'Quiz Master',
      description: 'Pass quizzes for 7 consecutive days',
      icon: '🏆',
      rule: { type: 'quiz_pass_streak', days: 7 },
    },
    {
      slug: 'streak-7',
      name: 'Week Warrior',
      description: 'Maintain a 7-day login streak',
      icon: '🔥',
      rule: { type: 'login_streak', days: 7 },
    },
    {
      slug: 'streak-30',
      name: 'Monthly Master',
      description: 'Maintain a 30-day login streak',
      icon: '⚡',
      rule: { type: 'login_streak', days: 30 },
    },
    {
      slug: 'level-5',
      name: 'Rising Star',
      description: 'Reach Level 5',
      icon: '⭐',
      rule: { type: 'level_reached', level: 5 },
    },
    {
      slug: 'level-10',
      name: 'Expert',
      description: 'Reach Level 10',
      icon: '💎',
      rule: { type: 'level_reached', level: 10 },
    },
    {
      slug: 'level-25',
      name: 'Legend',
      description: 'Reach Level 25',
      icon: '👑',
      rule: { type: 'level_reached', level: 25 },
    },
    {
      slug: 'early-bird',
      name: 'Early Bird',
      description: 'Join the platform early',
      icon: '🐦',
      rule: { type: 'complete_lessons', count: 1 },
    },
    {
      slug: 'consistent-learner',
      name: 'Consistent Learner',
      description: 'Complete lessons 3 days in a row',
      icon: '📖',
      rule: { type: 'login_streak', days: 3 },
    },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      update: {},
      create: badge,
    });
  }

  console.log('✅ Created badges');

  // Earn some badges for demo users
  const firstStepsBadge = await prisma.badge.findUnique({ where: { slug: 'first-steps' } });
  const streak7Badge = await prisma.badge.findUnique({ where: { slug: 'streak-7' } });
  const level5Badge = await prisma.badge.findUnique({ where: { slug: 'level-5' } });

  if (firstStepsBadge && streak7Badge && level5Badge) {
    await prisma.badgeEarned.createMany({
      data: [
        { userId: owner.id, badgeId: firstStepsBadge.id },
        { userId: owner.id, badgeId: streak7Badge.id },
        { userId: owner.id, badgeId: level5Badge.id },
        { userId: coach.id, badgeId: firstStepsBadge.id },
        { userId: coach.id, badgeId: streak7Badge.id },
        { userId: member.id, badgeId: firstStepsBadge.id },
      ],
      skipDuplicates: true,
    });
  }

  console.log('✅ Assigned badges to demo users');

  // Create point rules
  const pointRules = [
    {
      kind: 'points',
      slug: 'lesson-completed',
      name: 'Lesson Completed',
      config: { eventType: 'lesson.completed', points: 25 },
    },
    {
      kind: 'points',
      slug: 'quiz-passed',
      name: 'Quiz Passed',
      config: { eventType: 'quiz.passed', points: 40 },
    },
    {
      kind: 'points',
      slug: 'daily-login',
      name: 'Daily Login',
      config: { eventType: 'login', points: 2, maxPerDay: 1 },
    },
    {
      kind: 'points',
      slug: 'day-active',
      name: 'Day Active',
      config: { eventType: 'day.active', points: 5, maxPerDay: 1 },
    },
  ];

  for (const rule of pointRules) {
    await prisma.rule.upsert({
      where: { slug: rule.slug },
      update: {},
      create: rule,
    });
  }

  console.log('✅ Created point rules');

  // Create unlock rule
  await prisma.rule.upsert({
    where: { slug: 'unlock-bonus-module' },
    update: {},
    create: {
      kind: 'unlock',
      slug: 'unlock-bonus-module',
      name: 'Unlock Bonus Module at Level 3',
      config: { level: 3, contentId: 'bonus-module-1' },
    },
  });

  console.log('✅ Created unlock rules');

  // Create sample events
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  await prisma.event.createMany({
    data: [
      // Owner events
      { userId: owner.id, type: 'lesson.completed', points: 25, createdAt: twoDaysAgo },
      { userId: owner.id, type: 'quiz.passed', points: 40, createdAt: twoDaysAgo },
      { userId: owner.id, type: 'day.active', points: 5, createdAt: yesterday },
      { userId: owner.id, type: 'lesson.completed', points: 25, createdAt: yesterday },
      { userId: owner.id, type: 'day.active', points: 5, createdAt: now },
      
      // Coach events
      { userId: coach.id, type: 'lesson.completed', points: 25, createdAt: yesterday },
      { userId: coach.id, type: 'day.active', points: 5, createdAt: yesterday },
      { userId: coach.id, type: 'quiz.passed', points: 40, createdAt: now },
      
      // Member events
      { userId: member.id, type: 'login', points: 2, createdAt: now },
      { userId: member.id, type: 'lesson.completed', points: 25, createdAt: now },
    ],
  });

  console.log('✅ Created sample events');

  // Create sample progress
  await prisma.progress.createMany({
    data: [
      {
        userId: owner.id,
        contentId: 'course-101',
        contentType: 'course',
        status: 'in_progress',
        percent: 75,
      },
      {
        userId: coach.id,
        contentId: 'course-101',
        contentType: 'course',
        status: 'in_progress',
        percent: 45,
      },
      {
        userId: member.id,
        contentId: 'course-101',
        contentType: 'course',
        status: 'in_progress',
        percent: 15,
      },
    ],
  });

  console.log('✅ Created sample progress records');

  console.log('🎉 Seeding complete!');
  console.log(`
    Demo Users Created:
    - Owner:  ${owner.email} (Level ${owner.level}, ${owner.points} pts)
    - Coach:  ${coach.email} (Level ${coach.level}, ${coach.points} pts)
    - Member: ${member.email} (Level ${member.level}, ${member.points} pts)
  `);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
