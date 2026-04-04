"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <nav className="flex items-center gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm transition-colors",
                pathname === href
                  ? "bg-gray-100 font-medium"
                  : "text-gray-500 hover:text-black"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="text-xs text-gray-400 hover:text-black transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
