import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Demo leaderboard data
    const leaderboardData = [
      {
        id: '1',
        rank: 1,
        displayName: 'Alex (Owner)',
        avatarUrl: 'https://i.pravatar.cc/150?img=1',
        points: 5000,
        level: 12,
        workspaceId: 'workspace_demo',
      },
      {
        id: '2',
        rank: 2,
        displayName: 'Sarah (Coach)',
        avatarUrl: 'https://i.pravatar.cc/150?img=5',
        points: 3200,
        level: 9,
        workspaceId: 'workspace_demo',
      },
      {
        id: '3',
        rank: 3,
        displayName: 'Jamie (Member)',
        avatarUrl: 'https://i.pravatar.cc/150?img=12',
        points: 750,
        level: 4,
        workspaceId: 'workspace_demo',
      },
    ];

    return NextResponse.json({
      range,
      leaderboard: leaderboardData.slice(0, limit),
      total: leaderboardData.length,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
