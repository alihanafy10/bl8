# 🚀 Vercel Deployment Guide (FREE!)

## ✨ Why Vercel?
- **100% FREE** for personal projects
- No credit card required
- Automatic HTTPS
- Global CDN
- Easy GitHub integration
- Serverless functions included

---

## 📋 Prerequisites

1. **GitHub Account** - Your code must be on GitHub
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (FREE)
3. **MongoDB Atlas Account** - Free tier available at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

---

## Step 1: Set Up MongoDB Atlas (FREE)

### Create Free MongoDB Database

1. **Sign up at MongoDB Atlas**
   - Go to https://www.mongodb.com/cloud/atlas
   - Click "Try Free"
   - Sign up with Google or Email

2. **Create a Free Cluster**
   - Choose "Shared" (FREE tier)
   - Select your region (choose closest to your users)
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Set Up Database Access**
   - Click "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Create username and password
   - **SAVE THESE CREDENTIALS!**
   - Select "Read and write to any database"
   - Click "Add User"

4. **Set Up Network Access**
   - Click "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for Vercel)
   - Click "Confirm"

5. **Get Connection String**
   - Click "Database" (left sidebar)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like):
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password
   - Add database name before the `?`:
   ```
   mongodb+srv://username:yourpassword@cluster0.xxxxx.mongodb.net/incident-reporter?retryWrites=true&w=majority
   ```

---

## Step 2: Push Your Code to GitHub

```bash
# Make sure all files are added
git add .

# Commit everything
git commit -m "Prepare for Vercel deployment"

# Push to GitHub
git push origin main
```

**Verify on GitHub:**
- Go to https://github.com/alihanafy10/bl8
- Make sure all files are there, especially:
  - ✅ `vercel.json`
  - ✅ `api/` folder
  - ✅ `client/` folder
  - ✅ `package.json`

---

## Step 3: Deploy to Vercel

### Option A: Using Vercel Website (Recommended)

1. **Go to Vercel**
   - Visit https://vercel.com
   - Click "Sign Up" or "Login"
   - **Choose "Continue with GitHub"**

2. **Import Your Repository**
   - Click "Add New..." → "Project"
   - You'll see your GitHub repositories
   - Find "bl8" and click "Import"

3. **Configure Project**
   
   Vercel will auto-detect settings, but verify:
   
   - **Framework Preset:** Other (or leave as detected)
   - **Root Directory:** `./` (leave as is)
   - **Build Command:** `npm run vercel-build` (should auto-fill)
   - **Output Directory:** `client/build`
   - **Install Command:** `npm install`

4. **Add Environment Variables**
   
   Click "Environment Variables" section and add:

   **Required:**
   ```
   MONGODB_URI
   ```
   Value: Your MongoDB Atlas connection string
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/incident-reporter?retryWrites=true&w=majority
   ```

   **Optional (for geocoding):**
   ```
   GEOCODING_API_KEY
   ```
   Value: Your OpenCage API key (get from https://opencagedata.com/api)

   **Optional (for ambulance service):**
   ```
   AMBULANCE_API_URL
   ```
   Value: Your ambulance service API endpoint

   ```
   AMBULANCE_API_KEY
   ```
   Value: Your ambulance service API key

5. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes
   - ✅ Done! You'll get a URL like: `https://bl8.vercel.app`

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? bl8
# - Directory? ./ (root)
# - Override settings? No

# Add environment variables
vercel env add MONGODB_URI production
# Paste your MongoDB connection string

# Deploy to production
vercel --prod
```

---

## Step 4: Get API Keys (Optional but Recommended)

### OpenCage Geocoding API (FREE - 2,500 requests/day)

1. Go to https://opencagedata.com/api
2. Click "Sign Up"
3. Verify your email
4. Get your API key from dashboard
5. Add to Vercel environment variables:
   - Go to Vercel dashboard
   - Select your project
   - Settings → Environment Variables
   - Add: `GEOCODING_API_KEY` = `your_key_here`
   - Click "Save"
6. Redeploy: Vercel → Deployments → Click "..." → "Redeploy"

---

## Step 5: Test Your Deployment

1. **Open Your App**
   - Go to your Vercel URL (e.g., `https://bl8.vercel.app`)

2. **Test Features**
   - ✅ Allow camera permission
   - ✅ Allow location permission
   - ✅ Take incident photo
   - ✅ Take face photo
   - ✅ Submit report
   - ✅ Check success message

