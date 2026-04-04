import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white min-h-[540px] flex items-center">

      {/* Dark left panel with diagonal cut and geometric pattern */}
      <div
        className="absolute inset-0 bg-[#111111] hero-pattern"
        style={{ clipPath: "polygon(0 0, 62% 0, 50% 100%, 0 100%)" }}
      />

      {/* Content */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center min-h-[540px] py-16">

        {/* Left — text */}
        <div className="w-full md:w-1/2 pr-0 md:pr-16 z-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold mb-4">
            Premium Quality
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase leading-none text-white mb-6 tracking-tight">
            Quality<br />
            <span className="text-gold">You Can</span><br />
            Feel.
          </h1>
          <p className="text-gray-300 text-base max-w-sm mb-10 leading-relaxed">
            Carefully sourced, rigorously tested. Built for people who care about what they put in their body.
          </p>
          <Link
            href="/shop"
            className="inline-block border-2 border-green-500 text-green-400 px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all duration-200"
          >
            Shop Now
          </Link>
        </div>

        {/* Right — image placeholder */}
        <div className="w-full md:w-1/2 flex justify-center mt-12 md:mt-0">
          <div className="w-72 h-72 sm:w-96 sm:h-96 bg-gray-100 flex items-center justify-center">
            <p className="text-xs uppercase tracking-widest text-gray-400">Product Image</p>
          </div>
        </div>

      </div>
    </section>
  );
}
