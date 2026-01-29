# 🚀 Deployment Guide

## Railway Deployment (Recommended)

### Prerequisites
- GitHub account
- Railway account (sign up at [railway.app](https://railway.app))
- Your code pushed to GitHub

### Step-by-Step Deployment

#### 1. Push Your Code to GitHub

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Emergency Incident Reporter"

# Create main branch
git branch -M main

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git push -u origin main
```

#### 2. Set Up Railway Project

1. **Login to Railway**
   - Go to https://railway.app
   - Click "Login" and authenticate with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize Railway to access your repositories
   - Select your `incident-reporter` repository

3. **Initial Deployment**
   - Railway will automatically detect Node.js
   - It will use the configurations from `railway.json` and `nixpacks.toml`
   - Wait for the initial build to complete

#### 3. Add MongoDB Database

1. **Add Database Service**
   - In your project dashboard, click "+ New"
   - Select "Database"
   - Choose "Add MongoDB"

2. **Connect to App**
   - Railway automatically creates a MongoDB instance
   - Go to MongoDB service → Variables
   - Copy the `MONGO_URL` value

#### 4. Configure Environment Variables

1. **Open Your App Service**
   - Click on your main application service
   - Go to "Variables" tab

2. **Add Required Variables**

   Click "New Variable" and add each of these:

   ```
   NODE_ENV=production
   ```

   ```
   MONGODB_URI=${{MongoDB.MONGO_URL}}
   ```
   (Railway will auto-link this to your MongoDB service)

   ```
   PORT=5000
   ```

   ```
   GEOCODING_API_KEY=your_opencage_api_key_here
   ```

   ```
   AMBULANCE_API_URL=https://your-ambulance-service.com/api/reports
   ```

   ```
   AMBULANCE_API_KEY=your_ambulance_api_key_here
   ```

   ```
   CLIENT_URL=${{RAILWAY_PUBLIC_DOMAIN}}
   ```
   (Or set to your custom domain)

3. **Save Variables**
   - Railway will automatically redeploy with new variables

#### 5. Get Your API Keys

##### OpenCage Geocoding API (Recommended - Free Tier)

1. Go to https://opencagedata.com/api
2. Click "Sign Up for Free"
3. Verify your email
4. Get your API key from dashboard
5. Free tier includes 2,500 requests/day
6. Add to Railway: `GEOCODING_API_KEY=your_key_here`

##### Alternative: Google Maps Geocoding API

1. Go to https://console.cloud.google.com/
2. Create new project or select existing
3. Enable "Geocoding API"
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Restrict the API key to Geocoding API only
6. Update code in `server/services/geocodingService.js` (see comments)
7. Add to Railway: `GEOCODING_API_KEY=your_google_key`

#### 6. Set Up Ambulance Service (Optional)

If you have an ambulance service API:

1. Get API endpoint URL
2. Get API authentication key
3. Add to Railway variables:
   ```
   AMBULANCE_API_URL=https://api.ambulance-service.com/reports
   AMBULANCE_API_KEY=your_ambulance_api_key
   ```

If you don't have one yet:
- Leave these empty for now
- The app will still work, but won't send notifications
- You can add them later when ready

#### 7. Verify Deployment

1. **Get Your App URL**
   - In Railway dashboard, find your app's domain
   - Should be like: `https://incident-reporter-production.up.railway.app`

2. **Test the Application**
   - Open the URL in your browser
   - Allow camera and location permissions
   - Try submitting a test report

3. **Check Logs**
   - In Railway dashboard, click "Deployments"
   - View logs to see if everything is working
   - Look for: "Server running on port 5000"
   - Look for: "MongoDB Connected"

#### 8. Custom Domain (Optional)

1. **Add Custom Domain**
   - Go to your service settings
   - Click "Settings" → "Domains"
   - Click "Custom Domain"
   - Add your domain (e.g., `reports.yourdomain.com`)

2. **Configure DNS**
   - Add CNAME record in your DNS provider
   - Point to your Railway domain
   - Wait for DNS propagation (can take up to 48 hours)

3. **Update Environment Variables**
   - Update `CLIENT_URL` to your custom domain

## Alternative: Manual VPS Deployment

### Using Ubuntu VPS (DigitalOcean, Linode, etc.)

#### 1. Set Up Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
sudo apt install -y nginx

# Install PM2 for process management
sudo npm install -g pm2
```

#### 2. Deploy Application

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/YOUR_USERNAME/incident-reporter.git
cd incident-reporter

# Install dependencies
sudo npm install
cd client && sudo npm install && sudo npm run build && cd ..

# Create .env file
sudo nano .env
# Add your environment variables (see .env.example)

# Start with PM2
sudo pm2 start server/index.js --name incident-reporter
sudo pm2 startup
sudo pm2 save
```

#### 3. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/incident-reporter
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/incident-reporter /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Troubleshooting

### Common Issues

#### 1. Build Fails on Railway

**Problem**: Build fails with npm errors

**Solution**:
- Check package.json for correct scripts
- Ensure all dependencies are in package.json, not just devDependencies
- Check Railway build logs for specific errors

#### 2. MongoDB Connection Fails

**Problem**: "MongoDB connection error"

**Solution**:
- Verify MONGODB_URI is set correctly
- Check MongoDB service is running
- Ensure IP whitelisting (if using MongoDB Atlas)

#### 3. Camera Not Working

**Problem**: Camera permission denied or not showing

**Solution**:
- Ensure HTTPS is enabled (required for camera access)
- Railway provides HTTPS by default
- Check browser permissions

#### 4. Location Not Detected

**Problem**: "Location not available"

**Solution**:
- Users must allow location permissions
- HTTPS is required for geolocation
- Some browsers block location on insecure contexts

#### 5. Images Too Large

**Problem**: "Request entity too large"

**Solution**:
- Images are base64 encoded and can be large
- Current limit is 10MB (set in server/index.js)
- Consider adding image compression if needed

### Getting Help

1. **Check Railway Logs**
   ```
   Railway Dashboard → Your Service → Deployments → View Logs
   ```

2. **Check MongoDB Connection**
   - Ensure MongoDB service is healthy
   - Check connection string format

3. **Environment Variables**
   - Verify all required variables are set
   - No extra spaces in variable values

4. **GitHub Issues**
   - Open an issue with error details
   - Include relevant logs (remove sensitive data)

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| NODE_ENV | Yes | Environment mode | `production` |
| PORT | No | Server port (Railway sets automatically) | `5000` |
| MONGODB_URI | Yes | MongoDB connection string | `mongodb://...` |
| GEOCODING_API_KEY | Recommended | OpenCage or Google Maps API key | `your_key` |
| AMBULANCE_API_URL | Optional | Ambulance service endpoint | `https://api.example.com` |
| AMBULANCE_API_KEY | Optional | Ambulance service auth key | `your_key` |
| CLIENT_URL | Optional | Frontend URL (for CORS) | `https://app.railway.app` |

## Post-Deployment Checklist

- [ ] Application is accessible via Railway URL
- [ ] Camera permissions work
- [ ] Location detection works
- [ ] Can submit test report successfully
- [ ] MongoDB stores reports correctly
- [ ] Check logs for errors
- [ ] Test on mobile device
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate is active (automatic on Railway)
- [ ] Environment variables are set
- [ ] Geocoding API is working
- [ ] Ambulance service integration tested (if configured)

---

Need help? Check the logs, review environment variables, or open an issue on GitHub!
