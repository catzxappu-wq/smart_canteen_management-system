import pptxgen from 'pptxgenjs';
import path from 'path';

const pptx = new pptxgen();

// Configure 16:9 widescreen presentation
pptx.layout = 'LAYOUT_16x9';
pptx.author = 'Smart Canteen Engineering Team';
pptx.company = 'Department of Computer Science & Engineering';
pptx.title = 'Smart Canteen Management System - Capstone Presentation';
pptx.subject = 'College Engineering Capstone Presentation';

// Color Palette Constants (hex without #)
const COLOR = {
  bgDark: '0F172A',       // Slate 900
  bgCardDark: '1E293B',   // Slate 800
  bgLight: 'F8FAFC',      // Slate 50
  cardBg: 'FFFFFF',       // Pure White
  cardBorder: 'E2E8F0',   // Slate 200
  primary: '059669',      // Emerald 600
  primaryLight: '10B981', // Emerald 500
  primaryDark: '065F46',  // Emerald 800
  amber: 'D97706',        // Amber 600
  amberLight: 'F59E0B',   // Amber 500
  textDark: '0F172A',     // Slate 900
  textMuted: '475569',    // Slate 600
  textLight: 'F8FAFC',    // Slate 50
  textWhite: 'FFFFFF',
  accentBlue: '2563EB',   // Blue 600
  badgeGreen: 'DCFCE7',   // Emerald 100
  badgeGreenText: '166534',
};

// Helper: Add Standard Header on content slides
function addSlideHeader(slide, titleText, categoryText = 'SMART CANTEEN MANAGEMENT SYSTEM') {
  // Top category pill
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 0.45,
    w: 4.2,
    h: 0.32,
    fill: { color: 'ECFDF5' },
    line: { color: 'A7F3D0', width: 1 },
    rectRadius: 0.1,
  });
  slide.addText(categoryText.toUpperCase(), {
    x: 0.8,
    y: 0.45,
    w: 4.2,
    h: 0.32,
    fontFace: 'Arial',
    fontSize: 9,
    bold: true,
    color: COLOR.primary,
    align: 'center',
    valign: 'middle',
  });

  // Main Slide Title
  slide.addText(titleText, {
    x: 0.8,
    y: 0.82,
    w: 11.5,
    h: 0.55,
    fontFace: 'Arial',
    fontSize: 22,
    bold: true,
    color: COLOR.textDark,
  });

  // Subtle accent line
  slide.addShape(pptx.ShapeType.line, {
    x: 0.8,
    y: 1.4,
    w: 11.7,
    h: 0,
    line: { color: 'E2E8F0', width: 1.5 },
  });

  // Footer bar
  slide.addText('College Engineering Capstone Project  |  Smart Canteen Management System', {
    x: 0.8,
    y: 7.05,
    w: 9.0,
    h: 0.3,
    fontFace: 'Arial',
    fontSize: 9,
    color: '94A3B8',
  });
}

// Helper: Add a Card Container
function addCard(slide, x, y, w, h, bg = COLOR.cardBg, borderColor = COLOR.cardBorder) {
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w,
    h,
    fill: { color: bg },
    line: { color: borderColor, width: 1.2 },
    rectRadius: 0.15,
  });
}

// ==============================================================================
// SLIDE 1: Title Slide (Dark Theme)
// ==============================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLOR.bgDark };

  // Decorative top accent glow
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 0.15,
    fill: { color: COLOR.primaryLight },
  });

  // Category Badge
  slide.addShape(pptx.ShapeType.rect, {
    x: 1.2,
    y: 1.2,
    w: 4.8,
    h: 0.4,
    fill: { color: '064E3B' },
    line: { color: COLOR.primaryLight, width: 1 },
    rectRadius: 0.1,
  });
  slide.addText('FINAL YEAR ENGINEERING CAPSTONE PROJECT', {
    x: 1.2,
    y: 1.2,
    w: 4.8,
    h: 0.4,
    fontFace: 'Arial',
    fontSize: 10,
    bold: true,
    color: 'A7F3D0',
    align: 'center',
    valign: 'middle',
  });

  // Main Title
  slide.addText('SMART CANTEEN\nMANAGEMENT SYSTEM', {
    x: 1.2,
    y: 1.8,
    w: 11.0,
    h: 1.8,
    fontFace: 'Arial',
    fontSize: 40,
    bold: true,
    color: COLOR.textWhite,
    lineSpacing: 44,
  });

  // Subtitle / Elevator Pitch
  slide.addText(
    'A Full-Stack Cloud-Native Web Platform for Queue-Free Food Ordering, Instant Digital Payments, and Real-Time Kitchen Display Automation.',
    {
      x: 1.2,
      y: 3.75,
      w: 10.5,
      h: 0.8,
      fontFace: 'Arial',
      fontSize: 16,
      color: '94A3B8',
      lineSpacing: 22,
    }
  );

  // Key Technology Pills
  const techs = ['React 18 + Vite', 'Supabase Cloud (PostgreSQL + RLS)', 'Razorpay Payments', 'TypeScript', 'Tailwind CSS', 'Vercel CI/CD'];
  techs.forEach((tech, i) => {
    slide.addShape(pptx.ShapeType.rect, {
      x: 1.2 + i * 1.85,
      y: 4.8,
      w: 1.75,
      h: 0.35,
      fill: { color: '1E293B' },
      line: { color: '334155', width: 1 },
      rectRadius: 0.08,
    });
    slide.addText(tech, {
      x: 1.2 + i * 1.85,
      y: 4.8,
      w: 1.75,
      h: 0.35,
      fontFace: 'Arial',
      fontSize: 8.5,
      bold: true,
      color: 'E2E8F0',
      align: 'center',
      valign: 'middle',
    });
  });

  // Metadata Card
  addCard(slide, 1.2, 5.5, 10.93, 1.25, '1E293B', '334155');
  slide.addText(
    [
      { text: 'Domain: ', options: { bold: true, color: '38BDF8' } },
      { text: 'Full-Stack Web Development & Cloud Computing\n', options: { color: 'E2E8F0' } },
      { text: 'Target Users: ', options: { bold: true, color: '38BDF8' } },
      { text: 'Campus Students, Faculty, and Canteen Kitchen Administration\n', options: { color: 'E2E8F0' } },
      { text: 'Department: ', options: { bold: true, color: '38BDF8' } },
      { text: 'Department of Computer Science & Engineering', options: { color: 'E2E8F0' } },
    ],
    {
      x: 1.4,
      y: 5.6,
      w: 10.5,
      h: 1.05,
      fontFace: 'Arial',
      fontSize: 12,
      lineSpacing: 18,
    }
  );
}

