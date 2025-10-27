# 🚀 Whop Gamify - Quick Reference

## 📁 File Structure Quick Reference

```
/Users/zekegonzalez/whop badging/
├── 📄 Configuration (Complete ✅)
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── .env / .env.example
│   └── package.json
│
├── 🗄️ Database (Complete ✅)
│   └── prisma/
│       ├── schema.prisma
│       └── seed.ts
│
├── 🧠 Core Logic (Complete ✅)
│   └── lib/
│       ├── prisma.ts
│       ├── utils.ts
│       ├── notify.ts
│       ├── integrations/whop.ts
│       └── rules/
│           ├── engine.ts
│           └── levels.ts
│
├── 🎨 UI (Started, needs completion 🔧)
│   ├── app/
│   │   ├── globals.css ✅
│   │   ├── layout.tsx ✅
│   │   └── page.tsx ✅
│   └── components/
│       ├── ui/ (TODO: button, card, tabs, etc.)
│       └── gamify/ (TODO: BadgeCard, LevelPill, etc.)
│
├── 🔌 API Routes (TODO 🔧)
│   └── app/api/
│       ├── auth/[...nextauth]/
│       ├── webhooks/whop/
│       ├── me/
│       ├── leaderboard/
│       └── badges/
│
├── 🧪 Tests (Started ✅)
│   └── tests/
│       ├── setup.ts ✅
│       └── unit/levels.test.ts ✅
│
└── 📚 Documentation (Complete ✅)
    ├── README.md (423 lines)
    ├── IMPLEMENTATION_GUIDE.md (741 lines)
    └── PROJECT_SUMMARY.md (404 lines)
```

## 🎯 Common Commands

```bash
# Development
npm run dev                 # Start dev server (port 3000)
npm run queue:worker        # Start background job workers

# Database
npm run db:generate         # Generate Prisma Client
npm run db:push             # Push schema to database
npm run db:seed             # Seed demo data
npm run db:studio           # Open Prisma Studio GUI

# Build & Production
npm run build               # Build for production
npm start                   # Start production server

# Code Quality
npm run lint                # Run ESLint
npm run format              # Format with Prettier
npm test                    # Run Vitest tests
npm run test:ui             # Open Vitest UI

# Docker
docker-compose up -d        # Start all services
docker-compose down         # Stop all services
```

## 💾 Database Models Cheat Sheet

### User
```typescript
{
  id, whopUserId, email, displayName, avatarUrl
  membershipId, workspaceId, role (OWNER/COACH/MEMBER)
  points, level, streakDays, longestStreak
  lastLoginAt, lastActiveAt
  earnedBadges[], events[], progress[]
}
```

### Event
```typescript
{
  id, userId, type, meta (JSON), points
  createdAt
}
```

### Badge
```typescript
{
  id, slug, name, description, icon
  rule (JSON)
}
```

### BadgeEarned
```typescript
{
  id, userId, badgeId, earnedAt
}
```

### Progress
```typescript
{
  id, userId, contentId, contentType
  status ("locked" | "in_progress" | "completed")
  percent (0-100)
}
```

### Rule
```typescript
{
  id, kind ("points" | "badge" | "level" | "unlock")
  slug, name, config (JSON), active
}
```

## 🎨 Tailwind Utility Classes

```css
/* Custom utilities in globals.css */
.glass-panel        /* Frosted glass effect */
.grid-pattern       /* Subtle grid background */
.gradient-glow      /* Top glow accent */

/* Dark theme colors */
bg-background       /* #0B0B0F */
bg-card             /* #121218 */
bg-muted            /* #1B1B25 */
border-border       /* #262636 */
text-primary        /* #7C5CFC (purple) */
text-secondary      /* #18A4FF (blue) */
text-success        /* #22C55E */
text-warning        /* #F59E0B */
text-danger         /* #EF4444 */
```

## 🔑 Environment Variables Quick Ref

```env
# Critical ones to set:
DATABASE_URL="postgresql://..."    # PostgreSQL connection
REDIS_URL="redis://..."             # Redis connection
WHOP_CLIENT_ID="..."                # From Whop dashboard
WHOP_CLIENT_SECRET="..."            # From Whop dashboard
WHOP_WEBHOOK_SECRET="..."           # For webhook verification
RESEND_API_KEY="re_..."             # From Resend dashboard
NEXTAUTH_SECRET="random-string"     # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
```

