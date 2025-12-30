# RAGuard Production Setup Guide

This guide walks you through connecting Supabase, Auth0, and Stripe to your RAGuard deployment.

## Prerequisites

- AWS Console access (for deployment)
- Supabase account
- Auth0 account
- Stripe account

---

## 1. Supabase Setup

### Create Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and keys from Settings > API

### Run Migrations
1. Go to SQL Editor in Supabase dashboard
2. Copy and run the contents of `supabase/migrations/001_initial_schema.sql`
3. Copy and run the contents of `supabase/migrations/002_seed_data.sql` (optional - adds demo data)

### Get Credentials
From Settings > API, copy:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 2. Auth0 Setup

### Create Application
1. Go to [auth0.com](https://auth0.com) and create a new tenant (or use existing)
2. Create a new **Regular Web Application**
3. Note your Domain, Client ID, and Client Secret

### Configure URLs
In your Auth0 application settings, add:

**Allowed Callback URLs:**
```
http://localhost:3000/api/auth/callback
https://your-domain.com/api/auth/callback
```

**Allowed Logout URLs:**
```
http://localhost:3000
https://your-domain.com
```

**Allowed Web Origins:**
```
http://localhost:3000
https://your-domain.com
```

### Generate Secret
Generate a random secret for session encryption:
```bash
openssl rand -hex 32
```

### Environment Variables
```env
AUTH0_SECRET=your_generated_secret_from_above
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret
```

For production, update `AUTH0_BASE_URL` to your actual domain.

---

## 3. Stripe Setup

### Create Products & Prices
1. Go to [stripe.com](https://stripe.com) dashboard
2. Create Products for each plan:

**Free Plan** (optional - no payment needed)

**Pro Plan - $249/month:**
- Create product "RAGuard Pro"
- Add monthly price: $249
- Copy the price ID (starts with `price_`)

**Business Plan - $649/month:**
- Create product "RAGuard Business"
- Add monthly price: $649
- Copy the price ID

### Get API Keys
From Developers > API keys:
- **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **Secret key** → `STRIPE_SECRET_KEY`

### Set Up Webhook
1. Go to Developers > Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
4. Copy the webhook signing secret → `STRIPE_WEBHOOK_SECRET`

### Environment Variables
```env
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_PRO=price_xxx
STRIPE_PRICE_BUSINESS=price_xxx
```

---

## 4. Backend Services (AWS)

Your existing AWS instances:

### Text Defense Service
- **URL:** `http://3.18.141.124:9000`
- Set: `RAGAURD_DEFENSE_URL=http://3.18.141.124:9000`

### Red Team Service
- **URL:** `http://18.188.163.13`
- Set: `RAGAURD_REDTEAM_URL=http://18.188.163.13`

### Audio Defense Service (Optional)
If you have an audio deepfake detection service:
- Set: `RAGAURD_AUDIO_URL=http://your-audio-instance:5000`

### Internal API Secret
Generate a secret for internal service communication:
```bash
openssl rand -hex 32
```
Set: `RAGAURD_API_SECRET=your_generated_secret`

---

## 5. Complete .env.local

Create `.env.local` in your project root:

```env
# ===================
# SUPABASE
# ===================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# ===================
# AUTH0
# ===================
AUTH0_SECRET=your_generated_secret
AUTH0_BASE_URL=https://your-domain.com
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret

# ===================
# STRIPE
# ===================
STRIPE_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_PRO=price_xxx
STRIPE_PRICE_BUSINESS=price_xxx

# ===================
# BACKEND SERVICES
# ===================
RAGAURD_API_SECRET=your_internal_secret
RAGAURD_DEFENSE_URL=http://3.18.141.124:9000
RAGAURD_REDTEAM_URL=http://18.188.163.13
RAGAURD_AUDIO_URL=http://your-audio-instance:5000

# ===================
# EMAIL (Optional)
# ===================
RESEND_API_KEY=re_xxx

# ===================
# APP
# ===================
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## 6. Deployment to AWS

### Option A: EC2 Instance

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Clone repo
git clone https://github.com/your-repo/ragaurd.git
cd ragaurd

# Install dependencies
npm install

# Create .env.local with your values
nano .env.local

# Build
npm run build

# Start with PM2
npm install -g pm2
pm2 start npm --name "ragaurd" -- start
pm2 save
```

### Option B: AWS Amplify

1. Connect your GitHub repo to Amplify
2. Add environment variables in Amplify Console > Environment Variables
3. Deploy

### Option C: Vercel (Easiest)

1. Import project to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

---

## 7. Testing

### Test Text Defense
```bash
curl -X POST https://your-domain.com/api/v1/defend \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"input": "Hello, how are you?", "profile": "balanced"}'
```

### Test Audio Defense
```bash
# Base64 encode a small audio file
AUDIO_DATA=$(base64 -w 0 test-audio.wav)

curl -X POST https://your-domain.com/api/v1/defend/audio \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"audio\": {\"data\": \"$AUDIO_DATA\", \"format\": \"wav\"}, \"profile\": \"balanced\"}"
```

---

## VAPI Integration

Once deployed, integrate with VAPI:

```javascript
// In your VAPI webhook handler
const RAGAURD_URL = 'https://your-domain.com';
const RAGAURD_API_KEY = 'rg_live_your_api_key';

async function checkMessage(userMessage) {
  const response = await fetch(`${RAGAURD_URL}/api/v1/defend`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RAGAURD_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: userMessage,
      profile: 'balanced'
    })
  });

  const result = await response.json();
  return result.allowed;
}
```

---

## Troubleshooting

### Supabase Connection Failed
- Check your `SUPABASE_SERVICE_ROLE_KEY` is correct (not the anon key)
- Ensure your IP is not blocked in Supabase settings

### Auth0 Callback Error
- Verify callback URLs match exactly (including trailing slashes)
- Check `AUTH0_BASE_URL` matches your actual domain

### Stripe Webhook Failures
- Ensure webhook endpoint is publicly accessible
- Check `STRIPE_WEBHOOK_SECRET` matches your webhook
- Verify SSL certificate is valid

### Defense API Timeout
- Check AWS security groups allow traffic on ports 9000, 5000
- Verify EC2 instances are running
- Check instance health in AWS Console

---

*For support, contact: support@ragaurd.com*
