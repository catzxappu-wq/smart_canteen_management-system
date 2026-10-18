# SMART CANTEEN MANAGEMENT SYSTEM
## Step-by-Step Deployment & Production Configuration Guide

---

## 1. LOCAL DEVELOPMENT SETUP

### Prerequisites
- Node.js v18.0 or newer
- npm v9.0 or newer
- Git

### Installation Steps
```bash
# 1. Clone repository or navigate to project directory
cd smart-canteen-system

# 2. Install dependencies
npm install

# 3. Create your local environment configuration
cp .env.example .env

# 4. Start the local Vite development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 2. SUPABASE BACKEND CONFIGURATION

### Step 2.1: Create a Supabase Project
1. Log into [Supabase Dashboard](https://supabase.com).
2. Click **New Project**.
3. Choose your organization, set Project Name to `smart-canteen`, choose a strong database password, and select your nearest region.
4. Once provisioned, navigate to **Project Settings -> API** and copy:
   - `Project URL` (e.g. `https://xyzproject.supabase.co`)
   - `anon / public` API key
   - `service_role` secret key (keep this strictly private)

### Step 2.2: Execute Database Migrations
1. In the Supabase Dashboard, open **SQL Editor**.
2. Click **New Query**.
3. Copy and paste the contents of `supabase/migrations/20261018000001_initial_schema.sql` and click **Run**.
   - This creates all 8 tables, sequences, functions, triggers, and Row Level Security (RLS) policies.
4. Copy and paste the contents of `supabase/migrations/20261018000002_realtime_and_storage.sql` and click **Run**.
   - This enables Realtime replication on `orders` and creates the `food-images` storage bucket.
5. Copy and paste the contents of `supabase/seed.sql` and click **Run**.
   - This seeds initial canteen categories and 14 authentic college food items.

### Step 2.3: Create Initial Trusted Administrator Account
Public registration automatically designates users with `role = 'student'`. To establish an administrator:
1. Navigate to **Authentication -> Users** in Supabase and click **Add User**.
2. Create an account with:
   - Email: `admin@campus.edu`
   - Password: `YourSecurePassword123`
   - Auto Confirm User: Checked
3. In the SQL Editor, execute this query to elevate the account to admin:
```sql
UPDATE public.profiles
SET role = 'admin', full_name = 'Head Chef Suresh'
WHERE email = 'admin@campus.edu';
```

---

## 3. RAZORPAY PAYMENT GATEWAY CONFIGURATION

### Step 3.1: Obtain Test API Keys
1. Register or log in to the [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Switch to **Test Mode** (toggle in the upper right).
3. Navigate to **Settings -> API Keys**.
4. Click **Generate Test Key** and save:
   - `Key ID` (starts with `rzp_test_...`)
   - `Key Secret`

### Step 3.2: Set Up Webhooks (Optional for production)
1. Go to **Settings -> Webhooks -> Add New Webhook**.
2. Set Webhook URL to:
   `https://<your-project-id>.supabase.co/functions/v1/razorpay-webhook`
3. Select Active Events:
   - `payment.captured`
   - `payment.failed`
   - `order.paid`
4. Enter a secret token and set `RAZORPAY_WEBHOOK_SECRET` in your Supabase Edge Function secrets.

---

## 4. ENVIRONMENT VARIABLES CONFIGURATION

Configure `.env` in the root of your project:

```ini
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Razorpay Test Key (Frontend Checkout)
VITE_RAZORPAY_KEY_ID=rzp_test_yourKeyHere

# Optional Application Info
VITE_APP_NAME="Smart Canteen System"
VITE_CANTEEN_CAMPUS="Engineering Food Court, Ground Floor"
```

---

## 5. VERCEL DEPLOYMENT PROCEDURE

### Step 5.1: Push Project to GitHub
```bash
git init
git add .
git commit -m "feat: complete Smart Canteen Management System"
git branch -M main
git remote add origin https://github.com/your-username/smart-canteen-system.git
git push -u origin main
```

### Step 5.2: Import to Vercel
1. Log in to [Vercel Dashboard](https://vercel.com).
2. Click **Add New -> Project**.
3. Select your `smart-canteen-system` GitHub repository.
4. Configure Build and Output Settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_RAZORPAY_KEY_ID`
   - `VITE_APP_NAME`
6. Click **Deploy**.

The `vercel.json` file included in this repository handles SPA routing rewrites automatically, ensuring that refreshes on `/track-order/:id` and `/admin/dashboard` resolve correctly.

---

## 6. PRE-DEMO VERIFICATION CHECKLIST

- [x] Run `npm test` and verify all 11 unit & integration tests pass.
- [x] Run `npm run build` and ensure `dist/` builds with zero errors.
- [x] Log into Student portal with demo account `student@campus.edu`.
- [x] Add items to tray, verify subtotal and 5% GST computation.
- [x] Complete checkout using Razorpay Test Sandbox or Cash at Counter.
- [x] Confirm unique order token format `SC-2026-XXXXX` and pickup QR code.
- [x] Switch to Admin role with demo account `admin@campus.edu`.
- [x] Verify live kitchen ticket appears and progress status: Confirmed -> Preparing -> Ready.
- [x] Check that student tracking screen updates to 'Ready for Pickup' in real time.
- [x] Export Sales Report to CSV and verify transaction data.
