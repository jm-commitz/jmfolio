import type { Metadata } from "next";
import { Space_Mono, Permanent_Marker, Anton } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";
import "./additional-styles.css";

const bebasNeue = localFont({
  src: '../font/Bebas_Neue/BebasNeue-Regular.ttf',
  variable: "--font-bebas",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

const permanentMarker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-permanent",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://jmfolio.vercel.app'),
  title: "JM — Full-Stack & Mobile Developer",
  description: "I build SaaS platforms, mobile apps, and web systems.",
  openGraph: {
    title: "JM — Full-Stack & Mobile Developer",
    description: "I build SaaS platforms, mobile apps, and web systems.",
    url: 'https://jmfolio.vercel.app',
    siteName: 'JM Portfolio',
    images: [
      {
        url: '/images/metatags/metatags.png',
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
    title: "JM — Full-Stack & Mobile Developer",
    description: "I build SaaS platforms, mobile apps, and web systems.",
    images: ['/images/metatags/metatags.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${bebasNeue.variable} ${spaceMono.variable} ${permanentMarker.variable} ${anton.variable}`}>
      <body className="font-mono antialiased overflow-x-hidden cursor-none bg-[var(--bg)] text-[var(--fg)]">
        {children}
      </body>
    </html>
  );
}
