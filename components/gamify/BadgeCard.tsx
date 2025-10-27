'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface BadgeCardProps {
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date | string;
}

export function BadgeCard({ name, description, icon, earned, earnedAt }: BadgeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: earned ? 1.05 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={
          earned
            ? 'border-primary/50 bg-card'
            : 'border-border/30 bg-card/50 opacity-60'
        }
      >
        <CardHeader className="text-center">
          <div className="text-5xl mb-4 relative">
            {earned ? (
              icon
            ) : (
              <div className="relative inline-block">
                <span className="opacity-30">{icon}</span>
                <Lock className="w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
            )}
          </div>
          <CardTitle className="text-lg">{name}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
          {earned && earnedAt && (
            <p className="text-xs text-muted-foreground mt-2">
              Earned {formatDate(earnedAt)}
            </p>
          )}
        </CardHeader>
      </Card>
    </motion.div>
  );
}
