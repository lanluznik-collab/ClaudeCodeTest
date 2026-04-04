export function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Store. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-black transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-black transition-colors">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
