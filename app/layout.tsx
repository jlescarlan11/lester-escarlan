import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "./auth/Provider";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "./_components/common/Footer";
import BreadcrumbsWrapper from "./_components/common/BreadcrumbsWrapper";
import VHFixer from "./_components/common/VHFixer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lester Escarlan | Portfolio",
  description:
    "Lester Escarlan's personal portfolio showcasing skills, projects, and experience.",
  keywords: [
    "Lester Escarlan",
    "Portfolio",
    "Web Developer",
    "Projects",
    "Experience",
    "Skills",
  ],
  authors: [{ name: "Lester Escarlan" }],
  openGraph: {
    title: "Lester Escarlan | Portfolio",
    description:
      "Lester Escarlan's personal portfolio showcasing skills, projects, and experience.",
    siteName: "Lester Escarlan Portfolio",
    images: [
      {
        url: "/profile-pic.jpg",
        width: 1200,
        height: 630,
        alt: "Lester Escarlan Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
  },
  metadataBase: new URL("https://lester-escarlan.vercel.app"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <VHFixer />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <main className="flex flex-col min-h-mobile-screen">
              <BreadcrumbsWrapper />
              <div className="mt-4 flex-1">{children}</div>
              <Footer />
            </main>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
