# ⚡ Quick Start - Deploy to Vercel in 5 Minutes

## Step 1: Push to GitHub (30 seconds)

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

## Step 2: Set Up MongoDB Atlas (2 minutes)

1. Go to https://www.mongodb.com/cloud/atlas → Sign up (FREE)
2. Create free cluster (M0)
3. Database Access → Add user (save username/password!)
4. Network Access → Allow access from anywhere
5. Database → Connect → Copy connection string
6. Replace `<password>` with your password and add database name:
   ```
   mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/incident-reporter?retryWrites=true&w=majority
   ```

## Step 3: Deploy to Vercel (2 minutes)

1. Go to https://vercel.com → Sign up with GitHub
2. "Add New" → "Project"
3. Import "bl8" repository
4. Add Environment Variable:
   - Name: `MONGODB_URI`
   - Value: Your MongoDB connection string (from Step 2)
5. Click "Deploy"
6. Wait 2-3 minutes ☕
7. ✅ Done! You'll get a URL like `https://bl8.vercel.app`

## Step 4: Test Your App (30 seconds)

1. Open your Vercel URL
2. Allow camera and location permissions
3. Submit a test report
4. 🎉 Success!

---

## Optional: Add Geocoding (1 minute)

1. Get free API key: https://opencagedata.com/api
2. Vercel Dashboard → Settings → Environment Variables
3. Add: `GEOCODING_API_KEY` = `your_key`
4. Redeploy

---

## 💰 Total Cost: $0.00
- Vercel: FREE
- MongoDB Atlas: FREE (512MB)
- OpenCage API: FREE (2,500/day)

---

## ⚠️ Troubleshooting

**Can't connect to MongoDB?**
- Check connection string has correct password
- Check "Network Access" allows all IPs (0.0.0.0/0)

**Build failed?**
- Check build logs in Vercel dashboard
- Make sure all files are pushed to GitHub

**Camera doesn't work?**
- Vercel provides HTTPS automatically (required for camera)
- Check browser permissions

---

## 🎯 You're Done!

Your incident reporter is now live at: `https://bl8.vercel.app`

Every time you push to GitHub, Vercel automatically redeploys! 🚀
