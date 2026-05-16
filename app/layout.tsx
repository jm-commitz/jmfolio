import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "./additional-styles.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

import SmoothScroll from "@/components/ui/SmoothScroll";


export const metadata: Metadata = {
  metadataBase: new URL('https://www.jmancheta.cloud'),
  title: "PORTFOLIO | JM",
  description: "I build SaaS platforms, mobile apps, and web systems.",
  icons: {
    icon: '/images/logo/logo.png',
    shortcut: '/images/logo/logo.png',
    apple: '/images/logo/logo.png',
  },
  openGraph: {
    title: "Full-Stack & Mobile Developer",
    description: "I build SaaS platforms, mobile apps, and web systems.",
    url: 'https://www.jmancheta.cloud',
    siteName: 'JM Portfolio',
    images: [
      {
        url: '/images/metatags/metatags1.png',
        width: 1200,
        height: 630,
        alt: 'JM Portfolio Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Full-Stack & Mobile Developer",
    description: "I build SaaS platforms, mobile apps, and web systems.",
    images: ['/images/metatags/metatags1.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${plusJakartaSans.variable}`}>
      <body className="antialiased overflow-x-clip bg-[var(--bg)] text-[var(--fg)] relative">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[99999] focus:bg-[#FF4500] focus:text-black focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:outline-none"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <div id="main-content">
            {children}
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
