"use client";

import { create } from "zustand";

type ToastType = "success" | "danger" | "info";

type ToastState = {
  visible: boolean;
  message: string;
  type: ToastType;
  show: (message: string, type?: ToastType) => void;
  hide: () => void;
};

let timer: ReturnType<typeof setTimeout> | null = null;

export const useToast = create<ToastState>()((set) => ({
  visible: false,
  message: "",
  type: "success",

  show: (message, type = "success") => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    set({ visible: true, message, type });
    timer = setTimeout(() => {
      set({ visible: false });
      timer = null;
    }, 3000);
  },

  hide: () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    set({ visible: false });
  },
}));
