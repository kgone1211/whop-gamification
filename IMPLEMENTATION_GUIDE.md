# 🚀 Whop Gamification - Implementation Guide

This guide provides step-by-step instructions for completing the remaining components of the Whop Gamification system.

## 📋 Current Status

### ✅ Completed Core Files

1. **Configuration Files**
   - `next.config.js` - Next.js configuration with security headers
   - `tailwind.config.js` - Dark theme Tailwind setup
   - `tsconfig.json` - TypeScript configuration
   - `postcss.config.js` - PostCSS configuration
   - `.prettierrc` - Code formatting rules
   - `.env.example` - Environment variables template
   - `.gitignore` - Git ignore rules

2. **Database & Schema**
   - `prisma/schema.prisma` - Complete database schema with all models
   - `prisma/seed.ts` - Seed script with demo data (3 users, 12 badges, rules, events)

3. **Core Libraries**
   - `lib/utils.ts` - Utility functions (cn, formatPoints, formatDate, etc.)
   - `lib/prisma.ts` - Prisma client singleton
   - `lib/rules/levels.ts` - Level calculation system
   - `lib/rules/engine.ts` - Complete rule evaluation engine
   - `lib/integrations/whop.ts` - Whop API client (with stubs to implement)
   - `lib/notify.ts` - Notification system (Resend email)

4. **UI Foundation**
   - `app/globals.css` - Dark theme styles with custom utilities
   - `app/layout.tsx` - Root layout
   - `app/page.tsx` - Landing page

5. **Documentation**
   - `README.md` - Comprehensive project documentation
   - `package.json` - All dependencies and scripts defined

## 🔨 Next Steps to Complete

### 1. Fix Dependency Issues & Install Missing Radix Components

The current `package.json` has some Radix UI version mismatches. Update it:

```json
"dependencies": {
  "@radix-ui/react-dialog": "^1.1.2",
  "@radix-ui/react-dropdown-menu": "^2.1.2",
  "@radix-ui/react-slot": "^1.1.0",
  "@radix-ui/react-tabs": "^1.1.1",
  "@radix-ui/react-toast": "^1.2.2",
  "@radix-ui/react-tooltip": "^1.1.4"
}
```

Then run:
```bash
npm install
```

### 2. Create UI Components (`components/ui/`)

These are the base Radix UI wrapper components. Create these files:

**`components/ui/button.tsx`**
```typescript
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

**`components/ui/card.tsx`**
```typescript
import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```

Create similar wrappers for:
- `components/ui/tabs.tsx` (Radix Tabs)
- `components/ui/tooltip.tsx` (Radix Tooltip)
- `components/ui/dialog.tsx` (Radix Dialog)
- `components/ui/dropdown-menu.tsx` (Radix DropdownMenu)
- `components/ui/toast.tsx` (Radix Toast)

(See shadcn/ui documentation for templates: https://ui.shadcn.com)

### 3. Create Gamification Components (`components/gamify/`)

**`components/gamify/LevelPill.tsx`**
```typescript
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
```

**`components/gamify/PointsTicker.tsx`**
```typescript
'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { formatPoints } from '@/lib/utils';

interface PointsTickerProps {
  points: number;
}

export function PointsTicker({ points }: PointsTickerProps) {
  const spring = useSpring(points, { damping: 50, stiffness: 400 });
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

  useEffect(() => {
    spring.set(points);
  }, [points, spring]);

  return (
    <motion.div
      className="text-2xl font-bold text-foreground"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 0.3 }}
    >
      {display} <span className="text-muted-foreground text-sm">pts</span>
    </motion.div>
  );
}
```

**`components/gamify/StreakFlame.tsx`**
```typescript
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
```

**`components/gamify/BadgeCard.tsx`**
```typescript
'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock } from 'lucide-react';

interface BadgeCardProps {
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
}

