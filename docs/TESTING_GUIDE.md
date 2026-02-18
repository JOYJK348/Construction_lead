# 🧪 COMPLETE TESTING GUIDE
**Lead & Site Management System - Professional Testing Checklist**

---

## 🎯 PRE-TESTING SETUP

### ✅ Verify These Are Complete:
1. [ ] Database setup (`CONSOLIDATED_MASTER.sql` executed in Supabase)
2. [ ] `.env` file has correct Supabase credentials
3. [ ] `npm run dev` is running
4. [ ] Browser is open to `http://localhost:5173`

---

## 👤 TEST USERS

### Admin Account
- **Email**: `admin@leadpro.com`
- **Password**: Any password (placeholder auth)
- **Role**: Admin
- **Access**: Full dashboard, approve/reject, all leads

### Engineer Account
- **Email**: `engineer@leadpro.com`
- **Password**: Any password (placeholder auth)
- **Role**: Engineer
- **Access**: Create leads, view assigned leads only

---

## 📋 TESTING SCENARIOS

### 1️⃣ **LOGIN FLOW** ✅

#### Test 1.1: Admin Login
1. Open `http://localhost:5173`
2. Enter `admin@leadpro.com`
3. Enter any password
4. Click "Sign In"

**Expected Result**:
- ✅ Redirects to Admin Dashboard
- ✅ Shows "Admin Dashboard" header
- ✅ Shows 5 statistics cards (Total, Pending, On Hold, Completed, Today)
- ✅ Shows notification bell icon
- ✅ Shows "Sign Out" button

#### Test 1.2: Engineer Login
1. Logout from admin
2. Enter `engineer@leadpro.com`
3. Enter any password
4. Click "Sign In"

**Expected Result**:
- ✅ Redirects to Dashboard (same as admin but filtered)
- ✅ Shows "My Leads" header
- ✅ Shows statistics cards
- ✅ Shows "New Lead" button

---

### 2️⃣ **CREATE NEW LEAD (Engineer)** ✅

#### Test 2.1: Complete Lead Creation Flow
1. Login as Engineer
2. Click "New Lead" button
3. **Step 1 - Customer Details**:
   - Enter Customer Name: "Rajesh Kumar"
   - Enter Mobile: "9876543210"
   - Enter Email: "rajesh@test.com" (optional)
   - Enter Address: "Plot 123, MG Road, Bangalore"
   - Click "Next Step"

**Expected Result**:
- ✅ Form validates required fields
- ✅ Mobile number accepts only 10 digits
- ✅ Moves to Step 2

4. **Step 2 - Project Details**:
   - Enter Project Name: "Green Valley Residency"
   - Select Building Type: "Residential Apartment"
   - Select Construction Stage: "Foundation"
   - Enter Timeline: "3 months"
   - Enter Door Count: "15"
   - Click "Next Step"

**Expected Result**:
- ✅ All fields validate
- ✅ Moves to Step 3

5. **Step 3 - Stakeholder Details**:
   - Enter Architect Name: "Ar. Suresh Kumar"
   - Enter Architect Contact: "9876543211"
   - Enter Contractor Name: "BuildWell Constructions"
   - Enter Contractor Contact: "9876543212"
   - Click "Next Step"

**Expected Result**:
- ✅ Contact numbers validate (10 digits)
- ✅ Moves to Step 4

6. **Step 4 - Door Specifications**:
   - **Main Door**:
     - Select Material: "Teak Wood"
     - Select Size: "7x3 feet"
     - Enter Quantity: "1"
     - **Upload Photo** (Important!)
   - Click "Next Step"

**Expected Result**:
- ✅ Photo upload triggers GPS capture
- ✅ **Latitude & Longitude appear automatically**
- ✅ **Village name appears automatically** (via reverse geocoding)
- ✅ Moves to Step 5

7. **Step 5 - Payment & Priority**:
   - Select Payment Methods: "Cash", "Bank Transfer"
   - Select Lead Source: "Direct Visit"
   - Select Priority: "High"
   - Select Completion Date: (any future date)
   - Click "Next Step"

