# 🚀 Production Deployment Guide

## Prerequisites

- [ ] Whop API credentials (Client ID & Secret)
- [ ] PostgreSQL database (v14+)
- [ ] Redis instance (v7+)
- [ ] Domain name configured
- [ ] SSL certificate setup

## 1. Whop App Configuration

### Create Whop App
1. Go to [Whop Developer Portal](https://whop.com/apps)
2. Create a new app
3. Configure OAuth settings:
   - **Redirect URI**: `https://yourdomain.com/api/auth/callback/whop`
   - **Scopes**: `openid`, `profile`, `email`
4. Save your **Client ID** and **Client Secret**

### Setup Webhooks
1. In Whop Dashboard → Webhooks
2. Add webhook endpoint: `https://yourdomain.com/api/webhooks/whop`
3. Subscribe to events:
   - `membership.went_valid`
   - `membership.went_invalid`
   - `payment.succeeded`
   - `review.created`
4. Save the **Webhook Secret**

## 2. Environment Variables

Create `.env.production` file:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Redis
REDIS_URL="redis://:password@host:6379"

# Whop OAuth
WHOP_CLIENT_ID="your_client_id_here"
WHOP_CLIENT_SECRET="your_client_secret_here"
WHOP_REDIRECT_URI="https://yourdomain.com/api/auth/callback/whop"
WHOP_WEBHOOK_SECRET="your_webhook_secret_here"

# Email (Resend)
RESEND_API_KEY="re_..."

# App Configuration
APP_URL="https://yourdomain.com"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"

# Security
NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# Environment
NODE_ENV="production"
EMBEDDED_IN_WHOP="false"  # Set to "true" if embedding in Whop iframe
```

## 3. Database Setup

```bash
# Push database schema
npm run db:push

# Seed initial data (badges, rules)
npm run db:seed
```

## 4. Deployment Options

### Option A: Docker (Recommended)

```bash
# Build and start all services
docker-compose up -d

# Check logs
docker-compose logs -f web

# Stop services
docker-compose down
```

### Option B: Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

3. Set environment variables in Vercel dashboard
4. Configure PostgreSQL (Vercel Postgres or external)
5. Configure Redis (Upstash recommended)

### Option C: Railway/Render

1. Connect GitHub repository
2. Add environment variables
3. Add PostgreSQL & Redis services
4. Deploy

## 5. Post-Deployment

### Test OAuth Flow
1. Visit `https://yourdomain.com`
2. Click "Login with Whop"
3. Authorize the app
4. Verify redirect to dashboard

### Test Webhooks
1. In Whop Dashboard, send test webhook
2. Check logs: `docker-compose logs web`
3. Verify event processing in database

### Monitor
```bash
# Application logs
docker-compose logs -f web

# Database status
docker-compose exec db psql -U gamify -d whop_gamify -c "SELECT COUNT(*) FROM \"User\";"

# Redis status
docker-compose exec redis redis-cli PING
```

## 6. Scaling Considerations

### Background Jobs (Optional)
If you need async processing:

```bash
# Start BullMQ worker
npm run queue:worker
```

### CDN Setup
- Configure Cloudflare or similar CDN
- Cache static assets
- Enable DDoS protection

### Database Optimization
- Enable connection pooling (PgBouncer)
- Add read replicas for high traffic
- Setup automated backups

## 7. Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database firewall configured
- [ ] Rate limiting enabled (Cloudflare/Nginx)
- [ ] Webhook signature verification active
- [ ] CORS properly configured
- [ ] Regular dependency updates

## 8. Monitoring Setup

### Add Error Tracking (Optional)
```bash
npm install @sentry/nextjs
```

### Health Check Endpoints
- `GET /api/webhooks/whop` - Returns `{"status":"ok"}`
- `GET /api/health` - Add custom health check

## 9. Troubleshooting

### OAuth not working?
- Verify redirect URI matches exactly
- Check client ID/secret are correct
- Ensure HTTPS is enabled

### Webhooks failing?
- Check webhook secret matches
- Verify endpoint is publicly accessible
- Review webhook signature verification

### Database connection errors?
- Verify DATABASE_URL format
- Check firewall allows connections
- Test with: `npx prisma db pull`

## Support

For issues, check:
- [Whop API Docs](https://docs.whop.com)
- Application logs
- Database logs
- GitHub Issues

---

## Quick Deploy Commands

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Build for production
npm run build

# Start production server
npm start

# Or use Docker
docker-compose up -d
```
