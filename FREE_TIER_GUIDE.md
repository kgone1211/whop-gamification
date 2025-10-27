# 🆓 Free Tier Implementation Guide

## ✅ What's Been Added

Your app now includes a **FREE tier** to meet Whop App Store requirements!

---

## 🎯 **4 Roles (Updated)**

### **1. 🆓 FREE** (New - Default)
**Who:** Anyone who signs up without purchasing

**What They Get:**
- ✅ Access to dashboard (view their stats)
- ✅ Earn up to **100 points per day**
- ✅ Unlock **3 starter badges**
- ✅ View **top 10** on leaderboard
- ✅ Progress to **level 5** maximum
- ✅ Basic streak tracking (view only)

**What's Limited:**
- ❌ Can't earn unlimited points
- ❌ Can't earn premium badges
- ❌ Can't see full leaderboard
- ❌ Can't level past 5
- ❌ No content unlocks
- ❌ No streak bonuses

**Upgrade Prompt:** Clear CTAs to upgrade throughout the app

---

### **2. 💎 MEMBER** (Paying Users)
**Who:** Users with active Whop subscription

**What They Get:**
- ✅ **Everything FREE has, PLUS:**
- ✅ Unlimited points per day
- ✅ Unlock ALL badges (unlimited)
- ✅ Full leaderboard access
- ✅ Unlimited level progression
- ✅ Streak bonuses & rewards
- ✅ Content unlocks by level
- ✅ Premium badges

---

### **3. 🎓 COACH** (Instructors)
Same as MEMBER + potential instructor features

---

### **4. 👑 OWNER** (Admin)
Full admin access to everything

---

## 🛠️ **Implementation Details**

### **Files Created/Updated**

1. **Schema Updated** (`prisma/schema.prisma`)
   - Added `FREE` to Role enum
   - Changed default role from `MEMBER` to `FREE`

2. **Feature Limits** (`lib/features/limits.ts`)
   - Defines limits for each role
   - Helper functions to check permissions
   - Upgrade messages

3. **Pricing Page** (`app/(app)/pricing/page.tsx`)
   - Beautiful comparison of FREE vs Premium
   - Clear upgrade CTAs
   - FAQ section

4. **OAuth Callback Updated** (`app/api/auth/callback/whop/route.ts`)
   - New users default to FREE role
   - Only upgraded when they purchase

---

## 📊 **Feature Comparison**

| Feature | FREE | MEMBER |
|---------|------|--------|
| **Daily Points** | 100 max | ♾️ Unlimited |
| **Badges** | 3 starter | ♾️ All badges |
| **Leaderboard** | Top 10 only | Full access |
| **Max Level** | Level 5 | ♾️ Unlimited |
| **Streak Bonuses** | ❌ View only | ✅ Earn rewards |
| **Content Unlocks** | ❌ No | ✅ Yes |
| **Premium Badges** | ❌ No | ✅ Yes |

---

## 🚀 **How It Works**

### **User Journey**

#### **New User (FREE)**
```
1. User signs in with Whop OAuth
   ↓
2. Account created with role: FREE
   ↓
3. User sees dashboard with limited features
   ↓
4. Earns points (max 100/day)
   ↓
5. Sees "Upgrade to Premium" prompts
   ↓
6. Clicks upgrade → Whop checkout
   ↓
7. Purchases → Webhook upgrades to MEMBER
   ↓
8. Full access unlocked! 🎉
```

#### **Returning User**
- FREE users: Continue with limits
- MEMBER users: Full access
- If subscription expires: Downgraded to FREE (keeps progress)

---

## 💻 **Code Implementation**

### **Check Limits Before Awarding Points**

Update your rule engine:

```typescript
// In lib/rules/engine.ts
import { canEarnPoints, getUpgradeMessage } from '@/lib/features/limits';

export async function evaluateEvent(event: GameEvent) {
  const user = await prisma.user.findUnique({
    where: { id: event.userId },
  });

  // Get today's points
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const todayEvents = await prisma.event.aggregate({
    where: {
      userId: event.userId,
      createdAt: { gte: todayStart },
    },
    _sum: { points: true },
  });

  const todayPoints = todayEvents._sum.points || 0;

  // Check if user can earn more points
  if (!canEarnPoints(user.role, todayPoints)) {
    return {
      pointsAwarded: 0,
      message: getUpgradeMessage(user.role, 'points'),
      upgradeSuggested: true,
    };
  }

  // Award points normally
  const pointsEarned = calculatePointsForEvent(event);
  
  // ... rest of logic
}
```

### **Limit Leaderboard for FREE Users**

```typescript
// In app/api/leaderboard/route.ts
export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  
  const limit = user.role === 'FREE' ? 10 : 50;
  
  const leaderboard = await prisma.user.findMany({
    orderBy: { points: 'desc' },
    take: limit,
    select: {
      id: true,
      displayName: true,
      avatarUrl: true,
      points: true,
      level: true,
    },
  });

  return NextResponse.json({
    users: leaderboard,
    isLimited: user.role === 'FREE',
    upgradeMessage: user.role === 'FREE' 
      ? 'Upgrade to see the full leaderboard!'
      : null,
  });
}
```

### **Show Upgrade Prompts in UI**