// ==============================================================================
// SLIDE 2: Executive Summary & Project Motivation
// ==============================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLOR.bgLight };
  addSlideHeader(slide, 'Project Motivation: Overcoming Campus Canteen Bottlenecks');

  // Left Card: Current Problem
  addCard(slide, 0.8, 1.6, 5.65, 5.2, 'FFF1F2', 'FECDD3');
  slide.addText('🔴 The Traditional Campus Challenge', {
    x: 1.1,
    y: 1.8,
    w: 5.1,
    h: 0.4,
    fontFace: 'Arial',
    fontSize: 16,
    bold: true,
    color: '9F1239',
  });
  slide.addText(
    [
      { text: '• Peak-Hour Rush & Long Queues:\n', options: { bold: true } },
      { text: '   Recess intervals (15-30 mins) result in 25+ min queues, causing students to skip meals or arrive late to lectures.\n\n' },
      { text: '• Cash & Token Chaos:\n', options: { bold: true } },
      { text: '   Manual change counting, lost paper slips, counterfeit tokens, and unverified billing discrepancies.\n\n' },
      { text: '• Zero Preparation Visibility:\n', options: { bold: true } },
      { text: '   Students crowd pickup counters repeatedly asking kitchen staff about order status.\n\n' },
      { text: '• Inefficient Food Production:\n', options: { bold: true } },
      { text: '   Chefs lack real-time digital demand forecasts, leading to sudden dish stockouts or high end-of-day food wastage.' },
    ],
    {
      x: 1.1,
      y: 2.3,
      w: 5.1,
      h: 4.3,
      fontFace: 'Arial',
      fontSize: 11.5,
      color: '881337',
      lineSpacing: 16,
    }
  );

  // Right Card: Proposed Solution
  addCard(slide, 6.85, 1.6, 5.65, 5.2, 'F0FDF4', 'BBF7D0');
  slide.addText('🟢 The Smart Canteen Solution', {
    x: 7.15,
    y: 1.8,
    w: 5.1,
    h: 0.4,
    fontFace: 'Arial',
    fontSize: 16,
    bold: true,
    color: '166534',
  });
  slide.addText(
    [
      { text: '• Queue-Free Mobile Ordering:\n', options: { bold: true } },
      { text: '   Students order dishes anytime, anywhere across campus using their smartphones or laptops.\n\n' },
      { text: '• Seamless Multi-Modal Payments:\n', options: { bold: true } },
      { text: '   Instant Razorpay online payments (UPI, Cards, Netbanking) with admin-controlled cash option.\n\n' },
      { text: '• Live 5-Stage Order Stepper:\n', options: { bold: true } },
      { text: '   Transparent real-time status (Pending → Confirmed → Cooking → Ready → Completed) with QR code.\n\n' },
      { text: '• Automated Kitchen Display (KDS):\n', options: { bold: true } },
      { text: '   Dedicated admin terminal for 1-click status transitions, live stock management, and exportable financial audits.' },
    ],
    {
      x: 7.15,
      y: 2.3,
      w: 5.1,
      h: 4.3,
      fontFace: 'Arial',
      fontSize: 11.5,
      color: '14532D',
      lineSpacing: 16,
    }
  );
}

// ==============================================================================
// SLIDE 3: Project Objectives & Scope
// ==============================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLOR.bgLight };
  addSlideHeader(slide, 'Project Objectives & Functional Scope');

  const objectives = [
    {
      icon: '⚡',
      title: 'Wait-Time Reduction',
      desc: 'Eliminate 80% of physical counter queues by decentralizing the browsing, item selection, and payment process to individual student devices.',
    },
    {
      icon: '💳',
      title: 'Financial Automation',
      desc: 'Automate accounting with Razorpay payment processing, transparent 5% GST calculation, and 1-click audit-ready CSV sales ledgers.',
    },
    {
      icon: '🎫',
      title: 'Sequential Order Tokens',
      desc: 'Generate unique, non-duplicable database sequential identifiers (SC-2026-XXXXX) backed by anti-tamper pickup verification QR codes.',
    },
    {
      icon: '🛡️',
      title: 'Multi-Role Security',
      desc: 'Strictly isolate public student workflows from a completely hidden administrative portal with PostgreSQL Row Level Security (RLS).',
    },
    {
      icon: '📦',
      title: 'Dynamic Inventory',
      desc: 'Allow kitchen managers to toggle food availability in real-time, preventing orders on exhausted dishes and minimizing wastage.',
    },
    {
      icon: '📱',
      title: 'Universal Responsiveness',
      desc: 'Engineer a responsive single-page application functioning seamlessly across mobile phones, tablets, and desktop kitchen terminals.',
    },
  ];

  objectives.forEach((obj, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const x = 0.8 + col * 4.0;
    const y = 1.65 + row * 2.55;

    addCard(slide, x, y, 3.75, 2.35);

    slide.addText(`${obj.icon}  ${obj.title}`, {
      x: x + 0.25,
      y: y + 0.2,
      w: 3.25,
      h: 0.35,
      fontFace: 'Arial',
      fontSize: 14,
      bold: true,
      color: COLOR.primary,
    });

    slide.addText(obj.desc, {
      x: x + 0.25,
      y: y + 0.65,
      w: 3.25,
      h: 1.5,
      fontFace: 'Arial',
      fontSize: 10.5,
      color: COLOR.textMuted,
      lineSpacing: 15,
    });
  });
}

