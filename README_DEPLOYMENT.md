# 🚀 Quick Deployment Instructions

## Deploy to Vercel in 5 Minutes

### Method 1: Using Vercel CLI (Fastest)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel

# 4. Deploy to production
vercel --prod
```

**Done!** Your app is live at the URL provided.

---

### Method 2: Using GitHub + Vercel (Best for Updates)

#### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Emergency Incident Reporter"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/incident-reporter.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy on Vercel

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your `incident-reporter` repository
5. Click "Deploy"

**Done!** Your app is live and auto-deploys on every push.

---

## ⚠️ Important Notes

### File Storage Issue

Vercel doesn't support persistent file storage. You have options:

**Quick Fix (For Testing):**
The app will work but uploaded photos won't persist. Good for demo/testing.

**Production Fix (Recommended):**
1. Use **Vercel Blob Storage** (free):
   ```bash
   npm install @vercel/blob
   ```

2. Or use **Cloudinary** (free tier):
   ```bash
   npm install cloudinary
   ```

3. Or deploy backend to **Railway.app** (has persistent storage)

---

## Access Your App

After deployment, you'll get a URL like:
- `https://incident-reporter.vercel.app`
- `https://your-project.vercel.app`

You can access this from any device!

---

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS instructions
4. Get free SSL automatically

---

## Environment Variables (For Production API)

If you want to connect to a real ambulance API:

1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - `AMBULANCE_API_URL` = your API URL
   - `AMBULANCE_API_KEY` = your API key
3. Redeploy

---

## Full Documentation

See `DEPLOYMENT.md` for complete deployment guide with all options.

---

**🎉 Your app will be accessible from any device with the provided URL!**
