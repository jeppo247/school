"use client";

import { useCallback } from "react";
import { playSound, preloadSounds } from "@/lib/sounds";
import { useTheme } from "./useTheme";

export function useSound() {
  const { theme } = useTheme();

  const play = useCallback(
    (name: Parameters<typeof playSound>[1]) => {
      playSound(theme.soundSet, name);
    },
    [theme.soundSet],
  );

  const preload = useCallback(() => {
    preloadSounds(theme.soundSet);
  }, [theme.soundSet]);

  return { play, preload };
}
