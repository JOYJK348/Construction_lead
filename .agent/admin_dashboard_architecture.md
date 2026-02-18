# 🎯 Admin Dashboard - Complete Architecture

## 📐 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ADMIN DASHBOARD (Main Entry)                     │
│                    src/components/AdminDashboard.jsx                 │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Navigation Bar (Sticky Header)                              │   │
│  │  • Logo & Title                                              │   │
│  │  • Notification Center                                       │   │
│  │  • User Profile                                              │   │
│  │  • Logout Button                                             │   │
│  │  • Desktop Tabs / Mobile Sidebar                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Content Area (Dynamic Module Rendering)                     │   │
│  │                                                               │   │
│  │  Switch (activeView):                                        │   │
│  │    ├─ 'home'         → HomeOverview                          │   │
│  │    ├─ 'leads'        → LeadsManagement                       │   │
│  │    ├─ 'survey'       → SurveyManagement                      │   │
│  │    ├─ 'engineers'    → EngineerTracking                      │   │
│  │    ├─ 'purchases'    → ClientPurchases                       │   │
│  │    ├─ 'reports'      → ReportsExports                        │   │
│  │    ├─ 'notifications'→ NotificationCenter                    │   │
│  │    ├─ 'archive'      → MasterArchive                         │   │
│  │    ├─ 'settings'     → SettingsModule                        │   │
│  │    └─ 'help'         → HelpSupport                           │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Module Breakdown

### **1️⃣ HOME OVERVIEW**
```
┌─────────────────────────────────────────────────────────┐
│  HomeOverview.jsx                                        │
├─────────────────────────────────────────────────────────┤
│  • Welcome Banner (Today, Week, Rate, Engineers)         │
│  • 4 Stat Cards (Total, Pending, Completed, Reminders)  │
│  • 3 Quick Actions (Create, View, Reports)              │
│  • Recent Leads Feed (Last 5)                           │
│  • Top Engineers Ranking (Top 5)                        │
└─────────────────────────────────────────────────────────┘
```

### **2️⃣ LEADS MANAGEMENT**
```
┌─────────────────────────────────────────────────────────┐
│  LeadsManagement.jsx                                     │
├─────────────────────────────────────────────────────────┤
│  • Search Bar (Lead, Customer, Project, Engineer)       │
│  • Filters Panel:                                       │
│    ├─ Status (Roaming/Master/Closed)                   │
│    ├─ Village Dropdown                                 │
│    ├─ Engineer Dropdown                                │
│    └─ Sort By (Date/Name)                              │
│  • Export Buttons (Excel/PDF)                          │
│  • Lead Cards Grid:                                    │
│    ├─ Lead Info (Number, Project, Customer)           │
│    ├─ Details (Engineer, Village, Date)               │
│    ├─ Status Badge                                     │
│    └─ Actions (View, Approve, Reject)                 │
│  • Rejection Modal (Reason Input)                     │
└─────────────────────────────────────────────────────────┘
```

### **3️⃣ SURVEY MANAGEMENT**
```
┌─────────────────────────────────────────────────────────┐
│  SurveyManagement.jsx                                    │
├─────────────────────────────────────────────────────────┤
│  • Search Bar (Lead, Customer, Village)                 │
│  • Survey Cards:                                        │
│    ├─ Lead Number & Customer                           │
│    ├─ Site Size & Door Estimation                      │
│    ├─ Engineer Name                                    │
│    ├─ Purchase Status (From Us/Elsewhere)              │
│    ├─ Notes Display                                    │
│    └─ Edit Button                                      │
│  • Edit Modal:                                         │
│    ├─ Village Name Input                              │
│    ├─ Site Size Input                                 │
│    ├─ Door Estimation Input                           │
│    ├─ Notes Textarea                                  │
│    ├─ Purchase Checkboxes                             │
│    └─ Save Button (with Audit Trail)                 │
└─────────────────────────────────────────────────────────┘
```

