export function Footer() {
  return (
    <footer className="bg-[#111111] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-white font-black tracking-widest uppercase text-sm">Store</p>
        <p className="text-gray-500 text-xs">&copy; {new Date().getFullYear()} Store. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="text-gray-400 text-xs uppercase tracking-widest hover:text-white transition-colors">
            Privacy
          </a>
          <a href="#" className="text-gray-400 text-xs uppercase tracking-widest hover:text-white transition-colors">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
