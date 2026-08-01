import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <p className="text-5xl font-semibold mb-4" style={{ color: "var(--color-text)" }}>404</p>
      <p className="mb-8" style={{ color: "var(--color-text-muted)" }}>This page doesn't exist.</p>
      <Link
        href="/"
        className="inline-block px-8 py-3 rounded-full text-sm font-medium transition-colors"
        style={{ backgroundColor: "var(--color-accent)", color: "var(--color-on-accent)" }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent-hover)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent)")}
      >
        Go home
      </Link>
    </div>
  );
}
