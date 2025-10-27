# 🔐 Paywall & Access Control Guide

## Overview

Your gamification system integrates with **Whop's built-in paywall** system. This means Whop handles all payment processing, and your app just verifies membership status.

## ✅ Recommended Approach: Whop-Managed Paywall

### How It Works

```
User Journey:
1. User visits your app → Sees paywall
2. User clicks "Get Access" → Redirected to Whop checkout
3. User purchases → Whop processes payment
4. Whop sends webhook → Your app activates user
5. User redirected back → Full access granted
```

### Benefits
- ✅ No PCI compliance needed
- ✅ Whop handles all payment processing
- ✅ Built-in subscription management
- ✅ Automatic refunds & chargebacks
- ✅ Multiple payment methods
- ✅ International support
- ✅ Free trials & discounts built-in

---

## 🛠️ Implementation (Already Done!)

I've added the following to your codebase:

### 1. **Paywall Page** (`/app/(app)/paywall/page.tsx`)
- Beautiful landing page explaining features
- "Get Access" button redirects to Whop checkout
- Lists all gamification benefits

### 2. **Membership Middleware** (`/lib/auth/middleware.ts`)
- Checks if user has active membership
- Verifies membership status with Whop API
- Redirects to checkout if expired

### 3. **Route Protection** (`/middleware.ts`)
- Protects dashboard, leaderboard, badges pages
- Allows public access to landing page
- Redirects unauthenticated users to login

### 4. **Webhook Handler** (Updated)
- Listens for `membership.went_valid` events
- Activates user when they purchase
- Deactivates when membership expires

---

## 📋 Setup Steps

### Step 1: Create Whop Product

1. Go to **https://whop.com/dashboard**
2. Click **"Create Product"**
3. Choose product type:
   - **One-time purchase** (lifetime access)
   - **Subscription** (monthly/yearly, recommended)
4. Set pricing
5. Add description
6. Publish product

### Step 2: Get Checkout URL

After creating product:
1. Copy your product's checkout URL
2. It looks like: `https://whop.com/checkout/prod_xxxxx`
3. Add to your `.env`:

```bash
NEXT_PUBLIC_WHOP_CHECKOUT_URL="https://whop.com/checkout/prod_xxxxx"
```

### Step 3: Configure Webhooks

In Whop Dashboard → Webhooks:
1. Subscribe to these events:
   - ✅ `membership.went_valid` (user purchased)
   - ✅ `membership.went_invalid` (subscription expired)
   - ✅ `payment.succeeded` (payment processed)
   - ✅ `payment.failed` (payment failed)

### Step 4: Test the Flow

1. **Local Testing** (using ngrok):
```bash
# Expose local server
ngrok http 3000

# Update Whop webhook URL to ngrok URL
https://abc123.ngrok.io/api/webhooks/whop
```

2. **Test Purchase**:
   - Visit `/paywall`
   - Click "Get Access"
   - Use Whop test mode to simulate purchase
   - Verify webhook received
   - Check user activated in database

---

## 🎯 Access Control Levels

### Current Implementation

The app has 3 role levels (defined in Prisma schema):

```typescript
enum Role {
  MEMBER   // Regular users with active membership
  COACH    // Coaches/instructors (optional)
  OWNER    // Admin/owner (you)
}
```

### How Roles Work

**When webhook receives `membership.went_valid`:**
```typescript
// Check which plan they purchased
if (data.plan_id === 'your_coach_plan_id') {
  role = 'COACH'  // Give coach access
} else {
  role = 'MEMBER'  // Regular member
}
```

**In your routes:**
```typescript
// Protect admin routes
if (user.role !== 'OWNER') {
  return error('Forbidden')
}

// Protect coach features
if (user.role !== 'COACH' && user.role !== 'OWNER') {
  return error('Coaches only')
}
```

---

## 🔧 Customization Options

### Option 1: Different Access Tiers

Create multiple Whop products for different tiers:

```typescript
// In webhook handler
const PLAN_MAPPING = {
  'plan_basic': { role: 'MEMBER', features: ['basic'] },
  'plan_pro': { role: 'MEMBER', features: ['basic', 'pro'] },
  'plan_coach': { role: 'COACH', features: ['all'] },
};

const plan = PLAN_MAPPING[data.plan_id];
await prisma.user.update({
  where: { whopUserId: data.user_id },
  data: { 
    role: plan.role,
    features: plan.features  // Add features column to schema
  }
});
```

### Option 2: Time-Based Access

Automatically grant access for trials:

```typescript
// In webhook handler
if (data.status === 'trialing') {
  // Give temporary access during trial
  await prisma.user.update({
    where: { whopUserId: data.user_id },
    data: {
      membershipId: data.membership_id,
      trialEndsAt: new Date(data.trial_end * 1000)
    }
  });
}
```

