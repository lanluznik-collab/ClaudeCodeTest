"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "sl" | "en";

interface LanguageStore {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      lang: "sl",
      setLang: (lang) => set({ lang }),
    }),
    { name: "slopeps-lang" }
  )
);
