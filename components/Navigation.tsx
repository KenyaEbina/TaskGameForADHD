"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

export default function Navigation() {
  const pathname = usePathname();
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isDark = theme === "dark";

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-black bg-white dark:bg-te-surface-dark dark:border-te-border-dark py-3 z-50">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex items-center justify-between font-mono text-sm uppercase tracking-wide">
          <div className="flex gap-6">
            <Link
              href="/"
              className={`hover:text-international-orange transition-colors ${
                pathname === "/"
                  ? "text-international-orange font-bold"
                  : "text-black dark:text-te-text-main-dark"
              }`}
            >
              [TOP]
            </Link>
            <Link
              href="/list"
              className={`hover:text-international-orange transition-colors ${
                pathname === "/list"
                  ? "text-international-orange font-bold"
                  : "text-black dark:text-te-text-main-dark"
              }`}
            >
              [LIST]
            </Link>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className={`border px-3 py-1 text-xs tracking-wide transition-colors rounded-sm ${
              isDark
                ? "border-international-orange bg-international-orange text-white shadow-[0_0_8px_rgba(255,79,0,0.6)]"
                : "border-black bg-white text-black hover:bg-gray-100 dark:bg-te-surface-dark dark:text-te-text-main-dark dark:border-te-border-dark"
            }`}
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <div className="flex items-center gap-1">
                <Moon size={14} />
                <span>Night Ops</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Sun size={14} />
                <span>Day Ops</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
