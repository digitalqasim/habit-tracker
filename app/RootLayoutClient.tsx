"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { AuthProvider } from "./providers";

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AuthProvider>
        {children}
      </AuthProvider>
      <Toaster position="top-right" closeButton richColors />
    </ThemeProvider>
  );
} 