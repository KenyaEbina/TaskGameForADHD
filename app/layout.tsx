import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import ThemeProviderClient from "@/components/ThemeProviderClient";

export const metadata: Metadata = {
  title: "Time Attack Task Manager",
  description: "ADHD向けタイムアタック・タスク管理ツール",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="bg-light-gray text-black dark:bg-te-bg-dark dark:text-te-text-main-dark transition-colors duration-200">
        <ThemeProviderClient>
          <main>{children}</main>
          <Navigation />
        </ThemeProviderClient>
      </body>
    </html>
  );
}
