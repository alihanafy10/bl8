# 🚀 Deployment Guide - Vercel

This guide will help you deploy the Emergency Incident Reporter to Vercel for free hosting.

## Prerequisites

- GitHub account (free)
- Vercel account (free) - Sign up at https://vercel.com
- Git installed on your computer

---

## Option 1: Deploy via Vercel CLI (Recommended)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

This will open your browser to authenticate.

### Step 3: Deploy

```bash
# From project root directory
vercel
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Select your account
- **Link to existing project?** No
- **Project name?** incident-reporter (or your choice)
- **Directory?** ./ (press Enter)
- **Override settings?** No

### Step 4: Deploy to Production

```bash
vercel --prod
```

Your app will be deployed and you'll get a URL like:
`https://incident-reporter.vercel.app`

---

## Option 2: Deploy via GitHub + Vercel (Easier for Updates)

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `incident-reporter`
3. Make it **Public** or **Private**
4. Click "Create repository"

### Step 2: Initialize Git and Push

```bash
# In your project directory
git init
git add .
git commit -m "Initial commit - Emergency Incident Reporter"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/incident-reporter.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### Step 3: Connect to Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Click "Import" next to your `incident-reporter` repository
4. Configure:
   - **Framework Preset:** Other
   - **Build Command:** `npm run vercel-build`
   - **Output Directory:** `client/build`
   - **Install Command:** `npm install`
5. Click "Deploy"

### Step 4: Configure Environment Variables (Optional)

If you want to connect to a real ambulance API:

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add:
   - `AMBULANCE_API_URL` = Your API URL
   - `AMBULANCE_API_KEY` = Your API key
   - `NODE_ENV` = production
4. Click "Save"
5. Redeploy from the "Deployments" tab

---

## Important Notes for Vercel Deployment

### 1. File Storage Limitation

⚠️ **Vercel has read-only filesystem** - Uploaded photos won't persist between requests.

**Solutions:**

**Option A: Use Cloud Storage (Recommended for Production)**

Install and configure cloud storage:

```bash
npm install @vercel/blob
# OR
npm install aws-sdk  # For AWS S3
# OR
npm install @azure/storage-blob  # For Azure
```

**Option B: Use Vercel Blob Storage (Easiest)**

Vercel provides free blob storage. Update `server/index.js`:

```javascript
const { put } = require('@vercel/blob');

// In the upload handler
const incidentBlob = await put(incidentFilename, incidentFile, {
  access: 'public',
});
```

**Option C: Send Photos Directly to Ambulance API**

Modify the backend to send photos as base64 or multipart to your ambulance API immediately.

### 2. Reports Database

The `reports.json` file won't work on Vercel. Options:

**Option A: Use a Free Database**
- **Vercel Postgres** (free tier)
- **MongoDB Atlas** (free tier)
- **Supabase** (free tier)
- **PlanetScale** (free tier)

**Option B: Send All Data to External API**

Configure your ambulance API and send all data there.

### 3. Face Detection Models

The models in `client/public/models/` will be deployed with your app. Vercel will serve them correctly.

---

## Alternative: Deploy Backend and Frontend Separately

### Backend Options

1. **Railway** (https://railway.app) - Free tier with persistent storage
2. **Render** (https://render.com) - Free tier with persistent storage
3. **Heroku** - No longer has free tier
4. **Fly.io** - Free tier available

### Frontend on Vercel

Deploy just the React frontend to Vercel and point it to your backend URL.

Update `client/package.json`:
```json
{
  "proxy": "https://your-backend-url.railway.app"
}
```

Or create `client/.env`:
```
REACT_APP_API_URL=https://your-backend-url.railway.app
```

---

## Post-Deployment Checklist

After deployment:

- [ ] Test camera access (requires HTTPS - Vercel provides this)
- [ ] Test location access (requires HTTPS - Vercel provides this)
- [ ] Test photo capture
- [ ] Test face detection
- [ ] Test report submission
- [ ] Verify API integration (if configured)
- [ ] Test on mobile device
- [ ] Test on different browsers

---

## Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Go to Project Settings → Domains
2. Add your domain (e.g., emergency.yourdomain.com)
3. Follow DNS configuration instructions
4. Vercel automatically provides SSL certificate

---

## Monitoring and Logs

### View Deployment Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. Click on any deployment to see logs

### View Runtime Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click "Logs" tab
4. View real-time application logs

---

## Updating Your Deployment

### With GitHub (Automatic)

Just push to GitHub:
```bash
git add .
git commit -m "Update message"
git push
```

Vercel automatically detects and redeploys.

### With Vercel CLI

```bash
vercel --prod
```

---

## Cost

**Free Tier Includes:**
- ✅ Unlimited deployments
- ✅ HTTPS/SSL certificates
- ✅ 100GB bandwidth/month
- ✅ Serverless functions
- ✅ Automatic HTTPS
- ✅ Custom domains

**Limitations:**
- 10-second serverless function timeout
- 4.5GB storage
- No persistent file storage

---

## Troubleshooting

### Issue: Build fails

**Check:**
- All dependencies are in `package.json`
- Build command is correct
- Node version compatibility

### Issue: API routes not working

**Check:**
- `vercel.json` routes configuration
- API endpoints use `/api/` prefix
- CORS settings allow your domain

### Issue: Photos not saving

**Solution:**
- Use Vercel Blob Storage
- Or use external cloud storage (AWS S3, Cloudinary)
- Or send directly to ambulance API

### Issue: Face detection not working

**Check:**
- Models are in `client/public/models/`
- Models are included in build
- No 404 errors for model files

---

## Alternative Hosting Options

### 1. Netlify
- Similar to Vercel
- Great for static sites
- Functions for backend

### 2. Railway
- Better for full-stack apps
- Persistent storage
- Free tier available

### 3. Render
- Good for Node.js apps
- Persistent storage
- Free tier (slower cold starts)

### 4. Digital Ocean App Platform
- $5/month minimum
- Full persistent storage
- More control

---

## Recommended Production Setup

For a production-ready deployment:

1. **Frontend:** Vercel (free, fast, HTTPS)
2. **Backend:** Railway or Render (persistent storage)
3. **Database:** MongoDB Atlas or Supabase (free tier)
4. **Photos:** AWS S3, Cloudinary, or Vercel Blob
5. **Monitoring:** Vercel Analytics + Sentry for errors

---

## Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Vercel Discord:** https://vercel.com/discord
- **GitHub Issues:** Create issues in your repository

---

**🎉 Your app will be live at: `https://your-project.vercel.app`**
