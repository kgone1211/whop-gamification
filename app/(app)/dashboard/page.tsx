'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LevelPill } from '@/components/gamify/LevelPill';
import { StreakFlame } from '@/components/gamify/StreakFlame';
import { PointsTicker } from '@/components/gamify/PointsTicker';
import { BadgeCard } from '@/components/gamify/BadgeCard';
import { ProgressBar } from '@/components/gamify/ProgressBar';
import { Trophy, Target, Zap, Award } from 'lucide-react';

// Demo data - will be replaced with API calls
const demoUser = {
  displayName: 'Demo User',
  avatarUrl: 'https://i.pravatar.cc/150?img=12',
  points: 750,
  level: 4,
  levelProgress: 65,
  streakDays: 3,
  longestStreak: 5,
  role: 'MEMBER' as const,
};

const demoBadges = [
  {
    id: '1',
    slug: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    earned: true,
    earnedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    slug: 'lesson-10',
    name: 'Dedicated Learner',
    description: 'Complete 10 lessons',
    icon: '📚',
    earned: false,
  },
  {
    id: '3',
    slug: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day login streak',
    icon: '🔥',
    earned: false,
  },
];

const demoEvents = [
  { id: '1', type: 'lesson.completed', points: 25, createdAt: new Date(), meta: { lessonId: 'lesson-123' } },
  { id: '2', type: 'login', points: 2, createdAt: new Date(Date.now() - 86400000), meta: {} },
  { id: '3', type: 'quiz.passed', points: 40, createdAt: new Date(Date.now() - 172800000), meta: { quizId: 'quiz-456' } },
];

export default function DashboardPage() {
  const [user, setUser] = useState(demoUser);
  const [badges, setBadges] = useState(demoBadges);
  const [events, setEvents] = useState(demoEvents);

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 grid-pattern opacity-40 pointer-events-none" />
      <div className="fixed inset-0 gradient-glow pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={user.avatarUrl}
              alt={user.displayName}
              className="w-16 h-16 rounded-full border-2 border-primary"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">{user.displayName}</h1>
              <div className="flex items-center gap-3 mt-2">
                <LevelPill level={user.level} />
                <StreakFlame days={user.streakDays} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Trophy className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <PointsTicker points={user.points} />
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Level</CardTitle>
              <Target className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Level {user.level}</div>
              <ProgressBar progress={user.levelProgress} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">{user.levelProgress}% to Level {user.level + 1}</p>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Zap className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.streakDays} days</div>
              <p className="text-xs text-muted-foreground mt-1">Longest: {user.longestStreak} days</p>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
              <Award className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {badges.filter((b) => b.earned).length} / {badges.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Badges Section */}
          <div className="lg:col-span-2">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Badge Collection</CardTitle>
                <CardDescription>
                  Unlock badges by completing challenges and hitting milestones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {badges.map((badge) => (
                    <BadgeCard
                      key={badge.id}
                      name={badge.name}
                      description={badge.description}
                      icon={badge.icon}
                      earned={badge.earned}
                      earnedAt={badge.earnedAt}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30"
                    >
                      <div>
                        <p className="text-sm font-medium capitalize">
                          {event.type.replace('.', ' ')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-sm font-bold text-primary">+{event.points}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
