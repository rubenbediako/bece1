# 🚀 BECE 2026 Prediction Platform - Vercel Deployment Guide

## Quick Deployment Steps

### 1. Prerequisites
- Node.js 18+ installed
- Vercel account (free at vercel.com)
- Firebase project set up (if using Firebase backend)

### 2. Deploy to Vercel

#### Option A: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# Follow the prompts:
# ? Set up and deploy "~/prediction-app"? Y
# ? Which scope do you want to deploy to? [Your Team]
# ? Link to existing project? N
# ? What's your project's name? bece-2026-prediction-platform
# ? In which directory is your code located? ./
```

#### Option B: Deploy via Vercel Dashboard
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Configure project settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci`

### 3. Environment Variables Setup

#### Required Environment Variables (in Vercel Dashboard):
```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyD-jhQDPYs7Suj7pv1tZjnpVbQX6RLhI7o
VITE_FIREBASE_AUTH_DOMAIN=bece-ea729.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=bece-ea729
VITE_FIREBASE_STORAGE_BUCKET=bece-ea729.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=343084611143
VITE_FIREBASE_APP_ID=1:343084611143:web:54f0e5d7f728d3dad7e362
VITE_FIREBASE_MEASUREMENT_ID=G-991WL337H0

# Application Configuration
VITE_APP_NAME=BECE 2026 Prediction Platform
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
NODE_ENV=production
```

#### How to Add Environment Variables:
1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable with its value
4. Redeploy the project

### 4. Domain Configuration (Optional)
- **Default**: `your-project-name.vercel.app`
- **Custom Domain**: Add in Settings → Domains

### 5. Post-Deployment Checklist

#### ✅ Test Core Features:
- [ ] Landing page loads
- [ ] Student registration/login
- [ ] Admin dashboard access
- [ ] Firebase authentication works
- [ ] Data persistence (subjects, questions, predictions)
- [ ] PWA installation prompt
- [ ] WhatsApp support button

#### ✅ Performance Checks:
- [ ] Page load speed (< 3 seconds)
- [ ] Mobile responsiveness
- [ ] Lighthouse score (90+)
- [ ] Service worker registration

#### ✅ Security Verification:
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Firebase security rules applied
- [ ] No sensitive data in client-side code
- [ ] CSP headers configured

### 6. Monitoring & Analytics

#### Built-in Vercel Analytics:
- Automatic performance monitoring
- Real-time visitor analytics
- Core Web Vitals tracking

#### Firebase Analytics:
- User engagement tracking
- Custom events for educational metrics
- Real-time user activity

### 7. Maintenance & Updates

#### Automatic Deployments:
- Push to `main` branch → Auto-deploy
- Preview deployments for PR branches
- Rollback capability via Vercel dashboard

#### Regular Tasks:
- Monitor Firebase usage quotas
- Update dependencies monthly
- Review performance metrics weekly
- Backup Firebase data regularly

## 🎯 Expected Preview URLs

After deployment, your app will be available at:
- **Production**: `https://your-project-name.vercel.app`
- **Preview**: `https://your-project-name-git-branch.vercel.app` (for branches)

## 🔧 Troubleshooting

### Common Issues:

#### Build Fails:
```bash
# Check build locally
npm run build

# Fix TypeScript errors
npm run lint:fix
```

#### **NPM CI Error (npm error Command "npm ci" exited with 1):**
This is a common Vercel deployment issue. Try these solutions:

**Solution 1: Update vercel.json**
```json
{
  "framework": "vite", 
  "installCommand": "npm install --legacy-peer-deps",
  "buildCommand": "npm run build"
}
```

**Solution 2: Add .npmrc file**
```
legacy-peer-deps=true
fund=false
audit=false
```

**Solution 3: Use simpler configuration**
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

**Solution 4: Manual dependency cleanup**
```bash
# In your local environment
rm -rf node_modules package-lock.json
npm install
npm run build
# Then redeploy
```

#### Environment Variables Not Working:
- Ensure all variables start with `VITE_`
- Check spelling and case sensitivity
- Redeploy after adding variables

#### Firebase Connection Issues:
- Verify Firebase project ID
- Check security rules
- Ensure API keys are correct

#### PWA Not Installing:
- Check manifest.json is accessible
- Verify service worker registration
- Test on mobile device

### Performance Optimization:
- Use Vercel Edge Functions for API routes (if needed)
- Enable compression in vercel.json
- Optimize images (WebP format)
- Implement code splitting for large components

## 📊 Success Metrics

Your deployment is successful when:
- ✅ App loads in < 3 seconds
- ✅ All authentication flows work
- ✅ Data persists across sessions
- ✅ Mobile experience is smooth
- ✅ PWA installation works
- ✅ No console errors
- ✅ Lighthouse score > 90

---

**🎉 Ready to Deploy!** Your BECE 2026 Prediction Platform is now configured for production deployment on Vercel.
