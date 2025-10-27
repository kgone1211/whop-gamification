import { NextResponse } from 'next/server';

// Demo data endpoint - replace with actual auth + DB query
export async function GET() {
  try {
    // TODO: Get user from session
    // const session = await getServerSession();
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Demo user data
    const userData = {
      user: {
        id: 'demo_user',
        displayName: 'Demo User',
        avatarUrl: 'https://i.pravatar.cc/150?img=12',
        points: 750,
        level: 4,
        levelProgress: 65,
        streakDays: 3,
        longestStreak: 5,
        role: 'MEMBER',
      },
      badges: [
        {
          id: '1',
          slug: 'first-steps',
          name: 'First Steps',
          description: 'Complete your first lesson',
          icon: '🎯',
          rule: { type: 'complete_lessons', count: 1 },
          earnedAt: new Date('2024-01-15'),
        },
      ],
      recentEvents: [
        {
          id: '1',
          type: 'lesson.completed',
          points: 25,
          createdAt: new Date(),
          meta: {},
        },
      ],
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
