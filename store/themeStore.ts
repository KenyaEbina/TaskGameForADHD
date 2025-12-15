import { create } from "zustand";

export type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "light",
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => {
    const current = get().theme;
    set({ theme: current === "light" ? "dark" : "light" });
  },
}));
