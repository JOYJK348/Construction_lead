# 🚀 DEPLOYMENT GUIDE
**Lead & Site Management System - Production Deployment**

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### ✅ What You Have Completed
- [x] Database schema created (`CONSOLIDATED_MASTER.sql`)
- [x] All features implemented (Phases 1-6)
- [x] Vibrant, mobile-first UI
- [x] Auto-location capture
- [x] Real-time notifications
- [x] Admin approval workflow
- [x] Excel & PDF export

---

## 🗄️ DATABASE SETUP (Supabase)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and region
4. Set database password (save it securely!)
5. Wait for project to initialize (~2 minutes)

### Step 2: Run Database Schema
1. Open **SQL Editor** in Supabase dashboard
2. Click "New Query"
3. Copy entire contents of `CONSOLIDATED_MASTER.sql`
4. Paste into SQL Editor
5. Click "Run" (▶️ button)
6. Wait for "Success" message

### Step 3: Verify Tables Created
1. Go to **Table Editor** in Supabase
2. You should see 10 tables:
   - ✅ users
   - ✅ leads
   - ✅ customer_details
   - ✅ project_information
   - ✅ stakeholder_details
   - ✅ lead_assignments
   - ✅ site_visits
   - ✅ door_specifications
   - ✅ payment_details
   - ✅ notifications

### Step 4: Get API Credentials
1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** (starts with `https://`)
   - **anon public** key (long string)
3. Save these for next step

---

## 🔧 FRONTEND CONFIGURATION

### Step 1: Update Environment Variables
1. Open `.env` file in your project root
2. Update with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file

### Step 2: Install Dependencies (if not done)
```bash
npm install
```

### Step 3: Test Locally
```bash
npm run dev
```

Visit `http://localhost:5173` and test:
- ✅ Login works
- ✅ Can create a lead
- ✅ Location captures on photo upload
- ✅ Dashboard shows leads
- ✅ Notifications appear

---

## 🌐 PRODUCTION DEPLOYMENT

### Option 1: Vercel (Recommended - Free)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Deploy
```bash
vercel
```

Follow prompts:
- Project name: `leadpro` (or your choice)
- Framework: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

#### Step 4: Add Environment Variables
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

Paste your values when prompted.

#### Step 5: Redeploy with Env Vars
```bash
vercel --prod
```

Your app is now live! 🎉

---

### Option 2: Netlify (Alternative - Free)

#### Step 1: Build the App
```bash
npm run build
```

#### Step 2: Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### Step 3: Deploy
```bash
netlify deploy --prod
```

- Publish directory: `dist`
- Add environment variables in Netlify dashboard

---

### Option 3: Manual Build + Any Host

#### Step 1: Build
```bash
npm run build
```

#### Step 2: Upload `dist` folder
Upload the entire `dist` folder to:
- AWS S3 + CloudFront
- DigitalOcean App Platform
- Firebase Hosting
- Any static hosting service

#### Step 3: Configure Environment Variables
Set these in your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 🔐 SECURITY SETUP (IMPORTANT!)

### Step 1: Enable Row Level Security (RLS)
Run this in Supabase SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_information ENABLE ROW LEVEL SECURITY;
ALTER TABLE stakeholder_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE door_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Example: Users can only see their own notifications
CREATE POLICY "Users can view own notifications"
ON notifications FOR SELECT
USING (auth.uid()::text = user_id::text);

-- Add more policies as needed for your security requirements
```

### Step 2: Implement Password Hashing
Currently using placeholder passwords. For production:

1. Use Supabase Auth (recommended):
   - Enable Email Auth in Supabase dashboard
   - Update Login.jsx to use `supabase.auth.signInWithPassword()`

2. OR implement server-side hashing:
   - Create Supabase Edge Function
   - Use bcrypt or argon2 for password hashing

---

## 👥 USER MANAGEMENT

### Add New Users
Run in Supabase SQL Editor:

```sql
-- Add Admin User
INSERT INTO users (email, password_hash, full_name, role)
VALUES ('admin@yourcompany.com', 'TEMP_PASSWORD', 'Admin Name', 'admin');

-- Add Engineer User
INSERT INTO users (email, password_hash, full_name, role)
VALUES ('engineer@yourcompany.com', 'TEMP_PASSWORD', 'Engineer Name', 'engineer');
```

**Note**: Replace `TEMP_PASSWORD` with properly hashed passwords in production!

---

## 📊 MONITORING & MAINTENANCE

### Check Database Usage
1. Supabase Dashboard → **Database** → **Usage**
2. Monitor:
   - Database size
   - API requests
   - Bandwidth

### Backup Strategy
1. Supabase automatically backs up daily
2. For manual backup:
   - Dashboard → **Database** → **Backups**
   - Click "Create Backup"

### Performance Optimization
1. Add indexes for frequently queried columns:
```sql
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_site_visits_village ON site_visits(village_name);
```

---

## 🐛 TROUBLESHOOTING

### Issue: "Failed to fetch" on login
**Solution**: 
- Check `.env` has correct Supabase URL and key
- Verify Supabase project is active
- Check browser console for CORS errors

### Issue: Location not capturing
**Solution**:
- Ensure app is served over HTTPS (required for geolocation)
- Check browser permissions for location access
- Verify OpenStreetMap Nominatim API is accessible

### Issue: Notifications not appearing
**Solution**:
- Check notifications table exists
- Verify Supabase Realtime is enabled (Settings → API → Realtime)
- Check browser console for subscription errors

### Issue: Export not working
**Solution**:
- Verify `xlsx` and `jspdf` packages are installed
- Check browser allows file downloads
- Test with smaller dataset first

---

## 📱 MOBILE APP (Optional Future Enhancement)

To convert to mobile app:

### Option 1: PWA (Progressive Web App)
1. Add `manifest.json`
2. Register service worker
3. Users can "Add to Home Screen"

### Option 2: React Native
1. Use React Native Web
2. Share components between web and mobile
3. Build native apps for iOS/Android

### Option 3: Capacitor
1. Install Capacitor: `npm install @capacitor/core @capacitor/cli`
2. Initialize: `npx cap init`
3. Build: `npm run build && npx cap sync`
4. Deploy to app stores

---

## 🎯 POST-DEPLOYMENT TASKS

### Week 1
- [ ] Test all features in production
- [ ] Train admin users
- [ ] Train field engineers
- [ ] Monitor error logs

### Week 2
- [ ] Collect user feedback
- [ ] Fix any bugs discovered
- [ ] Optimize performance based on usage

### Month 1
- [ ] Review analytics
- [ ] Plan Phase 7 features (if needed)
- [ ] Set up automated backups
- [ ] Document any custom workflows

---

## 📞 SUPPORT CONTACTS

### Technical Issues
- Supabase Support: [supabase.com/support](https://supabase.com/support)
- Vercel Support: [vercel.com/support](https://vercel.com/support)

### Documentation
- Supabase Docs: [supabase.com/docs](https://supabase.com/docs)
- React Docs: [react.dev](https://react.dev)
- Vite Docs: [vitejs.dev](https://vitejs.dev)

---

## 🎉 YOU'RE LIVE!

Your Lead & Site Management System is now in production! 

**Next Steps:**
1. Share the URL with your team
2. Create user accounts for all field engineers
3. Start collecting leads!
4. Monitor the dashboard for insights

**Remember:**
- Regular backups
- Monitor usage
- Update dependencies monthly
- Collect user feedback

---

**Built with ❤️ using React, Supabase, and modern web technologies**
