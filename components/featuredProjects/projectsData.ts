/** High-level type for /projects filter (Dashboard, Landing page, etc.) */
export type ProjectCategory =
  | 'Dashboard'
  | 'Booking platform'
  | 'POS'
  | 'Rental platform';

export type Project = {
  slug: string;
  num: string;
  name: string;
  img: string;
  video?: string;
  gallery?: string[];
  category: ProjectCategory;
  techs: string[];
  year: string;
  shortDesc: string;
  clientProblem: string;
  solution: string;
  features: string[];
};

export const projects: Project[] = [
  {
    slug: "doit-app",
    num: "01",
    name: "DOIT APP",
    img: "/images/projects/doit/home.jpg",
    video: "/images/projects/doit/DoIt.mp4",
    gallery: [
      "/images/projects/doit/home.jpg",
      "/images/projects/doit/orders.jpg",
      "/images/projects/doit/chat.jpg",
      "/images/projects/doit/maps.jpg",
      "/images/projects/doit/rewards.jpg",
      "/images/projects/doit/profile.jpg",
    ],
    category: "POS",
    techs: ["Flutter", "Laravel", "MySQL"],
    year: "2024",
    shortDesc:
      "All-in-one POS and delivery app for water refilling stations and laundry services.",
    clientProblem:
      "Business owners juggling both water delivery and laundry pickup/drop-off were managing everything manually — orders were lost, riders had no route visibility, and customers had no way to track their requests in real time.",
    solution:
      "I built DoIt as a unified mobile platform with a POS backend for in-store transactions, a delivery scheduling module with live map tracking, and a customer-facing app with order history, real-time chat, and a loyalty rewards system.",
    features: [
      "POS for walk-in water refills and laundry drop-offs with container and service type support",
      "Delivery order management with live map tracking for riders and customers",
      "Real-time in-app chat between customers and staff",
      "Rewards and loyalty points system to retain repeat customers",
      "Order status tracking across all stages (pending, picked up, on the way, delivered)",
      "Customer profile with full order history and outstanding balances",
    ],
  },
  {
    slug: "mrp-inventory-pos",
    num: "02",
    name: "MRP + INVENTORY + POS SYSTEM",
    img: "/images/projects/inventory.png",
    video: "/images/projects/mrp.mp4",
    category: "Dashboard",
    techs: ["React.js", "Zustand", "TanStack Query", "Laravel"],
    year: "2025",
    shortDesc:
      "Integrated system combining MRP, inventory, and POS in a single dashboard.",
    clientProblem:
      "Client used separate tools for production planning, inventory tracking, and front-store sales, causing stockouts, overproduction, and manual double encoding.",
    solution:
      "I implemented a single web system that links MRP, warehouse inventory, and in-store POS so that every sale and production run automatically updates stock levels and material requirements.",
    features: [
      "MRP planning with bill of materials and production runs",
      "Centralized inventory management for raw materials and finished goods",
      "POS interface optimized for fast in-store checkout",
      "Automatic stock adjustments and movement history",
      "Dashboard for sales, margins, and production efficiency",
    ],
  },
  {
    slug: "airbnb-booking-system",
    num: "03",
    name: "AIRBNB BOOKING SYSTEM",
    img: "/images/projects/airbnb.png",
    video: "/images/airbnb.mp4",
    category: "Booking platform",
    techs: ["Next.js", "Node.js", "Prisma"],
    year: "2026",
    shortDesc:
      "Full booking platform inspired by Airbnb for property rentals and reservations.",
    clientProblem:
      "Client needed a self-hosted booking platform instead of relying solely on third-party marketplaces, to reduce fees and own the customer relationship.",
    solution:
      "I built a custom booking workflow similar to Airbnb where owners can list properties, set availability, and manage reservations while guests can search, filter, and book stays.",
    features: [
      "Property listings with photos, pricing, and availability calendars",
      "Search and filter by location, date, price, and capacity",
      "Reservation flow with booking summary and confirmation",
      "Owner dashboard for managing listings and upcoming stays",
      "Database layer built with Prisma for reliability and type safety",
    ],
  },
  {
    slug: "multi-tenant-pos",
    num: "04",
    name: "MULTI-TENANT POS SYSTEM",
    img: "/images/projects/salepoint.png",
    category: "POS",
    techs: ["Flutter", "Laravel", "MySQL"],
    year: "2026",
    shortDesc:
      "Scalable offline-first POS platform designed for multiple businesses under one system.",
    clientProblem:
      "Software provider wanted a single POS platform that could serve many different businesses while ensuring data is strictly isolated and work can continue during intermittent internet outages.",
    solution:
      "I implemented an offline-first architecture where every workspace operates on a local-first database, ensuring 100% uptime for transactions, which then automatically syncs to the centralized Laravel backend once an internet connection is established.",
    features: [
      "Offline-first transaction engine for 100% uptime during outages",
      "Seamless background synchronization once connection is restored",
      "Tenant-level isolation for products, users, and transactions",
      "Flutter-based POS interface that runs smoothly on tablets",
      "Role-based access for admins, cashiers, and managers",
      "Sales reporting per tenant and consolidated views for the provider",
      "Configurable tax, discounts, and receipt layouts per business",
    ],
  },
  {
    slug: "omnichannel-sales-dashboard",
    num: "05",
    name: "OMNICHANNEL SALES DASHBOARD",
    img: "/images/projects/omnichannel.png",
    video: "/images/omnichannel.mp4",
    category: "Dashboard",
    techs: ["React.js", "Zustand", "TanStack Query", "Laravel", "MySQL"],
    year: "2025",
    shortDesc:
      "Centralized dashboard for managing and monitoring multi-platform sales across Lazada, Shopee, TikTok, and Shopify.",
    clientProblem:
      "Client was managing sales separately across multiple marketplaces, leading to inconsistent reports, manual reconciliations, and no single source of truth for performance.",
    solution:
      "I designed a central dashboard backed by a Laravel REST API that aggregates orders, revenue, and inventory from each channel and exposes everything through a unified UI built with React, Zustand, and TanStack Query.",
    features: [
      "Real-time revenue and order tracking across Lazada, Shopee, TikTok, and Shopify",
      "Multi-store and multi-brand support with consolidated analytics",
      "Product catalog sync to keep SKUs consistent across channels",
      "Top-selling product insights and performance breakdowns",
      "Delivery and fulfillment status monitoring in a single view",
    ],
  },
  {
    slug: "condo-rental-system",
    num: "06",
    name: "REAL STATE MANAGEMENT SYSTEM",
    img: "/images/projects/dale.png",
    video: "/images/projects/Dale.mp4",
    category: "Rental platform",
    techs: ["Next.js", "Laravel", "MySQL"],
    year: "2026",
    shortDesc:
      "Rental platform with both landing page and admin dashboard for real estate properties.",
    clientProblem:
      "Property owner needed a way to market condo units and track bookings and tenants without relying only on listing platforms.",
    solution:
      "I delivered a dual-facing system: a clean marketing site for prospects and an internal dashboard for managing units, tenants, and bookings.",
    features: [
      "Landing page showcasing condo amenities, location, and units",
      "Unit listings with availability and pricing",
      "Booking and reservation management with basic workflows",
      "Tenant record management and stay history",
      "Admin dashboard for monitoring occupancy and revenue",
    ],
  },
];

export const getProjectBySlug = (slug: string) =>
  projects.find((project) => project.slug === slug);

