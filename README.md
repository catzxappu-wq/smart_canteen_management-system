# 🍱 Smart Canteen Management System
> **A Full-Stack Campus Food Ordering, Express Queue Token, and Canteen Administration Platform**  
> Built with React, Vite, TypeScript, Tailwind CSS, Supabase (PostgreSQL + RLS), and Razorpay.

---

## 🌟 Key Features

### 🎓 1. Student Portal
- **Online Food Menu**: Real-time browsing across South Indian, North Indian, Combos, Beverages, and Desserts.
- **Dietary & Search Filters**: Instant keyword search, pure vegetarian toggle, and bestseller highlights.
- **Interactive Food Tray (Cart)**: Transparent line-item pricing and 5% GST computation.
- **Secure Dual-Mode Payment**:
  - **Razorpay Online**: UPI (Google Pay, PhonePe, Paytm), Cards, and NetBanking in test mode.
  - **Cash on Counter**: Pay cash at pickup (with admin master switch).
- **Authoritative Unique Token**: Formatted sequence `SC-2026-00001` with cryptographic QR code.
- **Live Kitchen Queue Tracking**: 5-stage live progress indicator (*Pending* ➔ *Confirmed* ➔ *Preparing* ➔ *Ready for Pickup* ➔ *Completed*).
- **Digital Student Dining Card & Print Receipt**: Clean CSS print styling for physical order tokens.

### 🛡️ 2. Admin Operations Cockpit
- **Live Kitchen Display System (KDS)**: Real-time ticket management with single-click cooking progression.
- **Food Inventory Governance**: Add new dishes, upload food images, edit prices, set prep time, and instant "Sold Out" switches.
- **Cash Verification**: Record cash payments collected at the counter.
- **Master Switches**: 1-click toggles for Canteen Open/Closed status and Cash at Counter policy.
- **Financial Analytics**: Revenue breakdowns excluding cancelled orders, portion sales rankings, and 7-day sales trend graphs.
- **CSV Data Export**: 1-click export of verified transaction ledgers for campus accounts.

---

## 🚀 Quick Evaluation Demo Accounts

For instant grading, pair-programming review, and demonstrations, two pre-configured accounts are available directly with 1-click auto-fill:

| Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Student** | `student@campus.edu` | `student123` | Browse menu, order meals, track live queue, print receipts |
| **Admin** | `admin@campus.edu` | `admin123` | Manage menu, accept tickets, update status, sales reports |

*Note: You can also use the top header bar's **"Switch Student"** and **"Switch Admin"** pills to switch roles instantly.*

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite 5, TypeScript 5, Tailwind CSS 3, Lucide React
- **Backend & Database**: PostgreSQL 15 on Supabase with Row Level Security (RLS)
- **Realtime**: Supabase Realtime WebSocket replication
- **Edge Functions**: Deno / Supabase Serverless Edge Functions
- **Payment Gateway**: Razorpay (Checkout.js) with test mode integration
- **Testing**: Vitest, React Testing Library, JSDOM
- **Deployment**: Vercel ready with `vercel.json` SPA routing

---

## 📂 Project Structure

```text
smart-canteen-system/
├── docs/
│   ├── PROJECT_REPORT.md       # Comprehensive Capstone Engineering Report
│   └── DEPLOYMENT_GUIDE.md     # Production Supabase, Razorpay & Vercel Guide
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   └── common/             # Navbar, Footer, StatusBadge, FoodCard, Modals, Steppers
│   ├── context/
│   │   ├── AuthContext.tsx     # Supabase auth & local session state
│   │   ├── CartContext.tsx     # Cart calculations and persistence
│   │   └── ToastContext.tsx    # Accessible alert notifications
│   ├── layouts/
│   │   ├── PublicLayout.tsx    # Public header, banner, footer
│   │   ├── StudentLayout.tsx   # Student portal layout with subnav
│   │   └── AdminLayout.tsx     # Admin dashboard layout with sidebar
│   ├── lib/
│   │   └── supabase.ts         # Centralized Supabase client instance
│   ├── pages/
│   │   ├── public/             # Home, Menu, Login, Register, About, Contact
│   │   ├── student/            # Dashboard, Cart, Checkout, Confirmation, Tracking, Profile
│   │   └── admin/              # Dashboard, Orders, Food Items, Categories, Reports, Settings
│   ├── services/
│   │   ├── api.ts              # Unified API with trusted calculations
│   │   ├── mockData.ts         # Realistic Indian college menu seed data
│   │   └── razorpay.ts         # Razorpay checkout handler & test sandbox
│   ├── test/
│   │   ├── setup.ts            # Test environment configuration
│   │   └── canteen.test.ts     # 11 automated unit & integration tests
│   ├── types/
│   │   └── index.ts            # TypeScript data models
│   ├── App.tsx                 # Route configuration
│   ├── index.css               # Tailwind CSS & print styles
│   └── main.tsx                # Application bootstrap
├── supabase/
│   ├── functions/              # Edge functions for Razorpay creation & verification
│   ├── migrations/             # SQL schema, RLS policies & triggers
│   └── seed.sql                # College canteen seed records
├── vercel.json                 # Vercel SPA rewrites & caching rules
└── vite.config.ts              # Vite & Vitest configuration
```

---

## ⚡ Getting Started Locally

```bash
# 1. Install dependencies
npm install

# 2. Run automated test suite
npm test

# 3. Build for production
npm run build

# 4. Start local development server
npm run dev
```

---

## 🧪 Testing Results

Run the test suite using `npm test`:

```text
 ✓ src/test/canteen.test.ts (11 tests)
 Test Files  1 passed (1)
      Tests  11 passed (11)
```

11 out of 11 tests passed verifying menu search, category filtering, trusted order calculation, token sequencing, sold-out stock guards, cancellation rules, status progression, and admin availability toggles.

---

## 📄 License
MIT License. Created for College Engineering Capstone Demonstration.
