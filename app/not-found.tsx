import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <p className="text-5xl font-semibold mb-4">404</p>
      <p className="text-gray-400 mb-8">This page doesn't exist.</p>
      <Link
        href="/"
        className="inline-block bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        Go home
      </Link>
    </div>
  );
}
