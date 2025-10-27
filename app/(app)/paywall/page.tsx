'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Sparkles, Trophy, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PaywallPage() {
  const features = [
    {
      icon: Trophy,
      title: 'Earn Points & Badges',
      description: 'Get rewarded for completing lessons, quizzes, and daily activities',
    },
    {
      icon: TrendingUp,
      title: 'Level Up Your Profile',
      description: 'Progress through levels and unlock exclusive content',
    },
    {
      icon: Zap,
      title: 'Build Streaks',
      description: 'Maintain daily streaks for bonus rewards',
    },
    {
      icon: Sparkles,
      title: 'Compete on Leaderboards',
      description: 'See how you rank against other members',
    },
  ];

  const handleGetAccess = () => {
    // Redirect to Whop checkout
    window.location.href = process.env.NEXT_PUBLIC_WHOP_CHECKOUT_URL || 'https://whop.com/your-product';
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 grid-pattern opacity-40 pointer-events-none" />
      <div className="fixed inset-0 gradient-glow pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl relative z-10"
      >
        <Card className="glass-panel border-primary/20">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-4xl font-bold mb-3">
              Unlock Your Learning Journey
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Get access to gamified learning with points, badges, and rewards
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center pt-6 border-t border-border/50">
              <Button
                size="lg"
                onClick={handleGetAccess}
                className="px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Get Access Now
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Secure checkout powered by Whop
              </p>
            </div>

            {/* What's Included */}
            <div className="bg-card/50 rounded-lg p-6 border border-border/30">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                What's Included
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Full access to all courses and lessons
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Points system for every action
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Exclusive badges and achievements
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Leaderboard competition
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Level-based content unlocks
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
