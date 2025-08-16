"use client";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    const root = window.document.documentElement;

    // Helper to set theme
    const applyTheme = (themeValue: string) => {
      if (themeValue === "dark") {
        root.classList.add("dark");
      } else if (themeValue === "light") {
        root.classList.remove("dark");
      } else if (themeValue === "system") {
        // Detect system preference
        const isDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        if (isDark) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    };

    applyTheme(theme);

    // Listen for system theme changes if "system" is selected
    let mediaQuery: MediaQueryList | null = null;
    if (theme === "system") {
      mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const systemThemeListener = (e: MediaQueryListEvent) => {
        applyTheme("system");
      };
      mediaQuery.addEventListener("change", systemThemeListener);
      return () => {
        mediaQuery?.removeEventListener("change", systemThemeListener);
      };
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeProvider;
