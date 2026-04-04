import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <p className="text-4xl mb-6">×</p>
      <h1 className="text-2xl font-semibold mb-3">Payment cancelled</h1>
      <p className="text-gray-400 mb-8">
        No charge was made. Your cart is still saved.
      </p>
      <Link
        href="/cart"
        className="inline-block bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        Return to Cart
      </Link>
    </div>
  );
}