## 📊 Rule Engine Event Types

```typescript
// Supported event types
"lesson.completed"   // +25 points (default)
"quiz.passed"        // +40 points (default)
"quiz.failed"        // 0 points
"login"              // +2 points (max 1/day)
"day.active"         // +5 points (max 1/day)
"content.unlocked"   // 0 points (tracking only)
```

## 🏆 Badge Rule Types

```typescript
// Badge rule configurations
{ type: "complete_lessons", count: 10 }
{ type: "quiz_pass_streak", days: 7 }
{ type: "level_reached", level: 5 }
{ type: "first_quiz_pass" }
{ type: "login_streak", days: 7 }
```

## 🎮 Level Calculation Formula

```typescript
// Points → Level
level = floor((points / 100) ^ 0.8) + 1

// Level → Points
points = ceil((level - 1) ^ 1.25 * 100)

// Examples:
0 pts    → Level 1
100 pts  → Level 2
500 pts  → Level 4
1000 pts → Level 6
5000 pts → Level 12
```

## 🛠️ Code Snippets

### Check user level
```typescript
import { calculateLevel } from '@/lib/rules/levels';
const level = calculateLevel(user.points);
```

### Award points
```typescript
import { evaluateEvent } from '@/lib/rules/engine';
const result = await evaluateEvent({
  userId: 'user_123',
  type: 'lesson.completed',
  meta: { lessonId: 'lesson_abc' }
});
// result: { pointsAwarded, badgesEarned[], leveledUp, ... }
```

### Send notification
```typescript
import { notify } from '@/lib/notify';
await notify.user({
  userId: 'user_123',
  type: 'badge.earned',
  data: { badgeName: 'First Steps', badgeIcon: '🎯' }
});
```

### Get current user (in API route)
```typescript
import { getServerSession } from 'next-auth';
const session = await getServerSession();
if (!session?.user) {
  return new Response('Unauthorized', { status: 401 });
}
```

### Format points for display
```typescript
import { formatPoints } from '@/lib/utils';
formatPoints(1250);  // "1.3K"
formatPoints(15000); // "15K"
```

## 🚨 Common Issues & Solutions

**Issue**: `Cannot find module '@/lib/...'`
**Fix**: Run `npm run build` to resolve TypeScript paths

**Issue**: Prisma Client errors
**Fix**: Run `npm run db:generate` to regenerate

**Issue**: Database connection failed
**Fix**: Check `DATABASE_URL` in `.env` and ensure PostgreSQL is running

**Issue**: Redis connection failed
**Fix**: Check `REDIS_URL` in `.env` and ensure Redis is running

**Issue**: Build errors with Radix components
**Fix**: Check package versions match those in `package.json`

## 📈 Performance Tips

1. **Database Queries**: Use Prisma's `include` sparingly, select only needed fields
2. **Leaderboards**: Cache for 10 min, use Redis for storage
3. **Events**: Process async via queues, don't block webhooks
4. **Images**: Use Next.js `<Image>` component with optimization
5. **Animations**: Use Framer Motion's `layoutId` for smooth transitions

## 🔒 Security Checklist

- [ ] Verify webhook signatures (HMAC)
- [ ] Validate all input with Zod schemas
- [ ] Use parameterized queries (Prisma does this)
- [ ] Implement CSRF tokens for mutations
- [ ] Rate limit API endpoints
- [ ] Set secure headers (already in next.config.js)
- [ ] Use HTTPS in production
- [ ] Rotate secrets regularly
- [ ] Log security events
- [ ] Implement proper error handling (don't leak info)

## 🎓 Resources Bookmarks

- [Next.js App Router](https://nextjs.org/docs/app)
- [Prisma Guides](https://www.prisma.io/docs/guides)
- [Radix UI Docs](https://www.radix-ui.com/primitives/docs/overview/introduction)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [BullMQ Guide](https://docs.bullmq.io)
- [NextAuth.js](https://next-auth.js.org/getting-started/introduction)
- [Vitest Docs](https://vitest.dev)

## 📞 Getting Help

1. Check `README.md` for feature overview
2. Check `IMPLEMENTATION_GUIDE.md` for step-by-step code examples
3. Check `PROJECT_SUMMARY.md` for architecture overview
4. Read inline comments in code files
5. TypeScript types are self-documenting - hover in IDE

---

**Everything you need is here. Now go build! 🚀**