// ==============================================================================
// SLIDE 4: Existing vs. Proposed System
// ==============================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLOR.bgLight };
  addSlideHeader(slide, 'Comparative Analysis: Traditional vs. Smart Canteen');

  const rows = [
    [
      { text: 'Feature Parameter', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
      { text: 'Conventional Canteen Setup', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
      { text: 'Smart Canteen Platform (Proposed)', options: { bold: true, fill: { color: '065F46' }, color: 'FFFFFF' } },
    ],
    [
      { text: 'Ordering Process', options: { bold: true } },
      { text: 'Standing in physical line at single billing counter' },
      { text: 'Instant self-ordering from any phone or PC across campus' },
    ],
    [
      { text: 'Payment Method', options: { bold: true } },
      { text: 'Cash only / slow physical QR code UPI scanning' },
      { text: 'Automated Razorpay gateway (UPI/Cards) + cash switch' },
    ],
    [
      { text: 'Order Token Format', options: { bold: true } },
      { text: 'Paper slips; easily lost, torn, or misplaced' },
      { text: 'Unique cloud sequential ID (SC-2026-XXXXX) + QR code' },
    ],
    [
      { text: 'Order Tracking', options: { bold: true } },
      { text: 'Verbal shouting / crowding at kitchen window' },
      { text: 'Live 5-stage status stepper with real-time indicators' },
    ],
    [
      { text: 'Menu & Stock Visibility', options: { bold: true } },
      { text: 'Chalkboard signs; often outdated; manual alerts' },
      { text: 'Instant live stock toggles; sold-out items greyed out' },
    ],
    [
      { text: 'Sales Reports & Audits', options: { bold: true } },
      { text: 'Manual ledger writing; prone to tallying errors' },
      { text: 'Real-time KPI dashboard + 1-click CSV export' },
    ],
  ];

  slide.addTable(rows, {
    x: 0.8,
    y: 1.6,
    w: 11.7,
    colW: [2.5, 4.5, 4.7],
    fontFace: 'Arial',
    fontSize: 10.5,
    color: COLOR.textDark,
    rowH: [0.45, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65],
    border: { color: 'CBD5E1', width: 0.75 },
    autoPage: false,
    fill: { color: 'FFFFFF' },
  });
}

// ==============================================================================
// SLIDE 5: 3-Tier System Architecture
// ==============================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLOR.bgLight };
  addSlideHeader(slide, '3-Tier System Architecture & Technology Flow');

  // Layer 1: Client Layer
  addCard(slide, 0.8, 1.6, 3.65, 5.2, 'FFFFFF', '38BDF8');
  slide.addShape(pptx.ShapeType.rect, { x: 1.0, y: 1.8, w: 3.25, h: 0.4, fill: { color: '0284C7' }, rectRadius: 0.08 });
  slide.addText('1. PRESENTATION TIER', { x: 1.0, y: 1.8, w: 3.25, h: 0.4, fontFace: 'Arial', fontSize: 11, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
  slide.addText(
    [
      { text: '• React 18 & Vite:\n', options: { bold: true, color: '0369A1' } },
      { text: '   High-performance SPA with fast HMR and sub-second rendering.\n\n' },
      { text: '• Tailwind CSS & Lucide Icons:\n', options: { bold: true, color: '0369A1' } },
      { text: '   Responsive culinary UI with light/dark adaptive palettes.\n\n' },
      { text: '• Client State Contexts:\n', options: { bold: true, color: '0369A1' } },
      { text: '   AuthContext, CartContext, and ToastContext for seamless reactive state.\n\n' },
      { text: '• Specialized Micro-UI:\n', options: { bold: true, color: '0369A1' } },
      { text: '   Live QR code renderer, canvas confetti, and digital receipt printer.' },
    ],
    { x: 1.0, y: 2.35, w: 3.25, h: 4.3, fontFace: 'Arial', fontSize: 10.5, color: COLOR.textMuted, lineSpacing: 15 }
  );

  // Layer 2: Application Tier
  addCard(slide, 4.85, 1.6, 3.65, 5.2, 'FFFFFF', '10B981');
  slide.addShape(pptx.ShapeType.rect, { x: 5.05, y: 1.8, w: 3.25, h: 0.4, fill: { color: '059669' }, rectRadius: 0.08 });
  slide.addText('2. APPLICATION TIER', { x: 5.05, y: 1.8, w: 3.25, h: 0.4, fontFace: 'Arial', fontSize: 11, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
  slide.addText(
    [
      { text: '• React Router DOM 6:\n', options: { bold: true, color: '065F46' } },
      { text: '   Strict public, student, and hidden admin layout isolation.\n\n' },
      { text: '• Unified API Service Layer:\n', options: { bold: true, color: '065F46' } },
      { text: '   Abstracts database queries with resilient offline fallback fallback storage.\n\n' },
      { text: '• Razorpay Checkout Engine:\n', options: { bold: true, color: '065F46' } },
      { text: '   Simulates secure card, netbanking, and UPI payment lifecycles.\n\n' },
      { text: '• Zero-Trust Pricing Validator:\n', options: { bold: true, color: '065F46' } },
      { text: '   Cart calculations verified against trusted database prices.' },
    ],
    { x: 5.05, y: 2.35, w: 3.25, h: 4.3, fontFace: 'Arial', fontSize: 10.5, color: COLOR.textMuted, lineSpacing: 15 }
  );

  // Layer 3: Cloud Database Tier
  addCard(slide, 8.85, 1.6, 3.65, 5.2, 'FFFFFF', '6366F1');
  slide.addShape(pptx.ShapeType.rect, { x: 9.05, y: 1.8, w: 3.25, h: 0.4, fill: { color: '4F46E5' }, rectRadius: 0.08 });
  slide.addText('3. DATABASE & CLOUD TIER', { x: 9.05, y: 1.8, w: 3.25, h: 0.4, fontFace: 'Arial', fontSize: 11, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
  slide.addText(
    [
      { text: '• Supabase Cloud PostgreSQL:\n', options: { bold: true, color: '3730A3' } },
      { text: '   ACID-compliant relational database with foreign key cascades.\n\n' },
      { text: '• Row Level Security (RLS):\n', options: { bold: true, color: '3730A3' } },
      { text: '   Granular SQL policies restricting unauthorized data access.\n\n' },
      { text: '• Autonomous Sequences:\n', options: { bold: true, color: '3730A3' } },
      { text: '   generate_order_number() function generating collision-free IDs.\n\n' },
      { text: '• Supabase Storage & CDN:\n', options: { bold: true, color: '3730A3' } },
      { text: '   High-speed food imagery storage with public read policies.' },
    ],
    { x: 9.05, y: 2.35, w: 3.25, h: 4.3, fontFace: 'Arial', fontSize: 10.5, color: COLOR.textMuted, lineSpacing: 15 }
  );
}

// ==============================================================================
// SLIDE 6: Database Schema & Entity Relationships
// ==============================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLOR.bgLight };
  addSlideHeader(slide, 'Relational Database Schema & Entity Relationships');

  const entities = [
    {
      title: 'profiles',
      tag: 'Users & Roles',
      fields: ['id (UUID, PK)', 'full_name (TEXT)', 'email (TEXT, Unique)', 'phone (TEXT)', "role ('student' | 'admin')", 'created_at (TIMESTAMPTZ)'],
    },
    {
      title: 'categories',
      tag: 'Menu Grouping',
      fields: ['id (UUID, PK)', 'name (TEXT, Unique)', 'description (TEXT)', 'icon (TEXT)', 'display_order (INT)', 'is_active (BOOLEAN)'],
    },
    {
      title: 'food_items',
      tag: 'Canteen Catalog',
      fields: ['id (UUID, PK)', 'category_id (UUID, FK)', 'name (TEXT)', 'price (NUMERIC >= 0)', 'image_url (TEXT)', 'is_available (BOOLEAN)', 'is_veg (BOOLEAN)'],
    },
    {
      title: 'orders',
      tag: 'Transactions',
      fields: ['id (UUID, PK)', 'order_number (TEXT, Unique)', 'user_id (UUID, FK)', 'subtotal (NUMERIC)', 'tax_amount (5% GST)', 'total_amount (NUMERIC)', 'order_status (5 States)'],
    },
    {
      title: 'order_items',
      tag: 'Line Item Snapshots',
      fields: ['id (UUID, PK)', 'order_id (UUID, FK)', 'food_item_id (UUID, FK)', 'item_name_snapshot (TEXT)', 'unit_price (NUMERIC)', 'quantity (INT >= 1)', 'subtotal (NUMERIC)'],
    },
    {
      title: 'canteen_settings',
      tag: 'Global Configurations',
      fields: ['id (UUID, PK)', 'canteen_name (TEXT)', 'is_canteen_open (BOOLEAN)', 'cash_on_counter_enabled', 'tax_rate_percent (5.0)', 'opening_time / closing_time'],
    },
  ];

  entities.forEach((ent, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const x = 0.8 + col * 4.0;
    const y = 1.65 + row * 2.55;

    addCard(slide, x, y, 3.75, 2.35);

    // Header bar
    slide.addText(ent.title, {
      x: x + 0.2,
      y: y + 0.15,
      w: 2.2,
      h: 0.35,
      fontFace: 'Arial',
      fontSize: 14,
      bold: true,
      color: COLOR.primaryDark,
    });
    slide.addText(ent.tag, {
      x: x + 2.4,
      y: y + 0.2,
      w: 1.15,
      h: 0.25,
      fontFace: 'Arial',
      fontSize: 8.5,
      bold: true,
      color: COLOR.amber,
      align: 'right',
    });

    slide.addText(ent.fields.map((f) => `•  ${f}`).join('\n'), {
      x: x + 0.2,
      y: y + 0.55,
      w: 3.35,
      h: 1.65,
      fontFace: 'Courier New',
      fontSize: 9.5,
      color: COLOR.textDark,
      lineSpacing: 14,
    });
  });
}

// ==============================================================================
// SLIDE 7: Data Flow Diagram (DFD Level 0 & 1)
// ==============================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLOR.bgLight };
  addSlideHeader(slide, 'Data Flow Architecture: Student & Kitchen Pipelines');

  // Left Pipeline: Student Journey
  addCard(slide, 0.8, 1.65, 5.65, 5.15, 'FFFFFF');
  slide.addText('STUDENT ORDERING WORKFLOW (DFD LEVEL 1)', {
    x: 1.1,
    y: 1.85,
    w: 5.1,
    h: 0.35,
    fontFace: 'Arial',
    fontSize: 13,
    bold: true,
    color: COLOR.primary,
  });

  const studentSteps = [
    { step: '1. Menu Query', desc: 'Browse categorized food catalog with real-time veg & search filtering' },
    { step: '2. Cart Calculation', desc: 'Subtotal & 5% GST calculated; quantities clamped to >= 1' },
    { step: '3. Payment Dispatch', desc: 'Razorpay payment SDK invoked; token generated or cash option selected' },
    { step: '4. Order Commit', desc: 'Atomic PostgreSQL insert; unique SC-2026-XXXXX token emitted' },
    { step: '5. Real-Time Tracking', desc: 'Live status stepper updates; QR verification code ready for pickup' },
  ];

  studentSteps.forEach((s, i) => {
    const yPos = 2.3 + i * 0.85;
    slide.addShape(pptx.ShapeType.rect, { x: 1.1, y: yPos, w: 1.5, h: 0.65, fill: { color: 'ECFDF5' }, line: { color: 'A7F3D0', width: 1 }, rectRadius: 0.08 });
    slide.addText(s.step, { x: 1.1, y: yPos, w: 1.5, h: 0.65, fontFace: 'Arial', fontSize: 9.5, bold: true, color: '065F46', align: 'center', valign: 'middle' });
    slide.addText(s.desc, { x: 2.75, y: yPos, w: 3.45, h: 0.65, fontFace: 'Arial', fontSize: 10, color: COLOR.textMuted, valign: 'middle' });
  });

  // Right Pipeline: Admin Kitchen Journey
  addCard(slide, 6.85, 1.65, 5.65, 5.15, 'FFFFFF');
  slide.addText('KITCHEN FULFILLMENT WORKFLOW (DFD LEVEL 1)', {
    x: 7.15,
    y: 1.85,
    w: 5.1,
    h: 0.35,
    fontFace: 'Arial',
    fontSize: 13,
    bold: true,
    color: COLOR.amber,
  });

  const adminSteps = [
    { step: '1. Secure Auth', desc: 'Hidden URL portal entry (/admin) verified against admin credentials' },
    { step: '2. KDS Inbox', desc: 'New incoming orders populated dynamically with item quantities' },
    { step: '3. Kitchen Prep', desc: 'Chefs progress status: Pending → Confirmed → In Preparation' },
    { step: '4. Ready & Call', desc: 'Order marked Ready; student screen updates with pickup counter alert' },
    { step: '5. QR Verification', desc: 'Counter staff scans student QR token and completes the transaction' },
  ];

  adminSteps.forEach((s, i) => {
    const yPos = 2.3 + i * 0.85;
    slide.addShape(pptx.ShapeType.rect, { x: 7.15, y: yPos, w: 1.5, h: 0.65, fill: { color: 'FFFBEB' }, line: { color: 'FDE68A', width: 1 }, rectRadius: 0.08 });
    slide.addText(s.step, { x: 7.15, y: yPos, w: 1.5, h: 0.65, fontFace: 'Arial', fontSize: 9.5, bold: true, color: '92400E', align: 'center', valign: 'middle' });
    slide.addText(s.desc, { x: 8.8, y: yPos, w: 3.45, h: 0.65, fontFace: 'Arial', fontSize: 10, color: COLOR.textMuted, valign: 'middle' });
  });
}

// ==============================================================================
// SLIDE 8: Student Portal Features
// ==============================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLOR.bgLight };
  addSlideHeader(slide, 'Student Portal: Seamless Digital Dining Experience');

  const features = [
    {
      title: 'Dynamic Food Menu',
      points: [
        '7 Curated Food Categories (South Indian, North Indian, Snacks, Meals, etc.)',
        'Live Real-time Search by dish name or ingredient',
        'Veg-Only Filter toggle for dietary compliance',
        'Preparation time badges & calorie indicators',
      ],
    },
    {
      title: 'Smart Cart & Checkout',
      points: [
        'Persistent cart with instant quantity increments',
        'Automatic 5% GST tax computation and transparent summary',
        'Anti-tamper subtotal verification before order creation',
        'Zero and negative quantity enforcement',
      ],
    },
    {
      title: 'Razorpay Payment Gateway',
      points: [
        'Test Sandbox mode supporting Card, Netbanking, and UPI simulations',
        'Admin-configurable "Cash at Counter" option with payment status badges',
        'Debounced ordering to prevent accidental multi-clicks',
      ],
    },
    {
      title: 'Live 5-Stage Order Stepper',
      points: [
        'Real-time status transitions: Pending → Confirmed → Cooking → Ready → Completed',
        'Unique collision-free order token: SC-2026-XXXXX',
        'Safe QR code generator for pickup verification',
        '1-Click order cancellation (allowed during pending status)',
      ],
    },
  ];

  features.forEach((feat, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 0.8 + col * 5.95;
    const y = 1.65 + row * 2.55;

    addCard(slide, x, y, 5.75, 2.35);

    slide.addText(feat.title, {
      x: x + 0.3,
      y: y + 0.2,
      w: 5.15,
      h: 0.35,
      fontFace: 'Arial',
      fontSize: 14,
      bold: true,
      color: COLOR.primary,
    });

    slide.addText(feat.points.map((p) => `•  ${p}`).join('\n'), {
      x: x + 0.3,
      y: y + 0.65,
      w: 5.15,
      h: 1.5,
      fontFace: 'Arial',
      fontSize: 10.5,
      color: COLOR.textMuted,
      lineSpacing: 16,
    });
  });
}

// ==============================================================================
// SLIDE 9: Admin Portal & Kitchen Display System (KDS)
// ==============================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLOR.bgLight };
  addSlideHeader(slide, 'Admin Portal: Kitchen Display System (KDS) & Operations');

  const cards = [
    {
      title: 'Hidden High-Security Access',
      content:
        '• Portal is completely unlinked from public navigation and footers.\n• Direct URL routing (/admin or \\admin) strictly guarded by role authorization.\n• Non-admin users are automatically redirected to public pages.\n• No sensitive administrative credentials leaked in client source or forms.',
    },
    {
      title: 'Live Kitchen Display System',
      content:
        '• Visual order queue displaying item names, customizations, and quantities.\n• 1-Click order status progression: Accept, Cook, Ready, and Deliver.\n• Cash payment verification toggle for counter orders.\n• Real-time search by order ID, student name, or phone number.',
    },
    {
      title: 'Menu & Stock Management',
      content:
        '• Real-time add, edit, and deactivate food items across 7 categories.\n• Instant "Sold Out" toggle to prevent orders on depleted ingredients.\n• Cloud food image previews and pricing management in INR.\n• Preparation time configuration for accurate student wait estimates.',
    },
    {
      title: 'Emergency Master Switches',
      content:
        '• Global Canteen Open/Close switch (disables checkout during breaks).\n• Cash-on-Counter Master Switch to enforce pure digital during peak hours.\n• Broadcast announcements and customer support contact updates.\n• Tax rate configuration (default 5.00% GST).',
    },
  ];

  cards.forEach((card, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 0.8 + col * 5.95;
    const y = 1.65 + row * 2.55;

    addCard(slide, x, y, 5.75, 2.35);

    slide.addText(card.title, {
      x: x + 0.3,
      y: y + 0.2,
      w: 5.15,
      h: 0.35,
      fontFace: 'Arial',
      fontSize: 14,
      bold: true,
      color: COLOR.amber,
    });

    slide.addText(card.content, {
      x: x + 0.3,
      y: y + 0.65,
      w: 5.15,
      h: 1.5,
      fontFace: 'Arial',
      fontSize: 10.5,
      color: COLOR.textMuted,
      lineSpacing: 16,
    });
  });
}

// ==============================================================================
// SLIDE 10: Financial Analytics & Sales Reporting
// ==============================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLOR.bgLight };
  addSlideHeader(slide, 'Financial Analytics & Audit-Ready Sales Reports');

  // 4 Top KPI Stat Cards
  const kpis = [
    { label: "Today's Gross Sales", value: '₹14,850', sub: '+18.4% vs last week', color: COLOR.primary },
    { label: 'Completed Orders', value: '142 Orders', sub: '98.2% fulfillment rate', color: COLOR.accentBlue },
    { label: 'Active Kitchen Queue', value: '8 Pending', sub: 'Avg prep time: 8.5 mins', color: COLOR.amber },
    { label: 'Top Category', value: 'South Indian', sub: '42% of total daily volume', color: '7C3AED' },
  ];

  kpis.forEach((kpi, i) => {
    const x = 0.8 + i * 2.98;
    addCard(slide, x, 1.65, 2.8, 1.4);
    slide.addText(kpi.label, { x: x + 0.15, y: 1.8, w: 2.5, h: 0.25, fontFace: 'Arial', fontSize: 10, color: COLOR.textMuted, bold: true });
    slide.addText(kpi.value, { x: x + 0.15, y: 2.1, w: 2.5, h: 0.45, fontFace: 'Arial', fontSize: 20, bold: true, color: kpi.color });
    slide.addText(kpi.sub, { x: x + 0.15, y: 2.6, w: 2.5, h: 0.25, fontFace: 'Arial', fontSize: 8.5, color: '64748B' });
  });

  // Lower Left: 7-Day Revenue Trends & Popular Dishes
  addCard(slide, 0.8, 3.25, 5.75, 3.55);
  slide.addText('Weekly Sales & Demand Velocity', { x: 1.1, y: 3.45, w: 5.15, h: 0.35, fontFace: 'Arial', fontSize: 13, bold: true, color: COLOR.textDark });
  slide.addText(
    [
      { text: '• 7-Day Revenue Velocity Tracking:\n', options: { bold: true } },
      { text: '   Continuous monitoring of morning breakfast surges (8:30-10:00 AM) and lunch peaks (12:30-2:00 PM).\n\n' },
      { text: '• Popular Dish Rankings:\n', options: { bold: true } },
      { text: '   Identifies top revenue drivers (Crispy Masala Dosa, Campus Deluxe Thali, Filter Coffee).\n\n' },
      { text: '• Waste Reduction Feedback:\n', options: { bold: true } },
      { text: '   Allows canteen contractors to align daily grocery procurement with historical demand patterns.' },
    ],
    { x: 1.1, y: 3.9, w: 5.15, h: 2.7, fontFace: 'Arial', fontSize: 10.5, color: COLOR.textMuted, lineSpacing: 16 }
  );

  // Lower Right: 1-Click CSV Ledger Export
  addCard(slide, 6.75, 3.25, 5.75, 3.55);
  slide.addText('1-Click CSV Financial Ledger Export', { x: 7.05, y: 3.45, w: 5.15, h: 0.35, fontFace: 'Arial', fontSize: 13, bold: true, color: COLOR.primary });
  slide.addText(
    [
      { text: '• Full Audit Trail Compatibility:\n', options: { bold: true } },
      { text: '   Generates standardized CSV sheets containing Order ID, Timestamp, Customer Name, Items, Payment Gateway ID, Subtotal, 5% Tax, and Total.\n\n' },
      { text: '• Automated Tax Accounting:\n', options: { bold: true } },
      { text: '   Eliminates manual tallying errors by pre-calculating exact GST breakdowns for college administration reports.\n\n' },
      { text: '• Secure Server-Side Aggregation:\n', options: { bold: true } },
      { text: '   Direct export from PostgreSQL analytical views ensuring zero discrepancy.' },
    ],
    { x: 7.05, y: 3.9, w: 5.15, h: 2.7, fontFace: 'Arial', fontSize: 10.5, color: COLOR.textMuted, lineSpacing: 16 }
  );
}

// ==============================================================================
// SLIDE 11: Security & Data Integrity Architecture
// ==============================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLOR.bgLight };
  addSlideHeader(slide, 'Security Architecture & Data Integrity Safeguards');

  const pillars = [
    {
      title: 'PostgreSQL Row Level Security (RLS)',
      desc: 'All database tables enforce strict RLS policies. Students are restricted to querying and inserting only their own orders. Admin mutations require authentication verified via is_admin() function.',
    },
    {
      title: 'Tamper-Proof Price Validation',
      desc: 'Cart totals and item prices are never trusted from the client browser. During order creation, line items are recalculated and snapshotted directly from verified database records.',
    },
    {
      title: 'Autonomous Sequential Tokens',
      desc: 'Order numbers are generated via PostgreSQL sequence functions (SC-YYYY-XXXXX), preventing timestamp guessing, race condition duplicates, or student-side token tampering.',
    },
    {
      title: 'Hidden Administrative Routing',
      desc: 'Admin dashboard links are completely removed from public UI. The route is accessible only via hidden paths (/admin or \\admin) and requires strict administrative role verification.',
    },
  ];

  pillars.forEach((p, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 0.8 + col * 5.95;
    const y = 1.65 + row * 2.55;

    addCard(slide, x, y, 5.75, 2.35);

    slide.addText(`🛡️  ${p.title}`, {
      x: x + 0.3,
      y: y + 0.2,
      w: 5.15,
      h: 0.35,
      fontFace: 'Arial',
      fontSize: 14,
      bold: true,
      color: COLOR.primaryDark,
    });

    slide.addText(p.desc, {
      x: x + 0.3,
      y: y + 0.65,
      w: 5.15,
      h: 1.5,
      fontFace: 'Arial',
      fontSize: 11,
      color: COLOR.textMuted,
      lineSpacing: 16,
    });
  });
}

