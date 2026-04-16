import { Howl } from "howler";

type SoundName =
  | "correct"
  | "incorrect"
  | "streak"
  | "levelUp"
  | "sessionComplete"
  | "coinEarn"
  | "click"
  | "whoosh";

const soundCache = new Map<string, Howl>();

function getSound(soundSet: string, name: SoundName): Howl {
  const key = `${soundSet}/${name}`;

  if (!soundCache.has(key)) {
    const sound = new Howl({
      src: [`/sounds/${soundSet}/${name}.mp3`, `/sounds/default/${name}.mp3`],
      volume: 0.6,
      preload: true,
    });
    soundCache.set(key, sound);
  }

  return soundCache.get(key)!;
}

export function playSound(soundSet: string, name: SoundName): void {
  try {
    getSound(soundSet, name).play();
  } catch {
    // Silently fail — sounds are non-critical
  }
}

export function preloadSounds(soundSet: string): void {
  const names: SoundName[] = [
    "correct",
    "incorrect",
    "streak",
    "levelUp",
    "sessionComplete",
    "coinEarn",
    "click",
    "whoosh",
  ];

  for (const name of names) {
    getSound(soundSet, name);
  }
}

export function setVolume(volume: number): void {
  Howler.volume(Math.max(0, Math.min(1, volume)));
}
