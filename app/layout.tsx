"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

// Metadata needs to be in a separate file or exported directly (not in a client component)
export const metadata = {
  title: "Habit Tracker",
  description: "Track your habits and achieve your goals",
};

// Client component wrapper
function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AuthProvider>
        {children}
      </AuthProvider>
      <Toaster position="top-right" closeButton richColors />
    </ThemeProvider>
  );
}

// Server component (default export)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}