type NavBarProps = {
  navShadow: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onClose: () => void;
};

export function NavBar({ navShadow, menuOpen, onToggleMenu, onClose }: NavBarProps) {
  return (
    <nav className={`fixed w-full z-50 glass-nav transition-all duration-300 ${navShadow ? "shadow-sm" : ""}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="shrink-0 flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-black text-white rounded-full flex items-center justify-center">
              <i className="fa-solid fa-scissors" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight block leading-none">BENEFICIAL</span>
              <span className="text-xs text-gray-500 font-medium tracking-widest">HAIRCUT</span>
            </div>
          </div>

          <div className="hidden md:flex space-x-8 items-center">
            <a href="#home" className="text-sm font-semibold hover:text-brand-red transition-colors">
              BERANDA
            </a>
            <a href="#services" className="text-sm font-semibold hover:text-brand-red transition-colors">
              HARGA
            </a>
            <a href="#gallery" className="text-sm font-semibold hover:text-brand-red transition-colors">
              GALERI
            </a>
            <a
              href="#booking"
              className="bg-brand-black text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-red transition-colors shadow-lg transform hover:-translate-y-0.5"
            >
              BOOKING SEKARANG
            </a>
          </div>

          <div className="md:hidden flex items-center">
            <button type="button" onClick={onToggleMenu} className="text-brand-black focus:outline-none p-2">
              <i className="fa-solid fa-bars text-2xl" />
            </button>
          </div>
        </div>
      </div>

      <div className={`${menuOpen ? "block" : "hidden"} md:hidden bg-white border-t border-gray-100 absolute w-full`}>
        <div className="px-4 pt-2 pb-6 space-y-2 shadow-lg">
          <a href="#home" onClick={onClose} className="block px-3 py-3 text-base font-semibold hover:bg-gray-50 rounded-md">
            Beranda
          </a>
          <a href="#services" onClick={onClose} className="block px-3 py-3 text-base font-semibold hover:bg-gray-50 rounded-md">
            Daftar Harga
          </a>
          <a href="#gallery" onClick={onClose} className="block px-3 py-3 text-base font-semibold hover:bg-gray-50 rounded-md">
            Galeri Cukur
          </a>
          <a
            href="#booking"
            onClick={onClose}
            className="block px-3 py-3 text-base font-semibold text-brand-red bg-red-50 rounded-md"
          >
            Booking Sekarang
          </a>
        </div>
      </div>
    </nav>
  );
}
