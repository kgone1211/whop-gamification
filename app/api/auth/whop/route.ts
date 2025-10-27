import { NextRequest, NextResponse } from 'next/server';

/**
 * Whop OAuth - Initiate Login
 * GET /api/auth/whop
 */
export async function GET(req: NextRequest) {
  const clientId = process.env.WHOP_CLIENT_ID;
  const redirectUri = process.env.WHOP_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: 'Whop OAuth not configured' },
      { status: 500 }
    );
  }

  // Build Whop authorization URL
  const authUrl = new URL('https://whop.com/oauth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid profile email');

  return NextResponse.redirect(authUrl.toString());
}
