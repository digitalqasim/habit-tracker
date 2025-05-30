import "./globals.css";
import { Inter } from "next/font/google";
import { RootLayoutClient } from "./RootLayoutClient";

const inter = Inter({ subsets: ["latin"] });

// Metadata needs to be in a separate file or exported directly (not in a client component)
export const metadata = {
  title: "Habit Tracker",
  description: "Track your habits and achieve your goals",
};

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