# 🏠 Rental Landing Page — Boilerplate Setup Guide

> **Stack:** Next.js 14 · Tailwind CSS · shadcn/ui · App Router · Metadata API · JSON-LD · Framer Motion

---

## Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org/) v18.17 or later
- npm

---

## Step 1 — Create Next.js App

```bash
npx create-next-app@latest dale_prime_landing
```

When prompted, select the following options:

```
✔ Would you like to use TypeScript? → Yes
✔ Would you like to use ESLint? → Yes
✔ Would you like to use Tailwind CSS? → Yes
✔ Would you like to use the `src/` directory? → No
✔ Would you like to use App Router? → Yes
✔ Would you like to customize the default import alias (@/*)? → Yes (keep default @/*)
```

Then navigate into the project:

```bash
cd dale_prime_landing
```

---

## Step 2 — Install shadcn/ui

Initialize shadcn/ui inside your project:

```bash
npx shadcn@latest init
```

When prompted:

```
✔ Which style would you like to use? → Default
✔ Which color would you like to use as base color? → Slate
✔ Would you like to use CSS variables for colors? → Yes
```

Install some commonly used components for a landing page:

```bash
npx shadcn@latest add button card badge separator avatar
```

---

## Step 3 — Install Framer Motion

```bash
npm install framer-motion
```

---

## Step 4 — Project Structure

Your folder structure should look like this:

```
dale_prime_landing/
├── app/
│   ├── layout.tsx        ← Root layout + Metadata API
│   ├── page.tsx          ← Main landing page
│   └── globals.css       ← Tailwind base styles
├── components/
│   ├── ui/               ← shadcn/ui auto-generated components
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── Gallery.tsx
│   └── Footer.tsx
├── lib/
│   └── utils.ts          ← shadcn/ui utility (auto-generated)
├── public/
│   └── images/           ← Property images
└── ...config files
```

---

## Step 5 — Setup Metadata API (SEO)

In `app/layout.tsx`, add global metadata:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Your Rental Property | Book Now",
    template: "%s | Your Rental",
  },
  description: "Discover and book our beautiful rental property. Perfect for families, couples, and getaways.",
  keywords: ["rental", "airbnb", "vacation home", "booking"],
  openGraph: {
    title: "Your Rental Property",
    description: "Book your stay today.",
    url: "https://yourdomain.com",
    siteName: "Your Rental",
    images: [
      {
        url: "/images/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Rental Property Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Rental Property",
    description: "Book your stay today.",
    images: ["/images/og-cover.jpg"],
  },
};
```

---

## Step 6 — Add JSON-LD Structured Data

Create `components/JsonLd.tsx`:

```tsx
export default function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "Your Rental Property",
    description: "A beautiful vacation rental property available for short-term stays.",
    url: "https://yourdomain.com",
    telephone: "+1-234-567-8900",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Beach Road",
      addressLocality: "Your City",
      addressRegion: "Your State",
      postalCode: "00000",
      addressCountry: "US",
    },
    image: "https://yourdomain.com/images/og-cover.jpg",
    priceRange: "$$",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

Then add it to `app/layout.tsx` inside `<body>`:

```tsx
import JsonLd from "@/components/JsonLd";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
```

---

## Step 7 — Framer Motion Example Usage

In any component (e.g., `components/Hero.tsx`):

```tsx
"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center min-h-screen text-center px-6"
    >
      <h1 className="text-5xl font-bold tracking-tight">Find Your Perfect Stay</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Relax, unwind, and feel at home wherever you are.
      </p>
    </motion.section>
  );
}
```

> ⚠️ Always add `"use client"` at the top of any component using Framer Motion.

---

## Step 8 — Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Quick Reference — All Install Commands

```bash
# 1. Create app
npx create-next-app@latest rental-landing

# 2. Init shadcn/ui
npx shadcn@latest init

# 3. Add shadcn components
npx shadcn@latest add button card badge separator avatar

# 4. Install Framer Motion
npm install framer-motion
```

---

## ✅ Stack Checklist

| Tool | Status |
|---|---|
| Next.js 14 (App Router) | ✅ Step 1 |
| Tailwind CSS | ✅ Included in Step 1 |
| shadcn/ui | ✅ Step 2 |
| Framer Motion | ✅ Step 3 |
| Metadata API (SEO) | ✅ Step 5 |
| JSON-LD Structured Data | ✅ Step 6 |
