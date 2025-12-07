# GitHub Storage Setup Guide

## 🎯 What You'll Get

After this setup, your admin panel will:
- ✅ Save all changes to GitHub automatically
- ✅ Work on any device (phone, tablet, laptop)
- ✅ Never lose data (GitHub keeps backups)
- ✅ Track version history (undo any change)
- ✅ Work offline (saves to localStorage first)

## ⏱️ Setup Time: 10 minutes

---

## Step 1: Create GitHub Personal Access Token

### 1.1 Go to GitHub Settings
1. Log in to GitHub: https://github.com
2. Click your profile picture (top right)
3. Click **Settings**
4. Scroll down to **Developer settings** (bottom of left sidebar)
5. Click **Personal access tokens**
6. Click **Tokens (classic)**

### 1.2 Generate New Token
1. Click **Generate new token** → **Generate new token (classic)**
2. Give it a name: `Cats & Cozy Admin`
3. Set expiration: **No expiration** (or 1 year if you prefer)
4. Select scopes (permissions):
   - ✅ Check **repo** (this checks all sub-items)
   - That's all you need!
5. Scroll down and click **Generate token**

### 1.3 Copy Your Token
⚠️ **IMPORTANT:** Copy the token NOW! You won't see it again.

It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**Save it somewhere safe** (password manager, notes app, etc.)

---

## Step 2: Configure Your App

### 2.1 Open App.tsx

Find this section (around line 20):

```typescript
const GITHUB_CONFIG = {
  owner: 'YOUR_GITHUB_USERNAME',      // Replace with your GitHub username
  repo: 'YOUR_REPO_NAME',             // Replace with your repo name
  token: 'YOUR_GITHUB_TOKEN',         // Replace with your Personal Access Token
  branch: 'main'                      // Or 'master' if that's your default branch
};
```

### 2.2 Replace with Your Info

Example:
```typescript
const GITHUB_CONFIG = {
  owner: 'johnsmith',                           // Your GitHub username
  repo: 'cats-and-cozy',                        // Your repository name
  token: 'ghp_abc123xyz789...',                 // Your token from Step 1
  branch: 'main'                                // Usually 'main'
};
```