### Option 3: Content-Level Gating

Unlock specific content based on levels:

```typescript
// Add to Rule model
{
  kind: 'UNLOCK',
  config: {
    type: 'level_reached',
    level: 5,
    unlocks: ['module_advanced']
  }
}

// Check before showing content
const user = await getUser();
const progress = await prisma.progress.findFirst({
  where: {
    userId: user.id,
    contentId: 'module_advanced'
  }
});

if (!progress || progress.status !== 'unlocked') {
  return <LockedContent requiredLevel={5} />
}
```

---

## 🚦 Testing Access Control

### Test Different States

1. **No Membership**:
```bash
# Clear cookies
# Visit /dashboard
# Should redirect to /api/auth/whop
```

2. **Active Membership**:
```bash
# Login with Whop
# Purchase product
# Visit /dashboard
# Should see content ✅
```

3. **Expired Membership**:
```bash
# Simulate webhook: membership.went_invalid
curl -X POST http://localhost:3000/api/webhooks/whop \
  -H "Content-Type: application/json" \
  -d '{
    "type": "membership.went_invalid",
    "data": {
      "user_id": "your_whop_user_id",
      "membership_id": "mem_xxxxx"
    }
  }'

# Visit /dashboard
# Should redirect to /paywall
```

---

## 💡 Best Practices

### 1. **Cache Membership Status**
Don't check Whop API on every request:

```typescript
// Store last verified time in database
await prisma.user.update({
  where: { id: userId },
  data: {
    membershipVerifiedAt: new Date(),
    membershipStatus: 'active'
  }
});

// Only re-verify if > 1 hour old
const needsVerification = 
  !user.membershipVerifiedAt ||
  Date.now() - user.membershipVerifiedAt.getTime() > 3600000;

if (needsVerification) {
  const isActive = await verifyWhopMembership(user.membershipId);
  // Update cache
}
```

### 2. **Graceful Degradation**
Handle Whop API downtime:

```typescript
try {
  const isActive = await verifyWhopMembership(membershipId);
  return isActive;
} catch (error) {
  // Whop API down - allow access for 24h based on cache
  if (user.membershipStatus === 'active' &&
      Date.now() - user.membershipVerifiedAt < 86400000) {
    return true;  // Trust cache for 24h
  }
  return false;
}
```

### 3. **Webhook Reliability**
Whop guarantees webhook delivery, but implement retry logic:

```typescript
// In webhook handler
try {
  await handleMembershipChange(type, data);
  return { received: true };
} catch (error) {
  // Log error, Whop will retry
  console.error('Webhook processing failed:', error);
  return { received: false };  // 500 status = retry
}
```

---

## 🎨 UI Components for Access States

### Show Different UI Based on Access

```typescript
// In your pages
const user = await getCurrentUser();

if (!user) {
  return <PaywallPage />;
}

if (!user.membershipId) {
  return (
    <div>
      <h1>Upgrade to Access</h1>
      <Button href={process.env.NEXT_PUBLIC_WHOP_CHECKOUT_URL}>
        Get Premium
      </Button>
    </div>
  );
}

// Has access - show content
return <DashboardPage />;
```

---

## ❓ FAQ

### Q: Can I use Stripe instead of Whop?
**A:** Yes, but you'd lose Whop's course integration. You'd need to:
1. Set up Stripe checkout
2. Handle webhooks from Stripe
3. Manage subscriptions yourself
4. Handle refunds/disputes

**Not recommended** if you're already on Whop.

### Q: How do I offer a free trial?
**A:** Configure in Whop product settings:
- Set trial period (7, 14, 30 days)
- Whop handles trial logic
- Webhook sends `status: 'trialing'`
- Your app grants temporary access

### Q: What about lifetime access?
**A:** Create a one-time purchase product in Whop:
- No recurring billing
- `membership.went_valid` webhook fires once
- Set `membershipId` but no expiry
- User has permanent access

### Q: How to handle refunds?
**A:** Whop sends `payment.refunded` webhook:
```typescript
if (type === 'payment.refunded') {
  await prisma.user.update({
    where: { whopUserId: data.user_id },
    data: { membershipId: null }
  });
}
```

---

## 📚 Additional Resources

- [Whop Webhooks Docs](https://docs.whop.com/webhooks)
- [Whop API Reference](https://docs.whop.com/api)
- [Membership Management](https://docs.whop.com/memberships)

---

## ✅ Summary

Your paywall setup:
1. ✅ Paywall page created (`/paywall`)
2. ✅ Whop checkout integration ready
3. ✅ Webhook handler processes memberships
4. ✅ Route protection middleware added
5. ✅ Membership verification implemented

**Next step:** Add `NEXT_PUBLIC_WHOP_CHECKOUT_URL` to your `.env` and test the flow!
