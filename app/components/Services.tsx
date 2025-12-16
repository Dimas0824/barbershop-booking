import type { ServiceItem } from "../types/content";

type ServicesProps = {
  services: ServiceItem[];
};

export function Services({ services }: ServicesProps) {
  const items = services?.length ? services : [];

  return (
    <section id="services" className="py-20 bg-brand-black text-white relative">
      <div className="absolute top-0 left-0 w-full h-full hero-pattern opacity-20 pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Daftar Harga</h2>
          <div className="w-20 h-1 bg-brand-red mx-auto" />
          <p className="mt-4 text-gray-300">Pilih paket yang sesuai dengan kebutuhan gaya rambutmu.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((service) => (
            <div
              key={service.name}
              className={`group border rounded-2xl p-8 transition-all cursor-default relative ${
                service.featured
                  ? "bg-linear-to-b from-white/12 to-white/5 border-white/20 hover:border-brand-red"
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-brand-red/50"
              }`}
            >
              {service.featured && (
                <div className="absolute top-0 right-0 bg-brand-red text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  BEST SELLER
                </div>
              )}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-brand-red transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-300 mt-1">{service.desc}</p>
                </div>
                <span className="text-2xl font-bold text-brand-red">{service.price}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {(service.features || []).map((feature) => (
                  <li key={feature} className="flex items-center text-gray-200 text-sm">
                    <i className="fa-solid fa-check text-brand-red mr-3" /> {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