```typescript
// In components/UpgradePrompt.tsx
export function UpgradePrompt({ feature }: { feature: string }) {
  const user = useUser();
  
  if (user.role !== 'FREE') return null;

  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <h4 className="font-semibold mb-1">Unlock {feature}</h4>
          <p className="text-sm text-muted-foreground">
            {getUpgradeMessage('FREE', feature)}
          </p>
        </div>
        <Button asChild>
          <a href="/pricing">
            <Sparkles className="w-4 h-4 mr-2" />
            Upgrade
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

// Usage in dashboard
<div className="space-y-4">
  {user.role === 'FREE' && todayPoints >= 100 && (
    <UpgradePrompt feature="unlimited points" />
  )}
  
  {/* Rest of dashboard */}
</div>
```

---

## 📋 **Whop App Store Requirements**

### ✅ **What You Need to Show**

1. **Free Tier Available**
   - ✅ Users can sign up without paying
   - ✅ Free users get meaningful value (dashboard, some points, badges)

2. **Clear Value Proposition**
   - ✅ Pricing page shows FREE vs Premium comparison
   - ✅ Users can try before they buy

3. **No Hard Paywall**
   - ✅ App is accessible without payment
   - ✅ Free users can use core features

4. **Transparent Pricing**
   - ✅ Clear pricing page (`/pricing`)
   - ✅ Feature comparison table
   - ✅ FAQ section

5. **Upgrade Path**
   - ✅ Clear CTAs to upgrade
   - ✅ Seamless checkout through Whop

---

## 🎨 **User Experience**

### **For FREE Users**

**Dashboard Shows:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Your Stats (FREE Tier)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Points Today: 85 / 100
💡 Upgrade for unlimited daily points!
[Upgrade to Premium]

Level: 3 (Max 5 on FREE)
💡 Unlock unlimited levels with Premium!

Badges: 2 / 3
💡 Premium unlocks ALL badges!

Leaderboard: You're #12
⚠️ Showing top 10 only
[Upgrade to see full rankings]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**For MEMBER Users:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Your Stats (PREMIUM)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Points: 2,847 (Unlimited! ⭐)
Level: 12
Badges: 15 / 50
Streak: 7 days 🔥
Rank: #5
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🔄 **Migration Steps**

### **1. Update Database Schema**

```bash
cd "/Users/zekegonzalez/whop badging"

# Generate new Prisma client with FREE role
npx prisma generate

# Push schema changes to database
npx prisma db push
```

### **2. Update Existing Users (Optional)**

If you already have users in your database:

```bash
# Connect to database
npx prisma studio

# Or via SQL
psql $DATABASE_URL

# Update existing users without memberships to FREE
UPDATE "User" 
SET role = 'FREE' 
WHERE "membershipId" IS NULL 
AND role = 'MEMBER';
```

### **3. Test the Flow**

```bash
# Start dev server
npm run dev

# Test as FREE user
1. Clear cookies
2. Login with Whop
3. Verify role is FREE
4. Try to earn >100 points/day
5. See upgrade prompts

# Test upgrade flow
1. Click "Upgrade to Premium"
2. Go through Whop checkout (use test mode)
3. Webhook should upgrade role to MEMBER
4. Verify unlimited access
```

---

## 🎯 **Recommended Limits**

### **Conservative (Better for Conversions)**
```typescript
FREE: {
  maxPointsPerDay: 50,      // Very limited
  maxBadges: 2,             // Just a taste
  leaderboardView: 'top5',  // Minimal
  levelCap: 3,              // Quick ceiling
}
```

### **Generous (Better for Engagement)**
```typescript
FREE: {
  maxPointsPerDay: 200,     // Decent daily progress
  maxBadges: 5,             // More to collect
  leaderboardView: 'top20', // More visible
  levelCap: 10,             // Longer runway
}
```

### **Current (Balanced)**
```typescript
FREE: {
  maxPointsPerDay: 100,     // ⬅️ Balanced
  maxBadges: 3,
  leaderboardView: 'top10',
  levelCap: 5,
}
```

---

## 📈 **Conversion Optimization**

### **When to Show Upgrade Prompts**

✅ **Good Times:**
- User hits daily point limit
- User tries to unlock 4th badge
- User reaches level 5
- User tries to view full leaderboard
- After 3 days of active use

❌ **Bad Times:**
- Immediately on signup
- Every page load
- During onboarding
- When user is engaged in learning

### **Upgrade CTA Best Practices**

```typescript
// Good: Contextual, value-focused
"You've earned 100 points today! 🎉 
Upgrade to Premium for unlimited daily points"

// Bad: Generic, pushy
"Upgrade now! Premium is better!"
```

---

## ✅ **Checklist for Whop App Store**

- [ ] FREE tier exists and is functional
- [ ] FREE users can access dashboard
- [ ] FREE users can earn some points
- [ ] Clear pricing page at `/pricing`
- [ ] Feature comparison table visible
- [ ] Upgrade CTAs are clear but not annoying
- [ ] Webhook properly upgrades FREE → MEMBER
- [ ] Test purchase flow end-to-end
- [ ] Screenshot pricing page for submission
- [ ] Document FREE tier in app description

---

## 🎊 **Summary**

**You now have:**
1. ✅ FREE tier (default for new users)
2. ✅ Clear limits on FREE tier
3. ✅ Beautiful pricing page
4. ✅ Feature limit system
5. ✅ Automatic upgrade via webhook
6. ✅ Whop App Store ready!

**Next Steps:**
1. Run database migration: `npx prisma db push`
2. Test FREE tier locally
3. Test upgrade flow
4. Adjust limits based on your preference
5. Submit to Whop App Store! 🚀

---

**Need help?** Check:
- Feature limits: `lib/features/limits.ts`
- Pricing page: `app/(app)/pricing/page.tsx`
- Schema: `prisma/schema.prisma`
