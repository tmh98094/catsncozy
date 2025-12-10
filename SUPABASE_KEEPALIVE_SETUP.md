# 🔄 Supabase Keep-Alive Setup

## Problem
Supabase Free Tier pauses projects after **7 days of inactivity** to conserve resources. This means:
- No API requests for 7 days = project pauses
- Users get errors when trying to access your site
- You need to manually wake it up

## Solution
Automated GitHub Action that pings Supabase **every 2 days** to keep it active.

## 🚀 Setup Instructions

### 1. Add Supabase Secrets to GitHub

1. Go to your GitHub repository: `https://github.com/tmh98094/catsncozy`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:

   **Secret 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)

   **Secret 2:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: Your Supabase anon key

### 2. Set Up Heartbeat Table in Supabase

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `scripts/supabase-heartbeat-setup.sql`
4. Click **Run** to execute

This creates:
- `heartbeat` table for tracking pings
- `heartbeat_status` view for monitoring
- Required functions and policies

### 3. Test the Setup

**Manual Test:**
```bash
npm run ping-supabase
```

**GitHub Actions Test:**
1. Go to your repo → **Actions** tab
2. Find "Keep Supabase Active" workflow
3. Click **Run workflow** → **Run workflow**
4. Check if it runs successfully

## 📅 How It Works

### Schedule
- **Frequency**: Every 2 days at 2:00 AM UTC
- **Safety margin**: 7-day limit ÷ 2-day pings = 3.5x safety buffer
- **Manual trigger**: Available anytime via GitHub Actions

### What It Does
1. Connects to your Supabase database
2. Performs a lightweight operation (timestamp update)
3. Logs success/failure
4. Keeps your project active

### Monitoring
Check heartbeat status in Supabase:
```sql
SELECT * FROM heartbeat_status;
```

Results:
- **Active**: Last ping < 48 hours ago ✅
- **Warning**: Last ping 48-168 hours ago ⚠️
- **Inactive Risk**: Last ping > 168 hours ago ❌

## 🔧 Files Created

```
.github/workflows/keep-supabase-active.yml  # GitHub Action workflow
scripts/ping-supabase.js                    # Ping script
scripts/supabase-heartbeat-setup.sql        # Database setup
SUPABASE_KEEPALIVE_SETUP.md                 # This guide
```

## 🛡️ Safety Features

### Graceful Failures
- Won't fail if Supabase isn't configured yet
- Handles connection errors gracefully
- Logs helpful messages for debugging

### Minimal Impact
- Lightweight database operation (single row update)
- Runs only every 2 days
- Uses existing infrastructure (GitHub Actions)

### No Cost Impact
- Uses GitHub Actions free tier (2000 minutes/month)
- Each run takes ~30 seconds
- Monthly usage: ~7.5 minutes (well within limits)

## 📊 Expected Results

### Before Setup
```
Day 1-6: Normal usage ✅
Day 7: Project pauses ❌
Day 8+: Users get errors ❌
```

### After Setup
```
Day 1: Normal usage ✅
Day 2: Auto-ping keeps active ✅
Day 4: Auto-ping keeps active ✅
Day 6: Auto-ping keeps active ✅
Day 8: Auto-ping keeps active ✅
Forever: Always active ✅
```

## 🔍 Troubleshooting

### "Workflow not running"
1. Check GitHub secrets are set correctly
2. Verify workflow file is in `.github/workflows/`
3. Check Actions tab for error messages

### "Ping script failing"
1. Verify Supabase credentials in GitHub secrets
2. Check if heartbeat table exists in Supabase
3. Run manual test: `npm run ping-supabase`

### "Supabase still pausing"
1. Check workflow run history in GitHub Actions
2. Verify heartbeat_status in Supabase shows recent pings
3. Ensure no other issues (billing, account problems)

## ✅ Verification Checklist

- [ ] GitHub secrets added (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [ ] Heartbeat SQL script executed in Supabase
- [ ] Manual ping test successful (`npm run ping-supabase`)
- [ ] GitHub Action workflow runs successfully
- [ ] Heartbeat status shows "Active" in Supabase

## 🎯 Benefits

✅ **Never lose users** - Site always accessible
✅ **Zero maintenance** - Fully automated
✅ **Cost effective** - Uses free tiers only
✅ **Reliable** - Multiple safety margins
✅ **Transparent** - Full logging and monitoring

Your Supabase project will now stay active indefinitely! 🚀