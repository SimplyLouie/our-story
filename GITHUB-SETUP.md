# Wedding Website - GitHub Setup

## Quick Deploy to GitHub Pages

### 1. Initialize Git Repository
```bash
cd /Users/louie.mendez/Downloads/wedding-project
git init
git add .
git commit -m "Initial commit: Wedding website with Phase 1 & 2 features"
```

### 2. Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `wedding-website` (or your preferred name)
3. Keep it **Private** (recommended for wedding sites)
4. Don't initialize with README (we already have files)
5. Click "Create repository"

### 3. Push to GitHub
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/wedding-website.git
git branch -M main
git push -u origin main
```

### 4. Deploy to Vercel (Recommended)

**Why Vercel?**
- Free hosting
- Automatic deployments on push
- Custom domain support
- Works perfectly with Vite

**Steps:**
1. Go to https://vercel.com/signup
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your `wedding-website` repository
5. Configure:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add Environment Variables (if using Firebase):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_PROJECT_ID`
   - etc.
7. Click "Deploy"

Your site will be live at: `https://your-project.vercel.app`

### 5. Alternative: GitHub Pages

**Note:** GitHub Pages works but requires extra configuration for client-side routing.

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

Then enable GitHub Pages:
1. Go to repository Settings → Pages
2. Source: `gh-pages` branch
3. Save

Site will be at: `https://YOUR_USERNAME.github.io/wedding-website/`

---

## Environment Variables

Create `.env` file (already in `.gitignore`):

```env
# Firebase Config
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**For Vercel:** Add these in Project Settings → Environment Variables

---

## Custom Domain Setup

### Vercel:
1. Go to Project Settings → Domains
2. Add your domain (e.g., `louieandflorie.com`)
3. Follow DNS configuration instructions
4. Vercel provides free SSL certificate

### GitHub Pages:
1. Settings → Pages → Custom domain
2. Add your domain
3. Configure DNS with your registrar:
   - Add A records or CNAME
4. Enable "Enforce HTTPS"

---

## Recommended .gitignore

Already configured, but verify these are included:

```
# Dependencies
node_modules/

# Build output
dist/
dist-ssr/
*.local

# Environment variables
.env
.env.local
.env.production

# Firebase
.firebase/
firebase-debug.log

# Editor
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

---

## Continuous Deployment

Once connected to Vercel:
1. Push to `main` branch → Auto-deploys to production
2. Push to other branches → Creates preview deployments
3. Pull requests → Automatic preview links

```bash
# Make changes
git add .
git commit -m "Updated gallery images"
git push

# Vercel automatically deploys! 🚀
```

---

## Security Notes

1. **Firebase Rules:** Set up properly (see `FIREBASE-RULES-SETUP.md`)
2. **Admin Password:** Change from default in Admin Panel
3. **Private Repo:** Keep repository private if contains sensitive data
4. **Environment Variables:** Never commit `.env` file
5. **API Keys:** Use Firebase security rules, not just env vars

---

## Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Vite Deployment:** https://vitejs.dev/guide/static-deploy.html
- **Firebase Hosting:** https://firebase.google.com/docs/hosting

Your wedding website is ready to go live! 🎉
