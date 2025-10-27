'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { LevelPill } from '@/components/gamify/LevelPill';

const demoLeaderboard = [
  {
    id: '1',
    rank: 1,
    displayName: 'Alex (Owner)',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    points: 5000,
    level: 12,
  },
  {
    id: '2',
    rank: 2,
    displayName: 'Sarah (Coach)',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    points: 3200,
    level: 9,
  },
  {
    id: '3',
    rank: 3,
    displayName: 'Jamie (Member)',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    points: 750,
    level: 4,
  },
  {
    id: '4',
    rank: 4,
    displayName: 'Taylor',
    avatarUrl: 'https://i.pravatar.cc/150?img=8',
    points: 650,
    level: 4,
  },
  {
    id: '5',
    rank: 5,
    displayName: 'Jordan',
    avatarUrl: 'https://i.pravatar.cc/150?img=15',
    points: 500,
    level: 3,
  },
];

type TimeRange = 'weekly' | 'monthly' | 'all';

export default function LeaderboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [leaderboard, setLeaderboard] = useState(demoLeaderboard);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-700" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 grid-pattern opacity-40 pointer-events-none" />
      <div className="fixed inset-0 gradient-glow pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">See how you stack up against other learners</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={timeRange === 'weekly' ? 'default' : 'outline'}
            onClick={() => setTimeRange('weekly')}
          >
            Weekly
          </Button>
          <Button
            variant={timeRange === 'monthly' ? 'default' : 'outline'}
            onClick={() => setTimeRange('monthly')}
          >
            Monthly
          </Button>
          <Button
            variant={timeRange === 'all' ? 'default' : 'outline'}
            onClick={() => setTimeRange('all')}
          >
            All-Time
          </Button>
        </div>

        {/* Podium (Top 3) */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* 2nd Place */}
          {leaderboard[1] && (
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <img
                  src={leaderboard[1].avatarUrl}
                  alt={leaderboard[1].displayName}
                  className="w-20 h-20 rounded-full border-4 border-gray-400"
                />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  {getRankIcon(2)}
                </div>
              </div>
              <Card className="glass-panel w-full text-center p-4">
                <p className="font-semibold text-sm mb-1">{leaderboard[1].displayName}</p>
                <p className="text-2xl font-bold text-primary">{leaderboard[1].points.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">points</p>
              </Card>
            </div>
          )}

          {/* 1st Place */}
          {leaderboard[0] && (
            <div className="flex flex-col items-center -mt-4">
              <div className="relative mb-4">
                <img
                  src={leaderboard[0].avatarUrl}
                  alt={leaderboard[0].displayName}
                  className="w-24 h-24 rounded-full border-4 border-yellow-500 shadow-lg shadow-yellow-500/50"
                />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  {getRankIcon(1)}
                </div>
              </div>
              <Card className="glass-panel w-full text-center p-4 border-primary/50">
                <p className="font-semibold mb-1">{leaderboard[0].displayName}</p>
                <p className="text-3xl font-bold text-primary">{leaderboard[0].points.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">points</p>
              </Card>
            </div>
          )}

          {/* 3rd Place */}
          {leaderboard[2] && (
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <img
                  src={leaderboard[2].avatarUrl}
                  alt={leaderboard[2].displayName}
                  className="w-20 h-20 rounded-full border-4 border-amber-700"
                />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  {getRankIcon(3)}
                </div>
              </div>
              <Card className="glass-panel w-full text-center p-4">
                <p className="font-semibold text-sm mb-1">{leaderboard[2].displayName}</p>
                <p className="text-2xl font-bold text-primary">{leaderboard[2].points.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">points</p>
              </Card>
            </div>
          )}
        </div>

        {/* Rest of Leaderboard */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Rankings</CardTitle>
            <CardDescription>Full leaderboard standings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaderboard.slice(3).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 text-center font-bold text-muted-foreground">
                      #{user.rank}
                    </div>
                    <img
                      src={user.avatarUrl}
                      alt={user.displayName}
                      className="w-10 h-10 rounded-full border-2 border-border"
                    />
                    <div>
                      <p className="font-semibold">{user.displayName}</p>
                      <LevelPill level={user.level} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{user.points.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