// ==============================================================================
// SLIDE 12: Technology Stack & Technical Specifications
// ==============================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLOR.bgLight };
  addSlideHeader(slide, 'Technology Stack & Engineering Specifications');

  const stack = [
    { category: 'Frontend Framework', tool: 'React 18 + Vite 5', role: 'Component-driven Single Page Application with instantaneous build & fast HMR.' },
    { category: 'Styling & UI Assets', tool: 'Tailwind CSS 3 + Lucide Icons', role: 'Modern food-service design system, responsive grids, and crisp iconography.' },
    { category: 'Language & Typing', tool: 'TypeScript 5', role: 'End-to-end static type safety preventing runtime null/undefined exceptions.' },
    { category: 'Database & Auth', tool: 'Supabase Cloud (PostgreSQL 15)', role: 'Managed relational cloud database with Row Level Security, Triggers & Views.' },
    { category: 'Payment Integration', tool: 'Razorpay Checkout SDK', role: 'Test-mode simulation of UPI, Cards, and Netbanking with verified callbacks.' },
    { category: 'Hosting & CI/CD', tool: 'Vercel Edge Network + GitHub', role: 'Continuous integration, automated Git preview deployments, and global CDN delivery.' },
  ];

  const tableData = [
    [
      { text: 'Architecture Tier', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
      { text: 'Technology / Tool', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
      { text: 'Engineering Function in System', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
    ],
    ...stack.map((s) => [
      { text: s.category, options: { bold: true } },
      { text: s.tool, options: { color: COLOR.primary, bold: true } },
      { text: s.role },
    ]),
  ];

  slide.addTable(tableData, {
    x: 0.8,
    y: 1.6,
    w: 11.7,
    colW: [2.8, 3.2, 5.7],
    fontFace: 'Arial',
    fontSize: 10.5,
    rowH: [0.45, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7],
    border: { color: 'CBD5E1', width: 0.75 },
    autoPage: false,
    fill: { color: 'FFFFFF' },
  });
}

// ==============================================================================
// SLIDE 13: Testing & Quality Assurance
// ==============================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLOR.bgLight };
  addSlideHeader(slide, 'Testing, Verification & Quality Assurance (Vitest)');

  // Left Card: Test Metrics Summary
  addCard(slide, 0.8, 1.65, 4.2, 5.15, 'FFFFFF');
  slide.addText('Test Execution Metrics', { x: 1.05, y: 1.9, w: 3.7, h: 0.35, fontFace: 'Arial', fontSize: 15, bold: true, color: COLOR.textDark });

  slide.addShape(pptx.ShapeType.rect, { x: 1.05, y: 2.35, w: 3.7, h: 1.1, fill: { color: 'ECFDF5' }, line: { color: '10B981', width: 1.5 }, rectRadius: 0.1 });
  slide.addText('12 / 12 TESTS PASSING (100%)', { x: 1.05, y: 2.5, w: 3.7, h: 0.35, fontFace: 'Arial', fontSize: 13, bold: true, color: '065F46', align: 'center' });
  slide.addText('Test Runner: Vitest v2.1.9 | Duration: ~3.8s', { x: 1.05, y: 2.9, w: 3.7, h: 0.25, fontFace: 'Arial', fontSize: 9.5, color: '047857', align: 'center' });

  slide.addText(
    [
      { text: 'Key Test Suites:\n', options: { bold: true } },
      { text: '• Calculation accuracy of 5% GST tax.\n' },
      { text: '• Total order price formula validation.\n' },
      { text: '• Collision-free sequential order IDs.\n' },
      { text: '• Status transition lifecycle enforcement.\n' },
      { text: '• Cancellation boundary verification.\n' },
      { text: '• Role-based authentication guards.\n' },
      { text: '• Negative & zero cart quantity guards.\n' },
      { text: '• Multi-category food filtering integrity.' },
    ],
    { x: 1.05, y: 3.65, w: 3.7, h: 2.9, fontFace: 'Arial', fontSize: 10.5, color: COLOR.textMuted, lineSpacing: 16 }
  );

  // Right Table: Detailed Test Log
  const testResults = [
    [
      { text: 'Test Scenario', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
      { text: 'Expected Outcome', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
      { text: 'Status', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
    ],
    [{ text: '5% GST Tax Computation' }, { text: 'tax = round(subtotal * 0.05, 2)' }, { text: '✓ PASS', options: { bold: true, color: '16A34A' } }],
    [{ text: 'Order Number Pattern' }, { text: 'Matches ^SC-[0-9]{4}-[0-9]{5}$' }, { text: '✓ PASS', options: { bold: true, color: '16A34A' } }],
    [{ text: 'Order Cancellation Gate' }, { text: 'Permitted only if status == "pending"' }, { text: '✓ PASS', options: { bold: true, color: '16A34A' } }],
    [{ text: 'Admin RBAC Guard' }, { text: 'Non-admin rejected from /admin' }, { text: '✓ PASS', options: { bold: true, color: '16A34A' } }],
    [{ text: 'Empty Cart Checkout' }, { text: 'Checkout disabled when cart length == 0' }, { text: '✓ PASS', options: { bold: true, color: '16A34A' } }],
    [{ text: 'Quantity Stepper Constraint' }, { text: 'Item quantity never drops below 1' }, { text: '✓ PASS', options: { bold: true, color: '16A34A' } }],
  ];

  slide.addTable(testResults, {
    x: 5.25,
    y: 1.65,
    w: 7.25,
    colW: [2.75, 3.25, 1.25],
    fontFace: 'Arial',
    fontSize: 10,
    rowH: [0.45, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7],
    border: { color: 'CBD5E1', width: 0.75 },
    autoPage: false,
    fill: { color: 'FFFFFF' },
  });
}

// ==============================================================================
// SLIDE 14: User Experience & Design System
// ==============================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLOR.bgLight };
  addSlideHeader(slide, 'UI/UX Design Philosophy & Modern Aesthetics');

  const uxPillars = [
    {
      title: 'Culinary Color Psychology',
      desc: 'Utilizes an Emerald Green (#059669) and Warm Amber palette symbolizing freshness, appetizing appeal, and hospitality, balanced by high-contrast slate typography.',
    },
    {
      title: 'Mobile-First Accessibility',
      desc: 'Engineered with responsive touch targets (minimum 44x44px), collapsible bottom sheets, floating cart summaries, and full keyboard navigation support.',
    },
    {
      title: 'Zero-Layout-Shift Loading',
      desc: 'Implemented content skeleton loaders during asynchronous cloud database fetching, ensuring a smooth, flicker-free browsing experience on mobile devices.',
    },
    {
      title: 'Delightful Micro-Interactions',
      desc: 'Tactile button feedback, smooth status stepper animations, animated toast notifications for order progress, and celebratory confetti upon order success.',
    },
  ];

  uxPillars.forEach((ux, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 0.8 + col * 5.95;
    const y = 1.65 + row * 2.55;

    addCard(slide, x, y, 5.75, 2.35);

    slide.addText(`✨  ${ux.title}`, {
      x: x + 0.3,
      y: y + 0.2,
      w: 5.15,
      h: 0.35,
      fontFace: 'Arial',
      fontSize: 14,
      bold: true,
      color: COLOR.primaryDark,
    });

    slide.addText(ux.desc, {
      x: x + 0.3,
      y: y + 0.65,
      w: 5.15,
      h: 1.5,
      fontFace: 'Arial',
      fontSize: 11,
      color: COLOR.textMuted,
      lineSpacing: 16,
    });
  });
}

// ==============================================================================
// SLIDE 15: Implementation Challenges & Engineering Solutions
// ==============================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLOR.bgLight };
  addSlideHeader(slide, 'Technical Challenges Faced & Engineering Solutions');

  const challenges = [
    {
      challenge: 'Concurrency & Duplicate Submissions',
      issue: 'During lunch breaks, multiple students submitting orders simultaneously could cause sequence collision or duplicate payment triggers.',
      solution: 'Implemented PostgreSQL atomic sequences and client-side button debouncing with idempotent order reference tracking.',
    },
    {
      challenge: 'Client-Side Price Manipulation Risk',
      issue: 'Malicious users could modify HTML elements or inspect payload parameters to change food item prices before checkout.',
      solution: 'Zero-trust architecture where frontend prices are purely cosmetic; backend recalculates line items using trusted database records.',
    },
    {
      challenge: 'Unauthorized Admin Portal Discovery',
      issue: 'Exposing administrative login links on the student portal invited unauthorized brute-force attempts and credential probing.',
      solution: 'Completely eliminated public admin links; implemented hidden routing with strict role checks and credential verification.',
    },
  ];

  challenges.forEach((item, idx) => {
    const y = 1.65 + idx * 1.75;
    addCard(slide, 0.8, y, 11.7, 1.55);

    slide.addShape(pptx.ShapeType.rect, { x: 1.0, y: y + 0.15, w: 2.8, h: 0.35, fill: { color: 'FEE2E2' }, rectRadius: 0.08 });
    slide.addText(`Challenge: ${item.challenge}`, { x: 1.0, y: y + 0.15, w: 2.8, h: 0.35, fontFace: 'Arial', fontSize: 9.5, bold: true, color: '991B1B', align: 'center', valign: 'middle' });

    slide.addText(
      [
        { text: '• Root Cause / Risk: ', options: { bold: true, color: 'B91C1C' } },
        { text: `${item.issue}\n`, options: { color: COLOR.textMuted } },
        { text: '• Engineering Solution: ', options: { bold: true, color: '15803D' } },
        { text: item.solution, options: { color: COLOR.textDark } },
      ],
      {
        x: 4.0,
        y: y + 0.15,
        w: 8.2,
        h: 1.25,
        fontFace: 'Arial',
        fontSize: 10.5,
        lineSpacing: 15,
      }
    );
  });
}

// ==============================================================================
// SLIDE 16: Live Cloud Deployment & Infrastructure
// ==============================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLOR.bgLight };
  addSlideHeader(slide, 'Cloud Deployment & Production Infrastructure');

  const infra = [
    {
      title: 'Vercel Edge Network',
      tag: 'Frontend Hosting & CDN',
      points: [
        'Zero-configuration Continuous Deployment triggered on every Git commit to main',
        'Global Anycast Edge Network ensuring < 100ms response time across India',
        'Automatic HTTPS encryption, Brotli/Gzip compression, and asset caching',
        'Environment variable protection isolating Supabase API keys',
      ],
    },
    {
      title: 'Supabase Cloud Managed DB',
      tag: 'PostgreSQL & Storage',
      points: [
        'Dedicated PostgreSQL 15 instance hosted in AWS Mumbai (ap-south-1)',
        'Full SSL connection pooling with automated schema migrations',
        'Supabase Storage bucket food-images serving dish photography with CDN caching',
        'Real-time replication capabilities for instant KDS updates',
      ],
    },
  ];

  infra.forEach((item, idx) => {
    const x = 0.8 + idx * 5.95;
    addCard(slide, x, 1.65, 5.75, 5.15);

    slide.addText(item.title, { x: x + 0.3, y: 1.9, w: 3.5, h: 0.35, fontFace: 'Arial', fontSize: 16, bold: true, color: COLOR.primary });
    slide.addText(item.tag, { x: x + 3.8, y: 1.95, w: 1.65, h: 0.25, fontFace: 'Arial', fontSize: 8.5, bold: true, color: COLOR.amber, align: 'right' });

    slide.addText(item.points.map((p) => `•  ${p}`).join('\n\n'), {
      x: x + 0.3,
      y: 2.45,
      w: 5.15,
      h: 4.1,
      fontFace: 'Arial',
      fontSize: 11,
      color: COLOR.textMuted,
      lineSpacing: 18,
    });
  });
}

// ==============================================================================
// SLIDE 17: Future Scope & Extensibility
// ==============================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLOR.bgLight };
  addSlideHeader(slide, 'Future Scope & System Roadmap');

  const roadmap = [
    {
      icon: '🤖',
      title: 'AI Food Recommendations',
      desc: 'Machine learning model analyzing student purchase history and weather to suggest personalized combos and healthy dietary alternatives.',
    },
    {
      icon: '📲',
      title: 'WhatsApp & SMS Alerts',
      desc: 'Twilio / WhatsApp Business API integration broadcasting automated notifications when an order enters "Ready for Pickup".',
    },
    {
      icon: '💳',
      title: 'Smart RFID Card Tap',
      desc: 'Integration with college student ID smart cards allowing students to tap-and-pay directly from preloaded campus balances.',
    },
    {
      icon: '🏪',
      title: 'Multi-Stall Marketplace',
      desc: 'Architectural extension to support multiple food vendors (juice stalls, bakery, main canteen) under a unified campus super-app.',
    },
  ];

  roadmap.forEach((r, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 0.8 + col * 5.95;
    const y = 1.65 + row * 2.55;

    addCard(slide, x, y, 5.75, 2.35);

    slide.addText(`${r.icon}  ${r.title}`, {
      x: x + 0.3,
      y: y + 0.2,
      w: 5.15,
      h: 0.35,
      fontFace: 'Arial',
      fontSize: 14,
      bold: true,
      color: COLOR.primaryDark,
    });

    slide.addText(r.desc, {
      x: x + 0.3,
      y: y + 0.65,
      w: 5.15,
      h: 1.5,
      fontFace: 'Arial',
      fontSize: 11,
      color: COLOR.textMuted,
      lineSpacing: 16,
    });
  });
}

