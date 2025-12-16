import type { FooterContent } from "../types/content";

type FooterProps = {
  footer: FooterContent;
};

export function Footer({ footer }: FooterProps) {
  const mapUrl = footer.mapUrl;
  const address = footer.address;
  const instagram = footer.instagram;
  const tiktok = footer.tiktok;

  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
          <div className="md:w-1/3">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-white text-brand-black rounded-full flex items-center justify-center">
                <i className="fa-solid fa-scissors text-sm" />
              </div>
              <span className="font-bold text-lg tracking-tight">BENEFICIAL.ID</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Melayani dengan kualitas premium dan harga yang bersahabat. Kepuasan gaya rambut Anda adalah prioritas kami.
            </p>
            <div className="flex gap-4">
              <a
                href={instagram}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-red transition-colors"
              >
                <i className="fa-brands fa-instagram" />
              </a>
              <a
                href={tiktok}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-red transition-colors"
              >
                <i className="fa-brands fa-tiktok" />
              </a>
            </div>
          </div>

          <div className="md:w-2/3 h-64 bg-gray-800 rounded-xl overflow-hidden relative">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="grayscale hover:grayscale-0 transition-all duration-500"
              referrerPolicy="no-referrer-when-downgrade"
              title="Beneficial Haircut Location"
            />
            <div className="absolute bottom-4 left-4 bg-white text-black p-3 rounded shadow-lg text-xs font-bold">
              {address}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center gap-3">
          <p>&copy; 2025 Beneficial Haircut. All rights reserved.</p>
          <p className="mt-2 md:mt-0 text-gray-400">
            Built by{' '}
            <a
              href="https://github.com/Dimas0824"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-brand-red transition-colors font-semibold"
            >
              Muhammad Irsyad Dimas Abdillah
            </a>
          </p>
          <a href="/admin" className="mt-2 md:mt-0 text-gray-400 hover:text-white transition-colors">
            Admin Login
          </a>
        </div>
      </div>
    </footer>
  );
}