**Expected Result**:
- ✅ All fields validate
- ✅ Moves to Step 6 (Review)

8. **Step 6 - Review & Submit**:
   - Review all details
   - Click "Submit Lead"

**Expected Result**:
- ✅ Success screen appears
- ✅ Shows "Lead Collected!" message
- ✅ Shows lead number (e.g., "CL-2026-1234")
- ✅ **Engineer receives notification**: "✅ Lead CL-2026-XXXX created successfully"
- ✅ **Admin receives notification**: "🆕 New lead CL-2026-XXXX created by Test Engineer"

---

### 3️⃣ **AUTO-LOCATION CAPTURE** ✅

#### Test 3.1: GPS Coordinates
1. In Door Specification step
2. Upload any photo
3. **Watch the form**

**Expected Result**:
- ✅ "📍 Capturing location..." message appears
- ✅ Latitude field fills automatically (e.g., "12.9716")
- ✅ Longitude field fills automatically (e.g., "77.5946")
- ✅ Fields are read-only (cannot edit)

#### Test 3.2: Village Name (Reverse Geocoding)
1. After GPS coordinates appear
2. Wait 2-3 seconds

**Expected Result**:
- ✅ "🌍 Fetching location details..." message appears
- ✅ Village/Area name appears (e.g., "Bangalore Urban")
- ✅ Place details appear (e.g., "Karnataka, India")

---

### 4️⃣ **ADMIN DASHBOARD** ✅

#### Test 4.1: Statistics Cards
1. Login as Admin
2. View dashboard

**Expected Result**:
- ✅ **Total Leads**: Shows correct count
- ✅ **Pending**: Shows "Roaming" status count
- ✅ **On Hold**: Shows "Temporarily Closed" count
- ✅ **Completed**: Shows "Master" count
- ✅ **Today**: Shows leads created today

#### Test 4.2: Lead Cards Display
**Expected Result**:
- ✅ Each lead shows:
  - Lead number badge (blue)
  - Status badge (color-coded)
  - Project name
  - Customer name with icon
  - Village name with icon
  - Created date with icon
  - Door count with icon
  - Assigned engineer name
  - "View Details" button
  - "Approve" button (if Roaming)
  - "Reject" button (if Roaming)

#### Test 4.3: Search Functionality
1. Type in search box: "Rajesh"

**Expected Result**:
- ✅ Filters leads by customer name
- ✅ Also searches by village, project name, lead number

#### Test 4.4: Status Filters
1. Click "Roaming" filter

**Expected Result**:
- ✅ Shows only Roaming leads
- ✅ Button highlights with gradient

2. Click "All Leads"

**Expected Result**:
- ✅ Shows all leads again

---

### 5️⃣ **APPROVE LEAD (Admin)** ✅

#### Test 5.1: Approval Flow
1. Login as Admin
2. Find a "Roaming" status lead
3. Click "Approve" button

**Expected Result**:
- ✅ Confirmation alert appears
- ✅ Lead status changes to "Master"
- ✅ Status badge turns green
- ✅ **Engineer receives notification**: "🎉 Lead CL-2026-XXXX has been approved and moved to Master Data"
- ✅ Approve/Reject buttons disappear

#### Test 5.2: Notification Delivery
1. Open two browser windows side-by-side
2. Login as Admin in Window 1
3. Login as Engineer in Window 2
4. In Window 1 (Admin), approve a lead

**Expected Result**:
- ✅ **Window 2 (Engineer)** receives notification **instantly** (without refresh!)
- ✅ Bell icon shows unread count
- ✅ Notification appears in dropdown

---

### 6️⃣ **REJECT LEAD (Admin)** ✅

#### Test 6.1: Rejection Flow
1. Login as Admin
2. Find a "Roaming" status lead
3. Click "Reject" button

**Expected Result**:
- ✅ Modal appears: "Rejection Reason"
- ✅ Textarea is focused
- ✅ "Cancel" and "Submit" buttons visible

