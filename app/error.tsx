"use client";

export default function Error({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <p className="mb-6" style={{ color: "var(--color-text-muted)" }}>Something went wrong.</p>
      <button
        onClick={reset}
        className="inline-block px-8 py-3 rounded-full text-sm font-medium transition-colors"
        style={{ backgroundColor: "var(--color-accent)", color: "var(--color-on-accent)" }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent-hover)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent)")}
      >
        Try again
      </button>
    </div>
  );
}
