"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PromoRule {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrder: number | null;
}

interface PromoStore {
  promo: PromoRule | null;
  setPromo: (rule: PromoRule) => void;
  clearPromo: () => void;
}

// Persists only the validated rule (code/type/value/minOrder), never a
// computed discount amount — the actual amount is always derived live from
// the current subtotal (see lib/pricing.ts) and re-checked server-side at
// order submission, so a stale cached total can never be trusted.
export const usePromoStore = create<PromoStore>()(
  persist(
    (set) => ({
      promo: null,
      setPromo: (rule) => set({ promo: rule }),
      clearPromo: () => set({ promo: null }),
    }),
    { name: "promo" }
  )
);