4. Enter reason: "Customer not available, follow up next week"
5. Click "Submit"

**Expected Result**:
- ✅ Modal closes
- ✅ Lead status changes to "Temporarily Closed"
- ✅ Status badge turns orange
- ✅ Reason appears in orange box on lead card
- ✅ **Engineer receives notification**: "⚠️ Lead CL-2026-XXXX requires attention: Customer not available, follow up next week"

---

### 7️⃣ **NOTIFICATION CENTER** ✅

#### Test 7.1: View Notifications
1. Click bell icon in header

**Expected Result**:
- ✅ Dropdown panel appears
- ✅ Shows all notifications (newest first)
- ✅ Unread notifications have white background
- ✅ Read notifications have gray background
- ✅ Each notification shows:
  - Icon (based on type)
  - Message
  - Time ago (e.g., "2 minutes ago")
  - "Mark as read" / "Mark as unread" button
  - Delete button (trash icon)

#### Test 7.2: Mark as Read
1. Click "Mark as read" on an unread notification

**Expected Result**:
- ✅ Background turns gray
- ✅ Unread count decreases
- ✅ Button changes to "Mark as unread"

#### Test 7.3: Mark All as Read
1. Click "Mark all as read" button

**Expected Result**:
- ✅ All notifications turn gray
- ✅ Unread count becomes 0
- ✅ Bell icon no longer shows badge

#### Test 7.4: Delete Notification
1. Click trash icon on a notification

**Expected Result**:
- ✅ Notification disappears from list
- ✅ Count updates

---

### 8️⃣ **EXPORT FUNCTIONALITY** ✅

#### Test 8.1: Export to Excel
1. Login as Admin
2. Ensure there are some leads
3. Click "Export Excel" button

**Expected Result**:
- ✅ Excel file downloads automatically
- ✅ Filename includes date: `leads_export_2026-02-15.xlsx`
- ✅ File contains columns:
  - Lead Number
  - Status
  - Customer Name
  - Customer Phone
  - Project Name
  - Village
  - Building Type
  - Construction Stage
  - Total Doors
  - Engineer
  - Created Date
  - Latitude
  - Longitude
  - Reason

#### Test 8.2: Export to PDF
1. Click "Export PDF" button

**Expected Result**:
- ✅ PDF file downloads automatically
- ✅ Filename includes date: `leads_export_2026-02-15.pdf`
- ✅ PDF contains:
  - Title: "Lead Management Report"
  - Generation date
  - Total leads count
  - Table with all lead data
  - Page numbers in footer

#### Test 8.3: Export Filtered Data
1. Apply a filter (e.g., "Roaming")
2. Click "Export Excel"

**Expected Result**:
- ✅ Exports only filtered leads (not all leads)

---

### 9️⃣ **REMINDER SYSTEM** ✅

#### Test 9.1: Auto-Reminder Check
1. Login as Admin
2. Dashboard loads

**Expected Result**:
- ✅ `checkAndTriggerReminders()` runs automatically
- ✅ Console shows: "Checking for pending reminders..."
- ✅ If any leads have `next_availability_date` within 24 hours:
  - Creates reminder notification
  - Sends browser notification (if permission granted)

#### Test 9.2: Manual Reminder Creation
1. In Supabase, update a lead:
```sql
UPDATE leads 
SET next_availability_date = CURRENT_DATE + INTERVAL '1 day'
WHERE id = 'some-lead-id';
```
2. Refresh Admin Dashboard

**Expected Result**:
- ✅ Reminder notification created for assigned engineer
- ✅ Message: "Reminder: Lead CL-2026-XXXX - Client available tomorrow"

---

### 🔟 **MOBILE RESPONSIVENESS** ✅

#### Test 10.1: Mobile View (iPhone/Android)
1. Open Chrome DevTools (F12)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Select "iPhone 12 Pro"

