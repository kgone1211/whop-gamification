'use client';

import { motion } from 'framer-motion';
import { formatPoints } from '@/lib/utils';

interface PointsTickerProps {
  points: number;
}

export function PointsTicker({ points }: PointsTickerProps) {
  return (
    <motion.div
      className="text-2xl font-bold text-foreground"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 0.3 }}
    >
      {points.toLocaleString()} <span className="text-muted-foreground text-sm">pts</span>
    </motion.div>
  );
}
