"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function CategoryFilter({ categories }: { categories: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("category") ?? "";

  function setCategory(cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat) {
      params.set("category", cat);
    } else {
      params.delete("category");
    }
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setCategory("")}
        className={cn(
          "px-4 py-1.5 rounded-full text-sm border transition-colors",
          current === ""
            ? "bg-[var(--color-brand)] text-white border-[var(--color-brand)]"
            : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text-faint)]"
        )}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setCategory(cat)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm border transition-colors capitalize",
            current === cat
              ? "bg-[var(--color-brand)] text-white border-[var(--color-brand)]"
              : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text-faint)]"
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
