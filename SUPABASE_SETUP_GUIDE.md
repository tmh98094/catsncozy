# 🚀 Supabase Setup Guide

## Why Supabase?

**Problem with GitHub Storage:**
- Every data change creates a new commit
- Triggers Vercel deployments (hitting limits)
- 490+ commits from normal usage
- Not designed for database operations

**Supabase Benefits:**
- Real database (PostgreSQL)
- No deployment triggers
- Instant updates
- Better performance
- Built for this use case

## Setup Steps

### 1. Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub (free tier available)
3. Create a new project
4. Choose a region close to you

### 2. Get Your Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`)

### 3. Update Environment Variables
Edit your `.env.local` file:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Create Database Tables
In your Supabase dashboard, go to **SQL Editor** and run this script:

```sql
-- Create cats table
CREATE TABLE cats (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  dateOfBirth TEXT NOT NULL,
  breed TEXT NOT NULL,
  gender TEXT NOT NULL,
  image TEXT NOT NULL,
  personality JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create testimonials table
CREATE TABLE testimonials (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  feedback TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE services (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  price TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create about_gallery table
CREATE TABLE about_gallery (
  id BIGINT PRIMARY KEY,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create facility_gallery table
CREATE TABLE facility_gallery (
  id BIGINT PRIMARY KEY,
  image TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE cats ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE facility_gallery ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read/write (for demo purposes)
-- In production, you'd want more restrictive policies

CREATE POLICY "Allow all operations on cats" ON cats FOR ALL USING (true);
CREATE POLICY "Allow all operations on testimonials" ON testimonials FOR ALL USING (true);
CREATE POLICY "Allow all operations on services" ON services FOR ALL USING (true);
CREATE POLICY "Allow all operations on about_gallery" ON about_gallery FOR ALL USING (true);
CREATE POLICY "Allow all operations on facility_gallery" ON facility_gallery FOR ALL USING (true);
```

### 5. Test the Connection
1. Restart your development server: `npm run dev`
2. Go to the admin panel
3. You should see "Supabase Connected" in the dashboard
4. Try adding/editing a cat to test the connection

## Migration from GitHub

Your existing data will automatically migrate:
1. First load will use localStorage/GitHub data as fallback
2. When you make changes, they'll save to Supabase
3. Future loads will come from Supabase
4. GitHub storage becomes backup only

## Benefits You'll See

✅ **No more deployment spam** - Changes don't trigger Vercel builds
✅ **Real-time updates** - Changes appear instantly
✅ **Better performance** - Database queries vs file operations
✅ **Scalability** - Handle thousands of records easily
✅ **Backup safety** - Professional database with backups
✅ **Multi-user support** - Multiple admins can work simultaneously

## Troubleshooting

### "Supabase Offline" showing?
1. Check your `.env.local` file has correct URL and key
2. Verify the database tables exist
3. Check browser console for error messages
4. Restart development server

### Data not saving?
1. Check RLS policies are created
2. Verify table structure matches the SQL above
3. Look for errors in browser console

### Still seeing GitHub commits?
- Supabase will be used for new changes
- GitHub is kept as fallback system
- Old GitHub auto-save will stop being used

## Production Deployment

For Vercel/Netlify deployment:
1. Add environment variables in your hosting platform:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
2. Deploy normally - no special configuration needed

## Security Notes

- The anon key is safe to expose (it's designed for client-side use)
- RLS policies control what data can be accessed
- For production, consider more restrictive policies
- Supabase has built-in rate limiting and DDoS protection

---

**Ready to switch?** Just add your Supabase credentials to `.env.local` and restart your dev server!