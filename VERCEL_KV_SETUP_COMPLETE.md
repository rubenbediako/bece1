# 🔧 VERCEL KV API URL SETUP GUIDE

## 🎯 Complete Step-by-Step Setup

### **Step 1: Add Vercel KV to Your Project**

1. **Go to Vercel Dashboard**:
   ```
   https://vercel.com/dashboard
   ```

2. **Select Your Project**:
   - Click on your `prediction-app` project

3. **Go to Storage Tab**:
   - Click on the "Storage" tab in your project dashboard

4. **Create KV Database**:
   - Click "Create Database"
   - Select "KV" (Key-Value store)
   - Choose a name like `bece-2026-kv`
   - Select region (choose closest to your users)
   - Click "Create"

5. **Connect to Project**:
   - After creation, click "Connect to Project"
   - Select your project
   - Click "Connect"

### **Step 2: Automatic Environment Variables**

When you connect KV to your project, Vercel automatically adds these environment variables:

```bash
KV_REST_API_URL=https://xxx-us1-rest-redis.upstash.io
KV_REST_API_TOKEN=AXXXxxx...
KV_URL=redis://default:xxx@xxx-us1-redis.upstash.io:6379
```

### **Step 3: Verify Environment Variables**

1. **In Vercel Dashboard**:
   - Go to Project Settings → Environment Variables
   - You should see the 3 KV variables listed

2. **Check Variables**:
   ```bash
   vercel env ls
   ```

### **Step 4: Deploy Your App**

```bash
# Deploy to production
vercel --prod

# Or push to main branch (if auto-deploy is enabled)
git push origin main
```

### **Step 5: Test Your Setup**

1. **Open your deployed app**
2. **Check the sync indicator** (top-right corner)
3. **Click on it** → Should show "Global sync enabled"
4. **Try saving subjects/questions** → Should show "synced globally" messages

## 🛠️ Manual Setup (If Needed)

### **If Auto-Setup Doesn't Work:**

1. **Get KV Details**:
   - In Vercel Dashboard → Storage → Your KV Database
   - Click "Settings" or "Connection Details"
   - Copy the REST API URL and Token

2. **Add Environment Variables Manually**:
   ```bash
   vercel env add KV_REST_API_URL
   # Paste your URL when prompted
   
   vercel env add KV_REST_API_TOKEN  
   # Paste your token when prompted
   
   vercel env add KV_URL
   # Paste your Redis URL when prompted
   ```

3. **Redeploy**:
   ```bash
   vercel --prod
   ```

## 🔍 Troubleshooting

### **Common Issues:**

1. **"Environment variables not found"**:
   - Check Vercel Dashboard → Project Settings → Environment Variables
   - Ensure all 3 KV variables are present
   - Redeploy if needed

2. **"Connection failed"**:
   - Wait 1-2 minutes after creating KV (propagation delay)
   - Check if variables are set to "Production" environment
   - Try redeploying

3. **"Local development not working"**:
   - Pull environment variables locally:
   ```bash
   vercel env pull .env.local
   ```

### **Test Database Connection:**

1. **Use the built-in diagnostics**:
   - Open your deployed app
   - Click sync indicator (top-right)
   - Click "Database Diagnostics"
   - All checks should show "OK" ✅

## 📋 Verification Checklist

### **✅ Pre-Deployment:**
- [ ] Vercel KV database created
- [ ] KV connected to project
- [ ] Environment variables visible in dashboard
- [ ] Project builds successfully (`npm run build`)

### **✅ Post-Deployment:**
- [ ] App loads without errors
- [ ] Sync indicator shows green "Synced" status
- [ ] Database diagnostics show all "OK"
- [ ] Can save subjects/questions with "globally synced" messages

## 🚀 Expected Results

### **When Working Correctly:**
```
✅ Sync Status: Green "Synced" indicator
✅ Storage Status: "Connected to Vercel KV database"
✅ Save Messages: "Subject/Question saved and synced globally!"
✅ Database Diagnostics: All checks pass
```

### **Quick Test Commands:**

```bash
# Check if deployed correctly
curl https://your-app.vercel.app

# Check environment variables
vercel env ls

# Deploy with fresh environment
vercel --prod --force
```

## 🆘 If Still Not Working

1. **Contact Vercel Support** or check their documentation
2. **Use the fallback system** - your app will work with localStorage
3. **Check Vercel Status** - sometimes there are service issues
4. **Try different region** - some regions might have issues

Your app is designed to work with or without KV, so it will never completely break!

---

## 📞 Quick Commands Reference

```bash
# Create and deploy with KV
vercel                    # Initial deployment
vercel env ls            # Check environment variables
vercel --prod           # Production deployment
vercel logs             # Check deployment logs

# Local development with KV
vercel env pull .env.local    # Pull production env vars
npm run dev                   # Start local server
```
