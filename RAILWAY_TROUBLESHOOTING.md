# 🔧 Railway Deployment Troubleshooting

## Common Deployment Errors & Solutions

### Error 1: "Cannot find module" or "MODULE_NOT_FOUND"

**Cause**: Dependencies not installed correctly

**Solution**:
1. Make sure `package.json` has all dependencies in `dependencies`, not `devDependencies`
2. Check that both root and client package.json files exist

Update your root `package.json` to ensure build script is correct:
```json
{
  "scripts": {
    "start": "node server/index.js",
    "build": "cd client && npm install && npm run build"
  }
}
```

### Error 2: "ENOENT: no such file or directory"

**Cause**: File paths are incorrect or files not uploaded to GitHub

**Solution**:
1. Check all files are committed to GitHub:
   ```bash
   git status
   git add .
   git commit -m "Add missing files"
   git push
   ```

2. Verify these files exist:
   - `server/index.js`
   - `client/package.json`
   - `package.json` (root)

### Error 3: "Port already in use" or "EADDRINUSE"

**Cause**: PORT environment variable not set correctly

**Solution**:
Railway automatically sets `PORT` variable. Update `server/index.js`:

```javascript
const PORT = process.env.PORT || 5000;
```

Make sure your server is listening on `process.env.PORT`.

### Error 4: MongoDB Connection Error

**Cause**: MongoDB not added or MONGODB_URI not set

**Solution**:

#### Step 1: Add MongoDB to Railway
1. In your Railway project, click **"+ New"**
2. Select **"Database"**
3. Choose **"Add MongoDB"**
4. Wait for it to provision

#### Step 2: Link MongoDB to Your App
1. Click on your **main service** (your app)
2. Go to **"Variables"** tab
3. Click **"+ New Variable"**
4. Click **"Add Reference"**
5. Select: **MongoDB** → **MONGO_URL**
6. Name it: `MONGODB_URI`
7. Save

Or manually add:
```
MONGODB_URI=${{MongoDB.MONGO_URL}}
```

### Error 5: "Build Command Failed"

**Cause**: Build script has errors

**Solution**:

Update `railway.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && cd client && npm install && npm run build && cd .."
  },
  "deploy": {
    "startCommand": "node server/index.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Error 6: "Application Error" or Crash Loop

**Cause**: Application crashes on start

**Solution**:

Check Railway logs for the actual error. Common fixes:

1. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=${{PORT}}
   MONGODB_URI=${{MongoDB.MONGO_URL}}
   ```

2. **Make MongoDB optional** (update `server/config/database.js`):
   ```javascript
   const connectDB = async () => {
     try {
       if (!process.env.MONGODB_URI) {
         console.warn('MONGODB_URI not set, skipping database connection');
         return;
       }
       const conn = await mongoose.connect(process.env.MONGODB_URI);
       console.log(`MongoDB Connected: ${conn.connection.host}`);
     } catch (error) {
       console.error(`Error: ${error.message}`);
       if (process.env.NODE_ENV !== 'production') {
         process.exit(1);
       }
     }
   };
   ```

### Error 7: "Cannot GET /" - App deploys but shows blank page

**Cause**: Static files not served correctly

**Solution**:

Your `server/index.js` should have this code for production:

```javascript
// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}
```

### Error 8: "Failed to compile" - React build fails

**Cause**: React build has warnings or errors

**Solution**:

1. Test build locally first:
   ```bash
   cd client
   npm run build
   ```

2. Fix any errors shown

3. To ignore warnings, add to `client/package.json`:
   ```json
   {
     "scripts": {
       "build": "CI=false react-scripts build"
     }
   }
   ```

---

## 🔍 How to Read Railway Logs

1. Go to your Railway project
2. Click on your service
3. Click **"Deployments"**
4. Click on the latest deployment
5. Click **"View Logs"**

Look for these indicators:
- ✅ "Server running on port 5000" = Good!
- ✅ "MongoDB Connected" = Good!
- ❌ "Error:" = Problem! Read the error message
- ❌ "Cannot find module" = Missing dependency
- ❌ "ECONNREFUSED" = Connection issue (usually MongoDB)

---

## 📋 Railway Environment Variables Checklist

Go to your service → Variables → Add these:

### Required:
```
NODE_ENV=production
```

### If using MongoDB:
```
MONGODB_URI=${{MongoDB.MONGO_URL}}
```
(Use reference to link to MongoDB service)

### Optional (for full features):
```
GEOCODING_API_KEY=your_opencage_key_here
AMBULANCE_API_URL=https://your-ambulance-api.com
AMBULANCE_API_KEY=your_key_here
CLIENT_URL=${{RAILWAY_PUBLIC_DOMAIN}}
```

---

## 🚀 Quick Fix Commands

If deployment fails, try these:

### 1. Redeploy
```bash
# Make a small change
git add .
git commit -m "Trigger redeploy"
git push
```

### 2. Clear and Rebuild
In Railway:
1. Settings → Scroll down
2. Click **"Clear Build Cache"**
3. Redeploy

### 3. Check Service Status
Railway Dashboard → Your service → Should show "Active"

---

## ⚡ Most Common Fix

**90% of deployment issues are solved by:**

1. **Adding MongoDB**:
   - Add MongoDB database service
   - Link MONGODB_URI variable

2. **Setting NODE_ENV**:
   ```
   NODE_ENV=production
   ```

3. **Proper Build Command**:
   Make sure client is built:
   ```
   npm install && cd client && npm install && npm run build
   ```

---

## 📸 What to Send for Help

If you need help, share:

1. **Screenshot of error** from Railway logs
2. **Deployment command** output
3. **Which step failed**: Build or Deploy?
4. **Environment variables** you have set (hide API keys)

The error message usually tells us exactly what's wrong!

---

## ✅ Successful Deployment Indicators

You'll know it worked when you see:

1. ✅ Railway shows service as **"Active"** (green)
2. ✅ Logs show: **"Server running on port XXXX"**
3. ✅ Can open your app URL and see the interface
4. ✅ Camera and location work when you test

---

## 🆘 Still Stuck?

**Share these with me:**
1. Full error message from Railway logs
2. Which step fails: Install, Build, or Deploy?
3. Screenshot if possible

I'll help you fix it!