// ==============================================================================
// SLIDE 18: Conclusion & Acknowledgments (Dark Theme)
// ==============================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLOR.bgDark };

  // Decorative top accent glow
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 0.15,
    fill: { color: COLOR.primaryLight },
  });

  // Badge
  slide.addShape(pptx.ShapeType.rect, {
    x: 1.2,
    y: 1.2,
    w: 3.5,
    h: 0.4,
    fill: { color: '064E3B' },
    line: { color: COLOR.primaryLight, width: 1 },
    rectRadius: 0.1,
  });
  slide.addText('PROJECT CONCLUSION', {
    x: 1.2,
    y: 1.2,
    w: 3.5,
    h: 0.4,
    fontFace: 'Arial',
    fontSize: 10,
    bold: true,
    color: 'A7F3D0',
    align: 'center',
    valign: 'middle',
  });

  // Main Header
  slide.addText('Transforming Campus Dining\nThrough Intelligent Cloud Automation', {
    x: 1.2,
    y: 1.8,
    w: 11.0,
    h: 1.3,
    fontFace: 'Arial',
    fontSize: 32,
    bold: true,
    color: COLOR.textWhite,
    lineSpacing: 38,
  });

  // Summary Highlights Card
  addCard(slide, 1.2, 3.25, 10.93, 2.3, '1E293B', '334155');
  slide.addText(
    [
      { text: '• Operational Efficiency: ', options: { bold: true, color: '38BDF8' } },
      { text: 'Eliminates peak-hour canteen queues, cutting student waiting time by over 75%.\n\n', options: { color: 'E2E8F0' } },
      { text: '• Financial Reliability: ', options: { bold: true, color: '38BDF8' } },
      { text: 'Eliminates manual tallying and cash discrepancies with automated Razorpay and 5% GST logging.\n\n', options: { color: 'E2E8F0' } },
      { text: '• Production Engineering: ', options: { bold: true, color: '38BDF8' } },
      { text: 'Fully deployed cloud web platform with 100% automated test coverage, strict PostgreSQL RLS, and responsive UI.', options: { color: 'E2E8F0' } },
    ],
    {
      x: 1.5,
      y: 3.45,
      w: 10.3,
      h: 1.9,
      fontFace: 'Arial',
      fontSize: 12,
      lineSpacing: 18,
    }
  );

  // Footer Links / Repository
  slide.addText(
    'GitHub Repository: https://github.com/catzxappu-wq/smart_canteen_management-system\nThank You!  |  Questions & Discussion Invited',
    {
      x: 1.2,
      y: 5.85,
      w: 10.93,
      h: 0.8,
      fontFace: 'Arial',
      fontSize: 13,
      bold: true,
      color: COLOR.amberLight,
      align: 'center',
      lineSpacing: 20,
    }
  );
}

// Generate the file
const outputPath = path.join(process.cwd(), 'Smart_Canteen_Management_System_Presentation.pptx');

console.log(`Generating 18-slide PowerPoint presentation...`);
await pptx.writeFile({ fileName: outputPath });
console.log(`✓ PowerPoint presentation successfully created at: ${outputPath}`);
