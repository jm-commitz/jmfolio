import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import FloatingThemeToggle from "@/components/theme/FloatingThemeToggle";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jmancheta.cloud"),
  title: "Jaymark Ancheta | Portfolio",
  description: "Full-Stack & Mobile Developer. Building the Next Big Thing.",
  openGraph: {
    title: "Jaymark Ancheta | Portfolio",
    description: "Full-Stack & Mobile Developer. Building the Next Big Thing.",
    url: "https://jmancheta.cloud",
    siteName: "Jaymark Ancheta",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jaymark Ancheta | Portfolio",
    description: "Full-Stack & Mobile Developer. Building the Next Big Thing.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable} suppressHydrationWarning>
      <body className={`${dmSans.className} min-h-screen antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <FloatingThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
