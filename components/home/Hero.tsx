import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden hero-bg">

      {/* Gold glow overlay */}
      <div className="absolute inset-0 hero-glow pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center min-h-[620px] py-20 gap-12">

        {/* LEFT — text */}
        <div className="flex-1 flex flex-col items-start">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-[#C9A84C] border border-[#C9A84C]/40 px-3 py-1 mb-8">
            Premium Quality
          </span>

          <h1 className="text-5xl sm:text-6xl lg:text-[76px] font-black uppercase leading-[1.0] tracking-tight text-[#C9A84C] mb-6">
            Quality<br />
            <span className="text-white">You Can</span><br />
            Feel.
          </h1>

          <p className="text-gray-400 text-base max-w-md mb-10 leading-relaxed font-light">
            Carefully sourced, rigorously tested. Built for people who care about what they put in their body.
          </p>

          <Link
            href="/shop"
            className="inline-flex items-center gap-3 border-2 border-green-500 text-green-400 px-9 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-green-500 hover:text-black transition-all duration-200"
          >
            Shop Now
            <span className="text-base leading-none">→</span>
          </Link>
        </div>

        {/* RIGHT — product image */}
        <div className="flex-1 flex justify-center md:justify-end">
          <div className="relative w-80 h-80 sm:w-[420px] sm:h-[420px]">
            {/* Decorative gold ring */}
            <div className="absolute inset-4 rounded-full border border-[#C9A84C]/20" />
            <div className="absolute inset-8 rounded-full border border-[#C9A84C]/10" />
            {/* Image placeholder */}
            <div className="absolute inset-0 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
              <p className="text-[10px] uppercase tracking-widest text-white/30">Product Image</p>
            </div>
          </div>
        </div>

      </div>

      {/* Diagonal bottom cut — white shape that creates the split */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 bg-white"
        style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
      />

    </section>
  );
}
