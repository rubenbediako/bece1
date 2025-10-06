# BECE 2026 Prediction Platform 📱

> AI-powered BECE 2026 exam prediction platform for Ghanaian students with interactive learning features

## 🚀 Features

- **Progressive Web App (PWA)** - Install on any device, works offline
- **AI-Powered Predictions** - Smart exam predictions for BECE 2026
- **Multi-Channel Access Codes** - WhatsApp & SMS code distribution
- **Interactive Learning** - Practice questions and progress tracking
- **Admin Dashboard** - Complete platform management
- **Real-time Analytics** - Student performance insights
- **Global Data Sync** - Vercel KV database with local fallback
- **Offline Support** - Service worker for offline functionality
- **Mobile First** - Optimized for mobile devices

## 📱 PWA Features

- **Installable** - Add to home screen on mobile/desktop
- **Offline Mode** - Works without internet connection
- **Push Notifications** - Updates and reminders
- **Background Sync** - Sync data when connection returns
- **App-like Experience** - Native app feel in browser

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **UI Library**: Material-UI (MUI), Framer Motion
- **PWA**: Service Worker, Web App Manifest
- **Database**: Vercel KV (with localStorage fallback)
- **Math Rendering**: KaTeX, MathQuill
- **Linting**: ESLint with strict TypeScript rules
- **Deployment**: Vercel

## 📱 Access Code System

The platform uses a sophisticated 8-month validity access code system:
- Automatic WhatsApp/SMS distribution
- Admin notifications and tracking
- Secure code generation and validation

## 🏗️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm 8+

### Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Test PWA functionality
npm run test-pwa
```

## 📱 PWA Testing

To test PWA features locally:

1. Run `npm run test-pwa`
2. Open http://localhost:4173 in Chrome
3. Open DevTools → Application tab
4. Check Service Workers and Manifest
5. Test "Add to Home Screen"

### PWA Checklist
- ✅ Web App Manifest configured
- ✅ Service Worker registered
- ✅ Offline functionality
- ✅ Install prompt
- ✅ Update notifications
- ✅ App icons and splash screens

## 🚀 Deployment

This project is configured for seamless Vercel deployment via GitHub.

### Deploy to Vercel:
1. Push to GitHub repository
2. Connect repository to Vercel
3. Deploy automatically with zero configuration

### Build Commands:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18.x

## 📊 Project Structure

```
src/
├── components/          # React components
├── contexts/           # React contexts (Auth, etc.)
├── services/           # Business logic and services
├── types.ts           # TypeScript type definitions
└── assets/            # Static assets
```

## 🔒 Environment Variables

Create `.env.production` for production settings:
```env
VITE_APP_ENV=production
VITE_APP_NAME=BECE 2026 Prediction Platform
```

## 📈 Performance

- ✅ Production-ready build optimization
- ✅ Code splitting and lazy loading
- ✅ Strict TypeScript and ESLint rules
- ✅ Optimized bundle size

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

This project is developed for educational purposes - BECE 2026 preparation platform.

---

**Live Demo**: [Coming Soon - Deploy to Vercel]
**Status**: Production Ready ✅# bece1
# bece1
# jhs
# bece1
# bece1
