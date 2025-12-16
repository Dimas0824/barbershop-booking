/* eslint-disable @next/next/no-img-element */
import type { GalleryItem } from "../types/content";

type GalleryProps = {
  items: GalleryItem[];
};

export function Gallery({ items }: GalleryProps) {
  const galleryItems = items.length ? items : [];

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-black mb-2">Hasil Cukur</h2>
            <p className="text-gray-700">Gaya rambut terbaru dari Beneficial.</p>
          </div>
          <a
            href="https://instagram.com/_beneficial.id"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-bold text-brand-black hover:text-brand-red flex items-center gap-2"
          >
            Lihat Instagram <i className="fa-brands fa-instagram" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryItems.map((item) => (
            <div
              key={item.title}
              className="group relative aspect-square overflow-hidden rounded-xl bg-gray-200 transform transition-transform duration-700 ease-out group-hover:scale-110"
            >
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-120"
              />
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-bold tracking-wider">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
