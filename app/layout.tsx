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
  title: "JM — Full-Stack & Mobile Developer",
  description: "I build SaaS platforms, mobile apps, and web systems.",
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
