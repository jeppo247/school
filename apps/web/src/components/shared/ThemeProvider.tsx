"use client";

import { useState, useEffect, type ReactNode } from "react";
import { ThemeContext } from "@/hooks/useTheme";
import { getTheme, applyThemeToDocument } from "@/lib/themes";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "default",
}: ThemeProviderProps) {
  const [themeId, setThemeId] = useState(defaultTheme);
  const theme = getTheme(themeId);

  useEffect(() => {
    applyThemeToDocument(themeId);
  }, [themeId]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
}
