# Quick Start Guide - Cats & Cozy Admin

## 🚀 Get Started in 3 Steps

### 1️⃣ Setup ImgBB (Image Uploads)
**Time: 2 minutes**

1. Go to: https://api.imgbb.com/
2. Sign up and get API key
3. Open `components/Admin.tsx`
4. Replace: `const IMGBB_API_KEY = 'YOUR_IMGBB_API_KEY';`
5. With: `const IMGBB_API_KEY = 'your-actual-key';`

✅ **Done!** You can now upload images directly in admin panel.

---

### 2️⃣ Setup GitHub Storage (Multi-Device Sync)
**Time: 10 minutes**

1. **Get GitHub Token:**
   - GitHub.com → Settings → Developer settings
   - Personal access tokens → Generate new token (classic)
   - Check `repo` scope → Generate
   - Copy token (starts with `ghp_`)

2. **Configure App:**
   - Open `App.tsx`
   - Find `GITHUB_CONFIG` (around line 20)
   - Replace:
     ```typescript
     owner: 'YOUR_GITHUB_USERNAME',    // Your GitHub username
     repo: 'YOUR_REPO_NAME',           // Your repo name
     token: 'YOUR_GITHUB_TOKEN',       // Token from step 1
     ```

3. **Push Data Folder:**
   ```bash
   git add data/
   git commit -m "Add data folder"
   git push
   ```

✅ **Done!** Changes now sync across all devices.

---

### 3️⃣ Use Your Admin Panel
**Password: `admin`**

**Add a Cat:**
1. Admin → Manage Cats → Add Cat
2. Click upload area to add photo
3. Fill in name, age, breed, personality
4. Save → Automatically syncs to GitHub!

**Edit Content:**
- All changes save automatically
- Works on any device
- Version history on GitHub

**Export Backup:**
- Click "Export" button
- Downloads JSON file
- Keep as backup

---

## 📁 Project Structure

```
cats-and-cozy/
├── components/
│   ├── Hero.tsx          # Homepage with all sections
│   ├── Adoption.tsx      # Cat adoption page
│   ├── Boarding.tsx      # Boarding services page
│   └── Admin.tsx         # Admin panel (image upload here)
├── utils/
│   ├── githubStorage.ts  # GitHub API integration
│   └── dataManager.ts    # Data loading/saving
├── data/
│   ├── cats.json         # All cats data
│   ├── testimonials.json # Customer reviews
│   └── services.json     # Boarding packages
├── App.tsx               # Main app (GitHub config here)
└── constants.ts          # Initial data & constants
```

---

## 🎨 What's on the Homepage

1. **Hero Section** - Big title, CTA buttons
2. **About Us** - Sticky scroll gallery with stats
3. **Features Grid** - 6 premium care features
4. **Facility Gallery** - 6 photos of your facility
5. **How It Works** - Adoption & boarding process
6. **FAQ Section** - 6 common questions
7. **Location & Contact** - Map, address, hours
8. **Testimonials** - Customer reviews
9. **Adoption Advocacy** - "Be Their Hero" CTA
10. **Footer** - Links and admin login

---

## 💾 How Data Saves

```
You edit in Admin Panel
        ↓
Saves to localStorage (instant)
        ↓
Saves to GitHub (background)
        ↓
All devices see changes
```

**Fallback:** If GitHub fails, localStorage still works!

---

## 🔧 Common Tasks

### Change Homepage Text
Edit `components/Hero.tsx` - all text is there

### Change Colors
Edit `index.html` - Tailwind config at top:
```javascript
colors: {
  'cat-blue': '#8CE4FF',
  'cat-yellow': '#FEEE91',
  'cat-orange': '#FFA239',
  'cat-red': '#FF5656',
}
```

### Add More Cats
Admin panel → Add Cat → Upload & save

### Update Prices
Admin panel → Manage Services → Edit

### Add Testimonials
Admin panel → Manage Testimonials → Add

---

## 📱 Admin Panel Features

### Manage Cats
- Add/Edit/Delete cats
- Upload photos directly
- Set personality traits
- Filter by category

### Manage Testimonials
- Add customer reviews
- Upload profile photos
- Edit feedback text

### Manage Services
- Update prices
- Change descriptions
- Add gallery images

### Export/Import
- **Export:** Backup all data as JSON
- **Import:** Restore from backup
- Transfer between devices

---

## 🌐 Deploy Your Website

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

Add environment variables in Vercel dashboard:
- `VITE_GITHUB_TOKEN`
- `VITE_GITHUB_OWNER`
- `VITE_GITHUB_REPO`

### Option 2: Netlify
1. Connect GitHub repo
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables

### Option 3: GitHub Pages
```bash
npm run build
# Deploy dist/ folder
```

---

## 🔒 Security Checklist

- [ ] GitHub token has only `repo` scope
- [ ] Token stored in environment variables (production)
- [ ] `.env.local` in `.gitignore`
- [ ] Admin password changed from "admin"
- [ ] Repository is private (if needed)

---

## 📚 Full Documentation

- **GitHub Setup:** `GITHUB_SETUP_GUIDE.md`
- **ImgBB Setup:** `IMGBB_SETUP_GUIDE.md`
- **Implementation Details:** `IMPLEMENTATION_GUIDE.md`
- **Data Options:** `DATA_PERSISTENCE_OPTIONS.md`

---

## ✅ Quick Checklist

**Setup:**
- [ ] ImgBB API key added
- [ ] GitHub token configured
- [ ] Data folder pushed to GitHub
- [ ] Admin panel shows "GitHub Connected"

**Test:**
- [ ] Upload an image
- [ ] Add a cat
- [ ] Check GitHub for changes
- [ ] Test on another device

**Deploy:**
- [ ] Environment variables set
- [ ] Website deployed
- [ ] Admin panel works on live site

---

## 🆘 Quick Troubleshooting

**Images not uploading?**
→ Check ImgBB API key in `Admin.tsx`

**Changes not syncing?**
→ Check GitHub token in `App.tsx`

**"Local Storage Only" showing?**
→ Token not configured or incorrect

**Admin panel not loading?**
→ Check browser console (F12) for errors

---

## 🎯 You're Ready!

Your admin panel is now a full content management system:
- ✅ Upload images without leaving the page
- ✅ Changes sync across all devices
- ✅ Never lose data (GitHub backup)
- ✅ Version history for all changes
- ✅ Export/import for backups

**Start managing your content!** 🐱
