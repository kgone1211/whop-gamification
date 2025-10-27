import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyWhopMembership } from '@/lib/integrations/whop';

/**
 * Membership verification middleware
 * Checks if user has active Whop membership
 */

export async function requireActiveMembership(req: NextRequest) {
  // Get user from session cookie
  const userId = req.cookies.get('user_id')?.value;

  if (!userId) {
    return NextResponse.redirect(new URL('/api/auth/whop', req.url));
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return NextResponse.redirect(new URL('/api/auth/whop', req.url));
  }

  // Check if user has active membership in Whop
  if (user.membershipId) {
    const isActive = await verifyWhopMembership(user.membershipId);
    
    if (!isActive) {
      // Membership expired - redirect to Whop
      return NextResponse.redirect(
        new URL('https://whop.com/checkout/your-product-id', req.url)
      );
    }
  }

  // Allow access
  return NextResponse.next();
}

/**
 * Check if user has access based on role
 */
export function requireRole(allowedRoles: string[]) {
  return async (req: NextRequest) => {
    const userId = req.cookies.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.next();
  };
}
