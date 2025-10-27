import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Demo badges data
    const badgesData = {
      badges: [
        {
          id: '1',
          slug: 'first-steps',
          name: 'First Steps',
          description: 'Complete your first lesson',
          icon: '🎯',
          rule: { type: 'complete_lessons', count: 1 },
          earned: true,
          earnedAt: new Date('2024-01-15'),
        },
        {
          id: '2',
          slug: 'lesson-10',
          name: 'Dedicated Learner',
          description: 'Complete 10 lessons',
          icon: '📚',
          rule: { type: 'complete_lessons', count: 10 },
          earned: false,
        },
        {
          id: '3',
          slug: 'level-5',
          name: 'Rising Star',
          description: 'Reach Level 5',
          icon: '⭐',
          rule: { type: 'level_reached', level: 5 },
          earned: false,
        },
      ],
    };

    return NextResponse.json(badgesData);
  } catch (error) {
    console.error('Error fetching badges:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
