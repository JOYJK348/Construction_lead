# Deep Technical Specification - Functional (FRD) & System (SRD)

## 1. Tactical Architecture Overview
The **Durkkas Lead Management System** is built on a specific **React-Supabase** serverless architecture. This guarantees real-time data synchronization and high availability for both Admin and Field operations.

## 2. Definitive Technology Stack

### 2.1 Core Frameworks
*   **Frontend Library**: React 18
*   **Build Tool**: Vite
*   **State Management**: React Hooks (useState/useEffect)
*   **Routing Engine**: React Router DOM (v6)

### 2.2 UI & Aesthetics
*   **CSS Framework**: Tailwind CSS
*   **Animations Engine**: Framer Motion
*   **Icon Library**: Lucide React

### 2.3 Backend & Infrastructure (Supabase)
*   **Database**: PostgreSQL 15
*   **Authentication**: Supabase Identity Management (JWT)
*   **Realtime**: Supabase Realtime (WebSockets)
*   **Cloud Storage**: Supabase Storage Buckets

### 2.4 External Integrations
*   **GIS Interface**: OpenStreetMap API (Nominatim)

## 3. Mandatory System Requirements

### 3.1 Development Environment
*   **Runtime Engine**: Node.js v18.17.0
*   **Package Manager**: NPM v9.6.7
*   **Version Control**: Git v2.41.0
*   **OS Environment**: Windows 11

### 3.2 End-User Hardware
*   **Field Device**: Smartphone with dedicated GPS/GNSS sensor
*   **Imaging**: Integrated Digital Camera (minimum 8MP)
*   **Input**: Capacitive Touchscreen

### 3.3 Software & Connectivity
*   **Primary Browser**: Google Chrome (Latest Release)
*   **Network Protocol**: 4G/LTE connectivity
*   **Security Protocol**: HTTPS/SSL encrypted channel

## 4. Advanced System Data Model (SRD)

### 2.1 Entity Relationship Details
The database follows a **Cascading Relational Model**. Every lead is the parent entity, and technical details are distributed into specialized tables for normalization.

*   **leads (Parent)**: Primary key `id` (UUID). Tracks `lead_number` (unique index), `status`, and `created_at`.
*   **customer_details**: Linked via `lead_id` (Foreign Key). Contains PII like encrypted phone and email strings.
*   **door_specifications**: Linked via `lead_id`. Uses a JSONB-friendly structure to store multiple door entries if needed, or separate rows for Main/Interior/Bathroom categories.
*   **site_visits**: Stores `ST_Point` or decimal latitude/longitude for GIS mapping. Includes `village_name` returned from reverse geocoding.

### 2.2 Role-Based Access Control (RBAC) Logic
Security is enforced at the database level using **Supabase RLS (Row Level Security)**:
*   **Admins**: Policy allows `SELECT`, `UPDATE`, `INSERT` on all rows.
*   **Engineers**: Policy allows `SELECT` and `UPDATE` only on rows where `created_by == auth.uid()`.
*   **Public**: All access is denied.

---

## 3. Deep Functional Logic Modules (FRD)

### 3.1 The "Transaction-less" Multi-Table Push
Since we are using 5+ tables for a single survey, the `leadService.js` implements a sequential async chain:
1.  **Stage 1**: Create the `leads` record and grab the `lead_id`.
2.  **Stage 2**: Push Customer, Project, and Stakeholder data concurrently using `Promise.all()`.
3.  **Stage 3**: Upload Site Photos to Supabase Buckets -> Get Public URLs.
4.  **Stage 4**: Finalize `door_specifications` with the photo URLs.
5.  **Recovery**: If any stage fails, the app uses a **"Try-Catch-Retry"** pattern to prevent orphaned records.

### 3.2 Smart Image Processing Pipeline
To handle high-resolution site photos on limited bandwidth:
1.  **Canvas Re-sampling**: The file is drawn to a hidden `<canvas>` element.
2.  **Dimension Capping**: Width/Height is capped at 1200px (standard for technical review).
3.  **Quality Interpolation**: The `canvas.toBlob()` method is used with a quality factor of `0.6`.
4.  **Result**: A 4MB site photo is reduced to ~250KB in <100ms on the device.

### 3.3 Reverse Geocoding Workflow (GIS)
1.  **Trigger**: User clicks "Use Current Location".
2.  **GPS**: Browser `navigator.geolocation` fetches precise lat/long.
3.  **API Call**: Sends coordinates to `nominatim.openstreetmap.org`.
4.  **Extraction**: The logic extracts the `village`, `hamlet`, or `suburb` tag to automatically populate the "Village Name" field for the surveyor.

---

## 4. State Management Strategy (Frontend)

### 4.1 Multi-Step Wizard State
The application uses a **Global Lead State** managed via a custom hook or React Context:
```javascript
const [formData, setFormData] = useState({
  step1: { customer_name: '', phone: '' },
  step2: { village_id: '', project_name: '' },
  // ... and so on
});
```
*   **Step Persistence**: As the user clicks "Next", the state is validated.
*   **Submission Guard**: The "Final Submit" button is locked until all mandatory keys in the `formData` object satisfy the `ValidationSchema.js`.

### 4.2 Real-time Dashboard Sync
The Admin and Surveyor dashboards use **Supabase Realtime Channels**:
*   The component subscribes to `public:leads`.
*   Whenever a surveyor submits, the Admin's `leads` state is updated via the `UPDATE` or `INSERT` payload, triggering a Framer Motion animation (e.g., a new card sliding in).

---

## 5. System Constraints & Performance KPIs
*   **Max Image Latency**: Image upload must complete in <3s on 3G network.
*   **Admin Filtering Speed**: Searching through 10,000 leads must take <1s (Optimized via Postgres Indexes on `village_name` and `customer_name`).
*   **Concurrent Write Safety**: Uses PostgreSQL Unique Constraints on `lead_number` to prevent race conditions during simultaneous site entries.

---

## 6. Directory Structure (Implementation Map)
```text
/src
  /components
    /Admin        -> Management Views (Won/Loss/Reports)
    /FormSteps    -> The 6-Step Lead Wizard components
    /Common       -> Reusable UI (Buttons, Modals, Loaders)
  /services
    authService.js    -> JWT & Session logic
    leadService.js    -> DB Interaction & Transactions
    locationService.js -> Maps & GPS APIs
    imageUtils.js     -> Compression Logic
  /supabase
    index.js          -> Supabase Client Initialization
  /styles
    index.css         -> Glassmorphism & UI Tokens
```

---
**Status**: *Deep Technical Documentation Finalized*