3. **Check Logs** (if something fails)
   - Vercel Dashboard → Your Project
   - Click on "Functions" tab
   - Click on latest invocation
   - Read error logs

---

## 🔧 Updating Your App

Every time you push to GitHub, Vercel auto-deploys!

```bash
# Make changes to your code
# Then:
git add .
git commit -m "Your update message"
git push origin main

# Vercel automatically deploys! 🎉
```

---

## 🎯 Custom Domain (Optional)

1. **In Vercel Dashboard**
   - Go to your project
   - Settings → Domains
   - Add your domain

2. **Update DNS**
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Wait for DNS propagation

---

## 🐛 Troubleshooting

### Issue 1: "Cannot connect to MongoDB"

**Check:**
- MongoDB Atlas connection string is correct
- Password has no special characters (or URL-encoded)
- IP Address is whitelisted (use "Allow from Anywhere")
- Database name is in the connection string

**Fix:**
- Go to Vercel → Settings → Environment Variables
- Update `MONGODB_URI` with correct value
- Redeploy

### Issue 2: "Function Timeout"

**Cause:** MongoDB connection is slow

**Fix:**
- Already handled in code (connection caching)
- Free tier might be slower, this is normal for first request

### Issue 3: Camera doesn't work

**Cause:** HTTPS required for camera/location

**Fix:**
- Vercel provides HTTPS automatically
- Make sure you're using `https://` not `http://`
- Check browser permissions

### Issue 4: API calls fail

**Check Frontend Config:**
- Open `client/src/config.js`
- Should use `/api` for production
- Already configured correctly ✅

### Issue 5: Build fails

**Common causes:**
- Missing dependencies: Check `package.json`
- Syntax errors: Check console logs in Vercel
- Node version: Vercel uses Node 18+ (we specified this)

**View Logs:**
- Vercel Dashboard → Deployments
- Click on failed deployment
- Read build logs

---

## 📊 Environment Variables Reference

| Variable | Required? | Where to Get | Example |
|----------|-----------|--------------|---------|
| `MONGODB_URI` | ✅ Yes | MongoDB Atlas | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `GEOCODING_API_KEY` | ⚠️ Recommended | opencagedata.com | `abc123def456...` |
| `AMBULANCE_API_URL` | ❌ Optional | Your ambulance service | `https://api.ambulance.com/reports` |
| `AMBULANCE_API_KEY` | ❌ Optional | Your ambulance service | `secret_key_123` |

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas account created (FREE)
- [ ] Database user created with password
- [ ] Network access set to "Allow from Anywhere"
- [ ] Connection string copied and password replaced
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] `MONGODB_URI` environment variable added
- [ ] Project deployed successfully
- [ ] Tested camera and location features
- [ ] Tested report submission
- [ ] (Optional) OpenCage API key added for geocoding

---

## 💰 Cost Breakdown

- ✅ **Vercel:** FREE (hobby plan)
- ✅ **MongoDB Atlas:** FREE (512MB storage)
- ✅ **OpenCage Geocoding:** FREE (2,500 requests/day)
- ✅ **GitHub:** FREE (unlimited public repos)

**Total: $0.00 per month** 🎉

---

## 🆘 Need Help?

**Check logs:**
1. Vercel Dashboard → Your Project
2. Click "Functions" → View logs
3. Click "Deployments" → View build logs

**Common log locations:**
- Build errors: Deployments tab
- Runtime errors: Functions tab
- API errors: Functions → Click on invocation

**Still stuck?**
- Check error message carefully
- Verify all environment variables are set
- Make sure MongoDB connection string is correct
- Test MongoDB connection independently

---

## 🚀 Your App is LIVE!

**Production URL:** `https://bl8.vercel.app`

**Share it with:**
- QR Code (great for mobile testing)
- Direct link
- Custom domain (optional)

**Monitor:**
- Vercel Dashboard shows:
  - Request count
  - Bandwidth usage
  - Function invocations
  - Error rate

---

## 🎓 What's Next?

After successful deployment:

1. **Test thoroughly** on different devices
2. **Share with beta testers** 
3. **Monitor Vercel analytics**
4. **Add custom domain** (optional)
5. **Set up monitoring** for errors
6. **Add more features** as needed

**Updates are easy:**
```bash
git add .
git commit -m "New feature"
git push
# Vercel auto-deploys! ✨
```

---

**Congratulations! Your app is now live on Vercel! 🎉**
