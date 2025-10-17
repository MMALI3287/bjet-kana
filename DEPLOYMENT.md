# BJET Kana - Deployment Guide

## Quick Deploy to Vercel (Recommended - FREE)

### Option 1: Using Vercel CLI (Fastest)

1. **Install Vercel CLI globally:**

   ```bash
   npm install -g vercel
   ```

2. **Navigate to project directory:**

   ```bash
   cd G:/kana/bjet-kana
   ```

3. **Deploy:**

   ```bash
   vercel
   ```

   - First time: Login with GitHub/GitLab/Email
   - Answer setup questions:
     - Set up and deploy? **Y**
     - Which scope? **(Select your account)**
     - Link to existing project? **N**
     - What's your project's name? **bjet-kana** (or any name)
     - In which directory is your code located? **./ (press Enter)**
     - Want to modify settings? **N**

4. **Your site will be live in ~1 minute!**

   - You'll get a URL like: `https://bjet-kana-username.vercel.app`
   - Share this link with your senior

5. **For production deployment:**
   ```bash
   vercel --prod
   ```

### Option 2: Using Vercel Website (No CLI)

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login** (use GitHub for easiest setup)
3. **Click "Add New" → "Project"**
4. **Import Git Repository:**
   - If not on Git yet, push your code to GitHub first:
     ```bash
     cd G:/kana/bjet-kana
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin YOUR_GITHUB_REPO_URL
     git push -u origin main
     ```
   - Then import the repository on Vercel
5. **Configure Project:**
   - Framework Preset: **Next.js**
   - Root Directory: **./bjet-kana** (or leave as ./)
   - Build Command: **npm run build**
   - Output Directory: **.next**
   - Install Command: **npm install**
6. **Click Deploy**
7. **Get your URL** - share with your senior!

## Alternative: Deploy to Netlify

1. Install Netlify CLI:

   ```bash
   npm install -g netlify-cli
   ```

2. Build and deploy:

   ```bash
   cd G:/kana/bjet-kana
   npm run build
   netlify deploy
   ```

3. For production:
   ```bash
   netlify deploy --prod
   ```

## Local Testing Before Deploy

```bash
# Build production version
npm run build

# Test production build locally
npm start
```

Then open http://localhost:3001 to verify everything works.

## What Your Senior Will Get

- **Live URL**: `https://your-project.vercel.app` (or custom domain)
- **Fast Loading**: Optimized production build
- **No Installation**: Works in any browser
- **Mobile Friendly**: Responsive design
- **Free Hosting**: No cost on Vercel free tier

## Troubleshooting

If build fails on Vercel:

1. Check Node version in `package.json` (add if missing):

   ```json
   "engines": {
     "node": ">=18.0.0"
   }
   ```

2. Verify all dependencies are in `package.json`

3. Check build logs on Vercel dashboard

## Updating Your Deployment

After making changes:

**With Vercel CLI:**

```bash
vercel --prod
```

**With Git + Vercel:**

```bash
git add .
git commit -m "Update"
git push
```

(Vercel auto-deploys on push if connected to Git)

---

**Choose Option 1 (Vercel CLI) for fastest deployment!**
