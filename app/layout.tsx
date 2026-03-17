import type { Metadata } from "next";

import "./globals.css";
import "./additional-styles.css";
export const metadata: Metadata = {
  title: {
    default: "jmfolio",
    template: "%s | Portfolio",
  },
  description: "Welcome to my portfolio. showcasing my work and projects.",
  keywords: ["portfolio", "projects", "work", "showcase"],
  openGraph: {
    title: "Portfolio",
    description: "Welcome to my portfolio.",
    url: "https://yourdomain.com",
    siteName: "Portfolio",
    images: [
      {
        url: "/images/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Portfolio Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio",
    description: "Welcome to my portfolio.",
    images: ["/images/og-cover.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
