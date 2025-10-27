import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * Whop OAuth Callback Handler
 * GET /api/auth/callback/whop
 * 
 * Receives authorization code from Whop and exchanges it for access token
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      `${process.env.APP_URL}/?error=oauth_failed`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${process.env.APP_URL}/?error=missing_code`
    );
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://api.whop.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.WHOP_CLIENT_ID,
        client_secret: process.env.WHOP_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.WHOP_REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const { access_token } = await tokenResponse.json();

    // Fetch user profile from Whop
    const userResponse = await fetch('https://api.whop.com/api/v2/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const whopUser = await userResponse.json();

    // Create or update user in database
    const user = await prisma.user.upsert({
      where: { whopUserId: whopUser.id },
      update: {
        email: whopUser.email,
        displayName: whopUser.username || whopUser.name,
        avatarUrl: whopUser.profile_pic_url,
        lastLoginAt: new Date(),
      },
      create: {
        whopUserId: whopUser.id,
        email: whopUser.email,
        displayName: whopUser.username || whopUser.name,
        avatarUrl: whopUser.profile_pic_url,
        lastLoginAt: new Date(),
        role: 'FREE',  // Default to FREE tier
      },
    });

    // Set session cookie (simplified - use proper session management in production)
    const response = NextResponse.redirect(
      `${process.env.APP_URL}/dashboard`
    );
    
    response.cookies.set('user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      `${process.env.APP_URL}/?error=oauth_error`
    );
  }
}
