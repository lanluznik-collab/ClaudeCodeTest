import Link from "next/link";

export function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
      <p className="text-sm uppercase tracking-widest text-gray-400 mb-4">
        New arrivals
      </p>
      <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight leading-tight mb-6">
        Quality you can feel.
      </h1>
      <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10">
        Carefully sourced, rigorously tested. Built for people who care about
        what they put in their body.
      </p>
      <Link
        href="/shop"
        className="inline-block bg-black text-white px-8 py-3.5 text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
      >
        Shop now
      </Link>
    </section>
  );
}