**Expected Result**:
- ✅ Statistics cards stack in 2 columns
- ✅ Search bar full width
- ✅ Filters scroll horizontally
- ✅ Lead cards stack vertically
- ✅ Buttons are touch-friendly (44px minimum)
- ✅ Text is readable (16px minimum)

#### Test 10.2: Tablet View (iPad)
1. Select "iPad Air"

**Expected Result**:
- ✅ Statistics cards show 3-4 columns
- ✅ Lead details show in grid (2 columns)
- ✅ All features accessible

---

## 🎨 UI/UX VERIFICATION

### Visual Checklist:
- [ ] **Gradients**: All buttons and badges use vibrant gradients
- [ ] **Icons**: All sections have colorful icons
- [ ] **Animations**: Smooth transitions when navigating
- [ ] **Shadows**: Cards have depth with shadows
- [ ] **Colors**: Status badges are color-coded (Blue=Pending, Orange=On Hold, Green=Completed)
- [ ] **Typography**: Headers use Poppins (bold), body uses Inter
- [ ] **Spacing**: Consistent padding and margins
- [ ] **Hover Effects**: Buttons scale/shadow on hover

---

## 🐛 ERROR HANDLING

### Test Error Scenarios:

#### Test E1: Invalid Mobile Number
1. Enter mobile: "123"
2. Try to proceed

**Expected Result**:
- ✅ Error message: "Mobile number must be exactly 10 digits"
- ✅ Cannot proceed to next step

#### Test E2: Missing Required Fields
1. Leave Customer Name empty
2. Try to proceed

**Expected Result**:
- ✅ Error message: "Customer/Owner Name is required"
- ✅ Field highlights in red

#### Test E3: Network Error
1. Disconnect internet
2. Try to submit lead

**Expected Result**:
- ✅ Alert: "Failed to submit lead. Please try again."
- ✅ Form data is preserved

---

## ✅ FINAL VERIFICATION

### Complete System Check:
- [ ] Login works for both Admin and Engineer
- [ ] Lead creation flow completes successfully
- [ ] GPS coordinates capture automatically
- [ ] Village name appears via reverse geocoding
- [ ] Admin dashboard shows statistics
- [ ] Approve button changes lead to Master
- [ ] Reject button opens modal and updates status
- [ ] Notifications appear in real-time
- [ ] Bell icon shows unread count
- [ ] Export Excel downloads file
- [ ] Export PDF downloads file
- [ ] Search filters leads correctly
- [ ] Status filters work
- [ ] Mobile view is responsive
- [ ] All animations are smooth

---

## 📊 PERFORMANCE METRICS

### Expected Load Times:
- **Login**: < 1 second
- **Dashboard Load**: < 2 seconds
- **Lead Creation**: < 3 seconds
- **Notification Delivery**: < 500ms (real-time)
- **Export Generation**: < 5 seconds

---

## 🎯 SUCCESS CRITERIA

### Your system is ready if:
✅ All 10 test scenarios pass  
✅ No console errors  
✅ Notifications work in real-time  
✅ GPS auto-capture works  
✅ Export functions work  
✅ Mobile view is responsive  
✅ UI looks professional and vibrant  

---

## 🚀 NEXT STEPS AFTER TESTING

1. **Fix any bugs** found during testing
2. **Deploy to production** (see `DEPLOYMENT_GUIDE.md`)
3. **Train users** on the system
4. **Monitor** for issues in first week
5. **Collect feedback** for improvements

---

## 📞 TROUBLESHOOTING

### Common Issues:

**Issue**: "Failed to fetch" on login  
**Solution**: Check `.env` has correct Supabase credentials

**Issue**: GPS not capturing  
**Solution**: Ensure HTTPS (required for geolocation API)

**Issue**: Notifications not appearing  
**Solution**: Check Supabase Realtime is enabled in Settings → API

**Issue**: Export not working  
**Solution**: Verify `xlsx` and `jspdf` packages are installed

---

**Happy Testing! 🎉**

**If all tests pass, your system is PRODUCTION-READY!** ✅