export function BadgeCard({ name, description, icon, earned, earnedAt }: BadgeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: earned ? 1.05 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={earned ? 'border-primary/50 bg-card' : 'border-border/30 bg-card/50 opacity-60'}>
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
              Earned {new Date(earnedAt).toLocaleDateString()}
            </p>
          )}
        </CardHeader>
      </Card>
    </motion.div>
  );
}
```

Create similar components for:
- `Podium.tsx` - Leaderboard top 3 display
- `RankRow.tsx` - Individual leaderboard row
- `RuleEditor.tsx` - Admin rule builder interface
- `ProgressBar.tsx` - Level/course progress visualization

### 4. Create App Routes

**`app/(app)/dashboard/page.tsx`** - Main user dashboard
**`app/(app)/leaderboard/page.tsx`** - Leaderboards
**`app/(app)/badges/page.tsx`** - Badge catalog
**`app/(app)/admin/page.tsx`** - Admin panel (OWNER only)
**`app/(app)/layout.tsx`** - Protected layout with auth check

### 5. Create API Routes

**`app/api/webhooks/whop/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { whopClient } from '@/lib/integrations/whop';
import { evaluateEvent } from '@/lib/rules/engine';
// Import queue to enqueue event processing

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-whop-signature') || '';
    const body = await req.text();
    
    // Verify webhook signature
    if (!whopClient.verifyWebhookSignature(body, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);
    
    // Map Whop event to internal event type
    const gameEvent = mapWhopEvent(event);
    
    // Queue for processing
    // await eventsQueue.add('process-event', gameEvent);
    
    // Or process synchronously for now:
    await evaluateEvent(gameEvent);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

function mapWhopEvent(whopEvent: any): any {
  // Map Whop event structure to internal GameEvent structure
  return {
    userId: whopEvent.user_id,
    type: whopEvent.type, // e.g., 'lesson.completed'
    meta: whopEvent.data,
  };
}
```

**`app/api/me/route.ts`**
```typescript
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { calculateLevel, getLevelProgress } from '@/lib/rules/levels';

export async function GET() {
  const session = await getServerSession();
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      earnedBadges: {
        include: { badge: true },
      },
      events: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      points: user.points,
      level: user.level,
      levelProgress: getLevelProgress(user.points),
      streakDays: user.streakDays,
      longestStreak: user.longestStreak,
      role: user.role,
    },
    badges: user.earnedBadges.map((eb) => ({
      ...eb.badge,
      earnedAt: eb.earnedAt,
    })),
    recentEvents: user.events,
  });
}
```

Create similar routes for:
- `app/api/leaderboard/route.ts`
- `app/api/badges/route.ts`
- `app/api/admin/rules/route.ts`
- `app/api/admin/unlock/route.ts`
- `app/api/debug/emit/route.ts` (dev only)

### 6. Implement Authentication (NextAuth + Whop OAuth)

**`app/api/auth/[...nextauth]/route.ts`**
```typescript
import NextAuth, { type NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    {
      id: 'whop',
      name: 'Whop',
      type: 'oauth',
      authorization: {
        url: 'https://whop.com/oauth/authorize',
        params: {
          scope: 'user:read membership:read',
        },
      },
      token: 'https://whop.com/oauth/token',
      userinfo: 'https://api.whop.com/v1/me',
      clientId: process.env.WHOP_CLIENT_ID,
      clientSecret: process.env.WHOP_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.id,
          email: profile.email,
          name: profile.username,
          image: profile.profile_pic_url,
        };
      },
    },
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### 7. Create BullMQ Queue Workers

**`scripts/queues.ts`**
```typescript
import { Worker, Queue } from 'bullmq';
import Redis from 'ioredis';
import { evaluateEvent } from '@/lib/rules/engine';
import { notify } from '@/lib/notify';

const connection = new Redis(process.env.REDIS_URL!);

// Events Queue
const eventsQueue = new Queue('events', { connection });
const eventsWorker = new Worker(
  'events',
  async (job) => {
    const result = await evaluateEvent(job.data);
    
    // Trigger notifications
    if (result.badgesEarned.length > 0) {
      await notify.user({
        userId: job.data.userId,
        type: 'badge.earned',
        data: { badges: result.badgesEarned },
      });
    }
    
    if (result.leveledUp) {
      await notify.user({
        userId: job.data.userId,
        type: 'level.up',
        data: { newLevel: result.newLevel },
      });
    }
  },
  { connection }
);

// Streaks Queue (runs nightly)
const streaksQueue = new Queue('streaks', { connection });
const streaksWorker = new Worker(
  'streaks',
  async () => {
    // TODO: Implement nightly streak rollover logic
    console.log('Processing streak rollover...');
  },
  { connection }
);

console.log('✅ Queue workers started');

// Export queues for use in API routes
export { eventsQueue, streaksQueue };
```

