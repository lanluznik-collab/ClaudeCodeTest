"use client";

export default function Error({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <p className="text-gray-400 mb-6">Something went wrong.</p>
      <button
        onClick={reset}
        className="inline-block bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
