'use client';

import { motion } from 'framer-motion';

interface LevelPillProps {
  level: number;
}

export function LevelPill({ level }: LevelPillProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30"
    >
      <span className="text-xs font-semibold text-primary">LVL</span>
      <span className="text-sm font-bold text-foreground">{level}</span>
    </motion.div>
  );
}
