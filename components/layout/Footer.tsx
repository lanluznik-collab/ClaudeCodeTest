export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col sm:flex-row justify-between items-center gap-6">
        <p className="text-white font-black tracking-[0.2em] uppercase text-sm">STORE</p>
        <p className="text-gray-600 text-xs uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Store. All rights reserved.
        </p>
        <div className="flex gap-8">
          <a href="#" className="text-gray-500 text-[11px] uppercase tracking-widest font-medium hover:text-white transition-colors">
            Privacy
          </a>
          <a href="#" className="text-gray-500 text-[11px] uppercase tracking-widest font-medium hover:text-white transition-colors">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
