# GitHub Pages Deployment Guide

## Quick Deploy Steps

### 1. Update vite.config.ts

Add your GitHub repository name as the base path:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/wedding-website/', // Change this to your repo name!
})
```

**Important:** Replace `/wedding-website/` with your actual repository name.

If deploying to a custom domain or root, use `base: '/'`

### 2. Initialize Git & Push to GitHub

```bash
cd /Users/louie.mendez/Downloads/wedding-project

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Wedding website"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 3. Deploy to GitHub Pages

```bash
npm run deploy
```

This will:
1. Build your project (`npm run build`)
2. Push `dist` folder to `gh-pages` branch
3. Make site live at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

### 4. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select: **Branch: gh-pages** → **/ (root)**
4. Click **Save**

Your site will be live in 1-2 minutes! 🎉

---

## Custom Domain (Optional)

### Add Custom Domain:
1. In GitHub repo: Settings → Pages → Custom domain
2. Enter your domain (e.g., `louieandflorie.com`)
3. Add DNS records at your domain registrar:
   - **A Records** point to GitHub IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Or **CNAME** pointing to `YOUR_USERNAME.github.io`
4. Enable "Enforce HTTPS" (after DNS propagates)

### Update vite.config.ts for custom domain:
```typescript
base: '/', // Use root for custom domains
```

Then redeploy:
```bash
npm run deploy
```

---

## Subsequent Deployments

After making changes:

```bash
git add .
git commit -m "Updated gallery/content/etc"
git push

# Deploy to GitHub Pages
npm run deploy
```

---

## Troubleshooting

**404 Error on routes?**
- GitHub Pages doesn't support client-side routing by default
- Add a `404.html` that redirects to `index.html`
- Or use hash routing

**Assets not loading?**
- Check `base` in `vite.config.ts` matches repo name
- Ensure it ends with `/`

**Deploy failed?**
- Run `npm run build` first to check for errors
- Ensure `gh-pages` branch exists
- Check GitHub Pages settings

**Environment variables not working?**
- GitHub Pages is static - can't hide API keys
- Use Firebase security rules instead
- Consider Vercel for better env var support

---

## Alternative: Vercel (Recommended)

Vercel is easier and has better features:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Link to project & deploy to production
vercel --prod
```

**Benefits:**
- Automatic deployments on push
- Environment variables support
- Better performance
- Free custom domains
- No base path needed

Choose GitHub Pages for simplicity, Vercel for production sites!

---

Your wedding website is ready to deploy! 🚀
