"use client";

// Interface sounds from React Bits (Web Audio, no files). Tiny, opt-out, remembered per device.
import { useCallback, useEffect, useState } from "react";
import { playSound, setSoundMuted, setSoundVolume, type Recipe } from "./react-bits-sound";
import pluck from "./pluck";
import chime from "./chime";
import tab from "./tab";
import cork from "./cork";

export const SOUNDS = { add: pluck, done: chime, filter: tab, open: cork } as const;
const KEY = "otrapinta.sound";

let enabled = true;
const listeners = new Set<(v: boolean) => void>();

function read() {
  try {
    return window.localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
}

export function setSoundEnabled(v: boolean) {
  enabled = v;
  setSoundMuted(!v);
  try {
    window.localStorage.setItem(KEY, v ? "on" : "off");
  } catch {
    /* private mode */
  }
  listeners.forEach((l) => l(v));
}

/** Play a UI sound. Always called from a user gesture, so browsers allow it. */
export function play(name: keyof typeof SOUNDS, volume = -10) {
  if (!enabled) return;
  playSound(SOUNDS[name] as Recipe, { volume, variation: 0.15 }).catch(() => undefined);
}

export function useSoundSetting() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const v = read();
    enabled = v;
    setSoundMuted(!v);
    setSoundVolume(0.6);
    setOn(v);
    listeners.add(setOn);
    return () => {
      listeners.delete(setOn);
    };
  }, []);
  const toggle = useCallback(() => setSoundEnabled(!enabled), []);
  return { on, toggle };
}
