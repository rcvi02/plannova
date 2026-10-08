# Plannova — Deployment Guide

This guide covers deploying Plannova to production using:
- **Frontend** → [Vercel](https://vercel.com) (free)
- **Backend** → [Render](https://render.com) (free tier)
- **Database** → [MongoDB Atlas](https://www.mongodb.com/atlas) (free M0 tier)

---

## 1. Database — MongoDB Atlas

### Setup
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a new **free M0 cluster** (512MB storage)
3. Under **Database Access** → Add a new database user with password
4. Under **Network Access** → Add IP Address → **Allow access from anywhere** (`0.0.0.0/0`)
5. Click **Connect** → **Drivers** → Copy the connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/plannova?retryWrites=true&w=majority
   ```

---

## 2. Backend — Render

### Setup
1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

### Environment Variables (add in Render dashboard)
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/plannova
JWT_SECRET=your-minimum-32-character-secret-key-here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-app.vercel.app
```

### Notes
- Render free tier **spins down after 15 minutes of inactivity** — first request will be slow (~30s)
- Upgrade to Starter plan ($7/month) for always-on
- Your backend URL will be: `https://plannova-api.onrender.com`

---

## 3. Frontend — Vercel

### Setup
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (project root, not `server/`)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Environment Variables (add in Vercel dashboard)
```
VITE_API_URL=https://plannova-api.onrender.com/api
```

### Notes
- Vercel auto-deploys on every push to `main`
- Your frontend URL will be: `https://plannova.vercel.app`
- Update `CORS_ORIGIN` in Render with your exact Vercel URL

---

## 4. Production Checklist

### Security
- [ ] JWT_SECRET is at least 32 random characters
- [ ] MongoDB user has only `readWrite` permission on the `plannova` database
- [ ] MongoDB Network Access allows only Render's IP (optional, more secure)
- [ ] `NODE_ENV=production` is set on Render
- [ ] CORS_ORIGIN is set to your exact Vercel domain (not `*`)

### Performance
- [ ] Run `npm run build` locally and verify no build errors
- [ ] Check bundle size: `dist/assets/*.js` — main bundle should be < 500KB gzipped
- [ ] Test the production build with `npm run preview`

### Functionality
- [ ] User registration works
- [ ] Login returns JWT token
- [ ] Dashboard stats load from API (not just demo data)
- [ ] All CRUD operations persist to MongoDB

---

## 5. Custom Domain (optional)

### Vercel
1. Go to your project settings → **Domains**
2. Add your custom domain: `plannova.yourdomain.com`
3. Add a CNAME record in your DNS pointing to `cname.vercel-dns.com`

### Render
1. Go to your service settings → **Custom Domains**
2. Add: `api.plannova.yourdomain.com`
3. Update `VITE_API_URL` in Vercel to point to this domain
4. Update `CORS_ORIGIN` in Render accordingly

---

## 6. Monitoring

### Recommended free tools
- **Uptime monitoring**: [UptimeRobot](https://uptimerobot.com) — ping your API every 5 minutes (also prevents Render spin-down)
- **Error tracking**: [Sentry](https://sentry.io) — free for small projects
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics) — built-in

### UptimeRobot setup (prevents Render cold starts)
1. Create account at [uptimerobot.com](https://uptimerobot.com)
2. Add new monitor:
   - Type: **HTTP(s)**
   - URL: `https://plannova-api.onrender.com/health`
   - Interval: **5 minutes**

---

## 7. Local Production Test

Before deploying, test the production build locally:

```bash
# Build frontend
npm run build

# Preview
npm run preview
# → Opens at http://localhost:4173
```

Verify:
- All routes work (try navigating directly to `/app/dashboard`)
- Theme toggle works
- Charts render correctly
- No console errors