### 8. Docker Setup

**`Dockerfile`**
```dockerfile
FROM node:18-alpine AS base

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run db:generate
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=base /app/next.config.js ./
COPY --from=base /app/public ./public
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

**`docker-compose.yml`**
```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: whop
      POSTGRES_PASSWORD: password
      POSTGRES_DB: whop_gamify
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://whop:password@db:5432/whop_gamify
      REDIS_URL: redis://redis:6379
    depends_on:
      - db
      - redis

volumes:
  postgres_data:
```

### 9. Testing

Create test files in `tests/` directory:

- `tests/unit/rules-engine.test.ts` - Test rule evaluation
- `tests/unit/levels.test.ts` - Test level calculations
- `tests/integration/api.test.ts` - Test API routes
- `tests/components/BadgeCard.test.tsx` - Test React components

**Example: `tests/unit/levels.test.ts`**
```typescript
import { describe, it, expect } from 'vitest';
import { calculateLevel, getPointsForLevel } from '@/lib/rules/levels';

describe('Level System', () => {
  it('should calculate level from points correctly', () => {
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(100)).toBe(2);
    expect(calculateLevel(500)).toBe(4);
    expect(calculateLevel(1000)).toBe(6);
  });

  it('should calculate points needed for level', () => {
    expect(getPointsForLevel(1)).toBe(0);
    expect(getPointsForLevel(2)).toBeGreaterThan(0);
  });
});
```

### 10. Final Steps

1. **Environment Setup**
   ```bash
   cp .env.example .env
   # Fill in your actual credentials
   ```

2. **Initialize Database**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

3. **Run Development**
   ```bash
   npm run dev
   # In another terminal:
   npm run queue:worker
   ```

4. **Test**
   ```bash
   npm test
   npm run lint
   npm run format
   ```

5. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## 🎯 Priority Order

Implement in this order for fastest MVP:

1. ✅ **Phase 1: Foundation** (COMPLETE)
   - Config files, Prisma schema, core libraries

2. **Phase 2: UI Components** (NEXT)
   - Base UI components (button, card, etc.)
   - Gamification components (badges, level pill, etc.)

3. **Phase 3: Pages**
   - Dashboard page
   - Leaderboard page
   - Badge catalog page

4. **Phase 4: API & Auth**
   - NextAuth setup with Whop OAuth
   - Core API routes (/me, /leaderboard, /badges)
   - Webhook handler

5. **Phase 5: Background Jobs**
   - BullMQ queue workers
   - Event processing
   - Notifications

6. **Phase 6: Admin Features**
   - Admin page
   - Rule builder
   - Content unlock management

7. **Phase 7: Testing & Polish**
   - Unit tests
   - Integration tests
   - Performance optimization

## 📚 Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Radix UI**: https://www.radix-ui.com
- **shadcn/ui**: https://ui.shadcn.com (component templates)
- **BullMQ**: https://docs.bullmq.io
- **NextAuth**: https://next-auth.js.org

## 💡 Tips

1. Start with static data on pages, then connect to API
2. Use Prisma Studio (`npm run db:studio`) to inspect database
3. Test webhooks with tools like webhook.site
4. Use React DevTools and Network tab for debugging
5. Check console for Prisma query logs in development

---

Good luck! You have a solid foundation to build upon. The core logic (rule engine, levels, database schema) is complete. Now it's mainly wiring up UI components and API routes. 🚀
