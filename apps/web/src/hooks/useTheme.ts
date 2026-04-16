"use client";

import { createContext, useContext } from "react";
import type { ThemeConfig } from "@/lib/themes";
import { getTheme, applyThemeToDocument } from "@/lib/themes";

interface ThemeContextValue {
  theme: ThemeConfig;
  setTheme: (themeId: string) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: getTheme("default"),
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function useApplyTheme() {
  return (themeId: string) => {
    applyThemeToDocument(themeId);
  };
}
