import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { evaluateEvent } from '@/lib/rules/engine';
import { prisma } from '@/lib/db';

/**
 * Whop Webhook Handler
 * POST /api/webhooks/whop
 * 
 * Receives events from Whop and processes them through the gamification engine
 */

// Event type mapping: Whop event -> Gamification event
const EVENT_MAP: Record<string, string> = {
  'membership.went_valid': 'membership.activated',
  'membership.went_invalid': 'membership.expired',
  'payment.succeeded': 'payment.completed',
  'review.created': 'review.posted',
  // Add more mappings as needed
};

// Handle membership status changes
async function handleMembershipChange(
  type: string,
  data: any
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { whopUserId: data.user_id },
  });

  if (!user) return;

  if (type === 'membership.went_valid') {
    // Activate membership
    await prisma.user.update({
      where: { id: user.id },
      data: {
        membershipId: data.membership_id,
        // Optionally set role based on plan
        role: data.plan_id === 'coach_plan' ? 'COACH' : 'MEMBER',
      },
    });
  } else if (type === 'membership.went_invalid') {
    // Deactivate membership
    await prisma.user.update({
      where: { id: user.id },
      data: {
        membershipId: null,
      },
    });
  }
}

function verifyWhopSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-whop-signature');
    const webhookSecret = process.env.WHOP_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('WHOP_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      );
    }

    const rawBody = await req.text();

    // Verify webhook signature
    if (signature && !verifyWhopSignature(rawBody, signature, webhookSecret)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(rawBody);
    const { type, data } = event;

    console.log('Received Whop webhook:', { type, data });

    // Handle membership status changes first
    if (type.startsWith('membership.')) {
      await handleMembershipChange(type, data);
    }

    // Map Whop event to gamification event
    const eventType = EVENT_MAP[type] || type;

    // Find user by Whop user ID
    const user = await prisma.user.findUnique({
      where: { whopUserId: data.user_id || data.customer_id },
    });

    if (!user) {
      console.log('User not found for webhook event:', data);
      return NextResponse.json({ received: true });
    }

    // Process through gamification engine
    const result = await evaluateEvent({
      userId: user.id,
      type: eventType,
      meta: {
        whopEventId: event.id,
        whopEventType: type,
        ...data,
      },
    });

    console.log('Event processed:', {
      userId: user.id,
      type: eventType,
      result,
    });

    // Send notifications if badges were earned
    if (result.badgesEarned && result.badgesEarned.length > 0) {
      // TODO: Send email/push notification
      console.log('Badges earned:', result.badgesEarned);
    }

    if (result.leveledUp) {
      // TODO: Send level-up notification
      console.log('User leveled up:', { userId: user.id });
    }

    return NextResponse.json({
      received: true,
      processed: true,
      result,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ status: 'ok' });
}
