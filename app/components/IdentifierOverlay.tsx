"use client";

import { useEffect, useState } from "react";

export function IdentifierOverlay() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.querySelector("footer");
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isFooterInView = entries.some((entry) => entry.isIntersecting);
        setHidden(isFooterInView);
      },
      { rootMargin: "0px", threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href="https://github.com/Dimas0824"
      target="_blank"
      rel="noopener noreferrer"
      className={`pointer-events-auto fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full border border-brand-red bg-white/95 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-brand-red shadow-lg transition duration-200 hover:bg-brand-red hover:text-white ${hidden ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <span className="text-[10px] leading-none">Built by</span>
      <span className="text-sm">Muhammad Irsyad Dimas Abdillah</span>
      <i className="fa-brands fa-github text-base" aria-hidden="true" />
    </a>
  );
}