### **4️⃣ ENGINEER TRACKING**
```
┌─────────────────────────────────────────────────────────┐
│  EngineerTracking.jsx                                    │
├─────────────────────────────────────────────────────────┤
│  • Top Performers Banner (Top 3 with Medals)            │
│  • Overview Stats (Engineers, Completed, Visits, Value) │
│  • View Mode Toggle (Overview/Detailed)                │
│  • Engineer Cards:                                      │
│    ├─ Rank Badge (Gold/Silver/Bronze/Blue)            │
│    ├─ Name & Total Leads                              │
│    ├─ Stats Grid (Completed/Pending/Hold)             │
│    ├─ Performance Metrics:                            │
│    │   ├─ Site Visits Count                           │
│    │   ├─ Villages Covered                            │
│    │   └─ Estimated Value                             │
│    ├─ Completion Rate Progress Bar                    │
│    └─ Recent Leads (Detailed View)                    │
└─────────────────────────────────────────────────────────┘
```

### **5️⃣ CLIENT PURCHASES**
```
┌─────────────────────────────────────────────────────────┐
│  ClientPurchases.jsx                                     │
├─────────────────────────────────────────────────────────┤
│  • Stats Cards:                                         │
│    ├─ Purchased From Us                                │
│    ├─ Purchased Elsewhere                              │
│    ├─ Total Revenue                                    │
│    └─ No Purchase Yet                                  │
│  • Door Sales Breakdown Banner:                        │
│    ├─ Main Doors Sold (20%)                           │
│    └─ Other Doors Sold (80%)                          │
│  • Search & Filter (Type: All/Us/Elsewhere/None)       │
│  • Purchase Cards:                                      │
│    ├─ Customer & Village                               │
│    ├─ Door Breakdown (Total/Main/Other)               │
│    ├─ Estimated Revenue                                │
│    └─ Purchase Status Badge                            │
└─────────────────────────────────────────────────────────┘
```

### **6️⃣ REPORTS & EXPORTS**
```
┌─────────────────────────────────────────────────────────┐
│  ReportsExports.jsx                                      │
├─────────────────────────────────────────────────────────┤
│  • Report Type Selection:                               │
│    ├─ Summary Report                                   │
│    ├─ Detailed Report                                  │
│    ├─ Engineer Performance                             │
│    └─ Village-wise                                     │
│  • Filters Panel:                                      │
│    ├─ Date Range (Start/End)                          │
│    ├─ Engineer Dropdown                                │
│    ├─ Village Dropdown                                 │
│    └─ Status Dropdown                                  │
│  • Report Preview Stats:                               │
│    ├─ Total, Completed, Pending, Hold                 │
│    ├─ Total Doors                                     │
│    └─ Estimated Revenue                                │
│  • Export Buttons:                                     │
│    ├─ Excel (.xlsx)                                   │
│    └─ PDF (.pdf)                                      │
└─────────────────────────────────────────────────────────┘
```

### **7️⃣ MASTER ARCHIVE**
```
┌─────────────────────────────────────────────────────────┐
│  MasterArchive.jsx                                       │
├─────────────────────────────────────────────────────────┤
│  • Archive Stats Banner:                                │
│    ├─ Total Completed                                  │
│    ├─ This Month                                       │
│    ├─ Total Doors                                      │
│    └─ Total Revenue                                    │
│  • Search Bar                                          │
│  • Sort Dropdown (Date/Name)                           │
│  • Export Buttons (Excel/PDF)                          │
│  • Archive Cards (Read-Only):                          │
│    ├─ Lead Number & Project                           │
│    ├─ Customer & Engineer                             │
│    ├─ Village & Completion Date                       │
│    ├─ Revenue Info (Doors & Value)                    │
│    └─ View Details Button                             │
└─────────────────────────────────────────────────────────┘
```

