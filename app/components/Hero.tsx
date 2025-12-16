/* eslint-disable @next/next/no-img-element */
import type { HeroContent } from "../types/content";

type HeroProps = {
  data: HeroContent;
};

export function Hero({ data }: HeroProps) {
  const title = data.title || "Kualitas Barbershop\nPremium.";
  const subtitle =
    data.subtitle ||
    "Tampil lebih percaya diri dengan potongan rambut terbaik. Kami memberikan detail dan gradasi yang presisi untuk gaya rambut Anda.";
  const background =
    data.background || "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop";

  return (
    <section id="home" className="relative pt-20 lg:pt-36 pb-20 lg:pb-28 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-r from-white/95 via-white/90 to-white/70 z-10" />
        <img src={background} alt="Barbershop Background" className="w-full h-full object-cover object-center grayscale opacity-40" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-brand-black leading-tight mb-6 mt-5">
            {title.split("\n").map((line, idx) => (
              <span key={line + idx} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-lg">{subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#booking"
              className="inline-flex justify-center items-center px-8 py-4 bg-brand-black text-white rounded-xl font-bold hover:bg-brand-red transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Reservasi Jadwal
              <i className="fa-solid fa-arrow-right ml-2" />
            </a>
            <a
              href="#services"
              className="inline-flex justify-center items-center px-8 py-4 bg-white text-brand-black border-2 border-brand-black rounded-xl font-bold hover:bg-gray-50 transition-all"
            >
              Lihat Pricelist
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
