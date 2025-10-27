'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgeCard } from '@/components/gamify/BadgeCard';
import { Search } from 'lucide-react';

const allBadges = [
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
    slug: 'lesson-50',
    name: 'Knowledge Seeker',
    description: 'Complete 50 lessons',
    icon: '🔥',
    earned: false,
  },
  {
    id: '4',
    slug: 'rookie-quizzer',
    name: 'Quiz Rookie',
    description: 'Pass your first quiz',
    icon: '✅',
    earned: true,
    earnedAt: new Date('2024-01-20'),
  },
  {
    id: '5',
    slug: 'quiz-master',
    name: 'Quiz Master',
    description: 'Pass quizzes for 7 consecutive days',
    icon: '🏆',
    earned: false,
  },
  {
    id: '6',
    slug: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day login streak',
    icon: '🔥',
    earned: false,
  },
  {
    id: '7',
    slug: 'streak-30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day login streak',
    icon: '⚡',
    earned: false,
  },
  {
    id: '8',
    slug: 'level-5',
    name: 'Rising Star',
    description: 'Reach Level 5',
    icon: '⭐',
    earned: false,
  },
  {
    id: '9',
    slug: 'level-10',
    name: 'Expert',
    description: 'Reach Level 10',
    icon: '💎',
    earned: false,
  },
  {
    id: '10',
    slug: 'level-25',
    name: 'Legend',
    description: 'Reach Level 25',
    icon: '👑',
    earned: false,
  },
  {
    id: '11',
    slug: 'early-bird',
    name: 'Early Bird',
    description: 'Join the platform early',
    icon: '🐦',
    earned: true,
    earnedAt: new Date('2024-01-10'),
  },
  {
    id: '12',
    slug: 'consistent-learner',
    name: 'Consistent Learner',
    description: 'Complete lessons 3 days in a row',
    icon: '📖',
    earned: false,
  },
];

type FilterType = 'all' | 'earned' | 'locked';

export default function BadgesPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBadges = allBadges.filter((badge) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'earned' && badge.earned) ||
      (filter === 'locked' && !badge.earned);

    const matchesSearch =
      searchQuery === '' ||
      badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      badge.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const earnedCount = allBadges.filter((b) => b.earned).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 grid-pattern opacity-40 pointer-events-none" />
      <div className="fixed inset-0 gradient-glow pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Badge Collection</h1>
          <p className="text-muted-foreground">
            {earnedCount} of {allBadges.length} badges earned
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All Badges
            </Button>
            <Button
              variant={filter === 'earned' ? 'default' : 'outline'}
              onClick={() => setFilter('earned')}
            >
              Earned ({earnedCount})
            </Button>
            <Button
              variant={filter === 'locked' ? 'default' : 'outline'}
              onClick={() => setFilter('locked')}
            >
              Locked ({allBadges.length - earnedCount})
            </Button>
          </div>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search badges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md bg-muted/30 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Badge Grid */}
        {filteredBadges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBadges.map((badge) => (
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
        ) : (
          <Card className="glass-panel">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No badges found matching your filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
