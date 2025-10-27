'use client';

import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface StreakFlameProps {
  days: number;
}

export function StreakFlame({ days }: StreakFlameProps) {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Flame className="w-6 h-6 text-warning fill-warning" />
      </motion.div>
      <span className="text-lg font-bold text-foreground">{days}</span>
      <span className="text-sm text-muted-foreground">day streak</span>
    </div>
  );
}
