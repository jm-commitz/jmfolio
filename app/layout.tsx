import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import FloatingThemeToggle from "@/components/theme/FloatingThemeToggle";
import ViewerCount from "@/components/presence/ViewerCount";
import SpotifyRail from "@/components/spotify/SpotifyRail";
import FloatingRail from "@/components/ui/FloatingRail";
import HelloSplash from "@/components/ui/HelloSplash";
import PageBackground from "@/components/ui/PageBackground";
import ConsoleGreeting from "@/components/ui/ConsoleGreeting";
import TemplateCredit from "@/components/ui/TemplateCredit";

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
          {/* Decorative dot-grid / glow / grain background (see .page-bg) */}
          <PageBackground />
          {/* DevTools console easter egg */}
          <ConsoleGreeting />
          {/* Required template credit (see LICENSE) */}
          <TemplateCredit />
          {children}

          {/* Floating rail, bottom-right: live viewers, Spotify, theme toggle */}
          <FloatingRail>
            <ViewerCount />
            <SpotifyRail />
            <FloatingThemeToggle />
          </FloatingRail>

          {/* iOS-style "hello" splash, plays on every load */}
          <HelloSplash />
        </ThemeProvider>
      </body>
    </html>
  );
}