**How to find your info:**
- **owner**: Your GitHub username (in the URL: github.com/USERNAME)
- **repo**: Your repository name (the project folder name)
- **branch**: Usually `main` (check your repo's default branch)

---

## Step 3: Push Data Folder to GitHub

### 3.1 Commit the Data Folder

The `data/` folder with JSON files is already created. Now push it to GitHub:

```bash
git add data/
git commit -m "Add data folder for GitHub storage"
git push
```

### 3.2 Verify on GitHub

1. Go to your repository on GitHub
2. You should see a `data/` folder
3. Inside: `cats.json`, `testimonials.json`, `services.json`

---

## Step 4: Test It!

### 4.1 Run Your App
```bash
npm run dev
```

### 4.2 Check Connection Status

1. Go to Admin panel (password: `admin`)
2. Look under "Admin Dashboard" title
3. You should see: **"GitHub Connected"** with a green cloud icon ☁️

If you see **"Local Storage Only"** with an orange icon, check:
- Is your token correct?
- Is your username/repo name correct?
- Did you push the `data/` folder?

### 4.3 Test Saving

1. Add a new cat or edit existing one
2. Save it
3. Go to GitHub → Your repo → `data/cats.json`
4. You should see your changes!
5. Click "History" to see version history

### 4.4 Test Multi-Device

1. Open your website on another device
2. Go to Admin panel
3. Your changes should be there!

---

## 🎉 You're Done!

Your admin panel now:
- Saves to GitHub automatically
- Works on all devices
- Keeps version history
- Never loses data

---

## 🔧 Troubleshooting

### "GitHub Connected" not showing

**Check 1: Token permissions**
- Go to GitHub → Settings → Developer settings → Personal access tokens
- Make sure your token has `repo` scope checked

**Check 2: Token is correct**
- Copy-paste carefully (no extra spaces)
- Token should start with `ghp_`

**Check 3: Repository info**
- Username is correct (case-sensitive)
- Repo name is correct (case-sensitive)
- Branch name is correct (`main` or `master`)

### Changes not saving to GitHub

**Check 1: Data folder exists**
```bash
git status
```
Should show `data/` folder is tracked

**Check 2: Push the folder**
```bash
git add data/
git commit -m "Add data folder"
git push
```

**Check 3: Check browser console**
- Open DevTools (F12)
- Look for error messages
- Common issue: CORS or network errors

### "Local Storage Only" showing

This means GitHub isn't configured yet. Check:
1. Did you replace `YOUR_GITHUB_TOKEN` in App.tsx?
2. Did you save the file?
3. Did you restart the dev server?

---

## 🔒 Security Notes

### Is it safe to put my token in the code?

**For development:** Yes, if your repo is private.

**For production (deployed website):** Use environment variables:

1. Create `.env.local`:
```
VITE_GITHUB_OWNER=your-username
VITE_GITHUB_REPO=your-repo
VITE_GITHUB_TOKEN=your-token
VITE_GITHUB_BRANCH=main
```

2. Update App.tsx:
```typescript
const GITHUB_CONFIG = {
  owner: import.meta.env.VITE_GITHUB_OWNER,
  repo: import.meta.env.VITE_GITHUB_REPO,
  token: import.meta.env.VITE_GITHUB_TOKEN,
  branch: import.meta.env.VITE_GITHUB_BRANCH || 'main'
};
```

3. Add to `.gitignore`:
```
.env.local
```

### Token Permissions

Your token can only:
- ✅ Read/write files in YOUR repositories
- ❌ Cannot access other users' repos
- ❌ Cannot delete your account
- ❌ Cannot change settings

You can revoke it anytime in GitHub settings.

---

## 📊 How It Works

### Data Flow:

```
Admin Panel → Edit Cat
       ↓
Save to localStorage (instant)
       ↓
Save to GitHub (background)
       ↓
data/cats.json updated
       ↓
All devices see changes
```

### Fallback System:

1. **Try GitHub first** - Load from GitHub
2. **Fallback to localStorage** - If GitHub fails
3. **Fallback to defaults** - If both fail

This means your site works even if:
- GitHub is down
- Internet is slow
- Token expires

---

## 🎓 Advanced Features

### View Version History

1. Go to GitHub → Your repo → `data/cats.json`
2. Click **History** button
3. See all changes with timestamps
4. Click any version to see what changed

### Restore Previous Version

1. Go to version history
2. Click on old version
3. Click **Raw** button
4. Copy the JSON
5. Go to Admin → Import → Paste JSON

### Multiple Admins

Multiple people can use the admin panel:
- Each person needs the GitHub token
- Changes sync automatically
- Last save wins (no conflict resolution yet)

---

## 🚀 Next Steps

### Add Image Upload (Already Done!)

Follow `IMGBB_SETUP_GUIDE.md` to enable image uploads.

### Deploy Your Website

Your data is now in GitHub, so you can deploy to:
- Vercel (recommended)
- Netlify
- GitHub Pages
- Any static host

Just add environment variables for your token.

### Backup Strategy

GitHub already backs up your data, but you can also:
1. Use the Export button in admin panel
2. Download JSON files regularly
3. Keep them in cloud storage (Dropbox, Google Drive)

---

## ❓ Need Help?

Common issues:
1. **Token not working** → Regenerate token with `repo` scope
2. **Changes not syncing** → Check browser console for errors
3. **"Local Storage Only"** → Verify token is set in App.tsx

Still stuck? Check the browser console (F12) for error messages.

---

## ✅ Checklist

- [ ] Created GitHub Personal Access Token
- [ ] Copied token to safe place
- [ ] Updated App.tsx with token, username, repo
- [ ] Pushed `data/` folder to GitHub
- [ ] Tested admin panel shows "GitHub Connected"
- [ ] Made a test change and verified on GitHub
- [ ] Tested on another device (optional)

**All done?** You now have a professional content management system! 🎉
