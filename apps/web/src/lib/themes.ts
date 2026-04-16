export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  emoji: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    surface: string;
  };
  soundSet: string;
}

export const THEMES: Record<string, ThemeConfig> = {
  default: {
    id: "default",
    name: "Upwise Blue",
    description: "The classic Upwise look",
    emoji: "🎓",
    colors: {
      primary: "#4F8CF7",
      secondary: "#A78BFA",
      accent: "#34D399",
      bg: "#F8FAFC",
      surface: "#FFFFFF",
    },
    soundSet: "default",
  },
  afl: {
    id: "afl",
    name: "AFL Footy",
    description: "Kick goals with your learning!",
    emoji: "🏈",
    colors: {
      primary: "#002B5C",
      secondary: "#E31937",
      accent: "#FFD700",
      bg: "#F0F4F8",
      surface: "#FFFFFF",
    },
    soundSet: "afl",
  },
  bluey: {
    id: "bluey",
    name: "Bluey",
    description: "Learn and play like Bluey!",
    emoji: "🐕",
    colors: {
      primary: "#5B9BD5",
      secondary: "#FF8C42",
      accent: "#7EC8E3",
      bg: "#EDF6FF",
      surface: "#FFFFFF",
    },
    soundSet: "bluey",
  },
  superheroes: {
    id: "superheroes",
    name: "Superheroes",
    description: "Become a learning superhero!",
    emoji: "🦸",
    colors: {
      primary: "#DC2626",
      secondary: "#1D4ED8",
      accent: "#FACC15",
      bg: "#FEF2F2",
      surface: "#FFFFFF",
    },
    soundSet: "superheroes",
  },
  space: {
    id: "space",
    name: "Space Explorer",
    description: "Explore the universe of knowledge!",
    emoji: "🚀",
    colors: {
      primary: "#6366F1",
      secondary: "#06B6D4",
      accent: "#F59E0B",
      bg: "#F0F0FF",
      surface: "#FFFFFF",
    },
    soundSet: "space",
  },
  animals: {
    id: "animals",
    name: "Animal Kingdom",
    description: "Learn with your favourite animals!",
    emoji: "🦘",
    colors: {
      primary: "#16A34A",
      secondary: "#92400E",
      accent: "#F97316",
      bg: "#F0FDF4",
      surface: "#FFFFFF",
    },
    soundSet: "animals",
  },
  golf: {
    id: "golf",
    name: "Golf Pro",
    description: "Ace your way to the top!",
    emoji: "⛳",
    colors: {
      primary: "#15803D",
      secondary: "#FBBF24",
      accent: "#ECFDF5",
      bg: "#F7FEE7",
      surface: "#FFFFFF",
    },
    soundSet: "golf",
  },
};

export function getTheme(themeId: string): ThemeConfig {
  return THEMES[themeId] ?? THEMES.default;
}

export function applyThemeToDocument(themeId: string): void {
  const theme = getTheme(themeId);
  const root = document.documentElement;
  root.setAttribute("data-theme", themeId);
  root.style.setProperty("--theme-primary", theme.colors.primary);
  root.style.setProperty("--theme-secondary", theme.colors.secondary);
  root.style.setProperty("--theme-accent", theme.colors.accent);
  root.style.setProperty("--theme-bg", theme.colors.bg);
  root.style.setProperty("--theme-surface", theme.colors.surface);
}