### **8️⃣ SETTINGS MODULE**
```
┌─────────────────────────────────────────────────────────┐
│  SettingsModule.jsx                                      │
├─────────────────────────────────────────────────────────┤
│  • Tabbed Interface:                                    │
│    ├─ General Tab:                                     │
│    │   ├─ Company Name                                 │
│    │   ├─ Email & Phone                                │
│    │   └─ Timezone                                     │
│    ├─ Notifications Tab:                               │
│    │   ├─ Email Toggle                                 │
│    │   ├─ SMS Toggle                                   │
│    │   ├─ Push Toggle                                  │
│    │   └─ Reminder Frequency                           │
│    ├─ System Tab:                                      │
│    │   ├─ Auto Archive Toggle                          │
│    │   ├─ Require Approval Toggle                      │
│    │   ├─ Allow Engineer Edit Toggle                   │
│    │   └─ Archive After Days                           │
│    ├─ Security Tab:                                    │
│    │   ├─ Two-Factor Auth Toggle                       │
│    │   ├─ Session Timeout                              │
│    │   └─ Password Expiry                              │
│    └─ Users & Roles Tab (Placeholder)                 │
│  • Save Button (with Success Feedback)                │
└─────────────────────────────────────────────────────────┘
```

### **9️⃣ HELP & SUPPORT**
```
┌─────────────────────────────────────────────────────────┐
│  HelpSupport.jsx                                         │
├─────────────────────────────────────────────────────────┤
│  • Contact Cards:                                       │
│    ├─ Live Chat                                        │
│    ├─ Email Support                                    │
│    └─ Phone Support                                    │
│  • Quick Links:                                        │
│    ├─ User Guide                                       │
│    ├─ Video Tutorials                                  │
│    └─ API Documentation                                │
│  • FAQ Section:                                        │
│    ├─ Search Bar                                       │
│    ├─ Category Filters                                 │
│    └─ Expandable Q&A (8 FAQs)                         │
│  • Admin Workflow Guide:                               │
│    └─ 6-Step Process Visualization                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

```
┌──────────────┐
│   Supabase   │ ← Database
└──────┬───────┘
       │
       ↓ (fetchLeads)
┌──────────────────┐
│ AdminDashboard   │ ← Main Component
│ • leads state    │
│ • stats state    │
└────────┬─────────┘
         │
         ↓ (props)
┌────────────────────────────────────────┐
│  Child Modules (10 components)         │
│  • Receive leads/stats as props        │
│  • Call fetchLeads() to refresh        │
│  • Update via Supabase mutations       │
│  • Send notifications                  │
└────────────────────────────────────────┘
```

---

## 🎨 Design System

### **Colors:**
- Primary: Indigo (600-700)
- Secondary: Purple (600-700)
- Success: Green/Emerald (500-600)
- Warning: Orange/Amber (500-600)
- Error: Red/Rose (500-600)
- Info: Blue (500-600)
- Neutral: Slate (50-900)

### **Components:**
- Cards: `rounded-2xl`, `border-2`, `shadow-lg`
- Buttons: `rounded-xl`, `font-bold`, `shadow-md`
- Inputs: `rounded-xl`, `border-2`, `focus:border-indigo-500`
- Badges: `rounded-lg`, `px-3 py-1`, `font-black`
- Modals: `backdrop-blur-sm`, `rounded-3xl`

### **Animations:**
- Hover: `scale(1.02)`, `y: -4px`
- Tap: `scale(0.98)`
- Entry: `opacity: 0 → 1`, `y: 20 → 0`
- Progress: `width: 0 → X%`

---

## 📱 Responsive Breakpoints

- **Mobile:** < 768px (Single column, sidebar navigation)
- **Tablet:** 768px - 1024px (2 columns)
- **Desktop:** > 1024px (3-4 columns, tab navigation)

---

## 🔐 Security Features

- Role-based access (Admin only)
- Session management
- Audit trail logging
- Two-factor authentication (configurable)
- Password expiry settings
- Secure data handling

---

## 📊 Key Metrics Tracked

1. **Lead Metrics:** Total, Pending, Completed, On Hold
2. **Time Metrics:** Today, This Week, This Month
3. **Engineer Metrics:** Performance, Visits, Coverage
4. **Revenue Metrics:** Total, Per Lead, Per Door Type
5. **Completion Metrics:** Rate, Trends, Comparisons

---

**Architecture Status: ✅ COMPLETE & PRODUCTION-READY**
