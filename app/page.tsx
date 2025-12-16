"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Booking } from "./components/Booking";
import { Footer } from "./components/Footer";
import { Gallery } from "./components/Gallery";
import { Hero } from "./components/Hero";
import { NavBar } from "./components/NavBar";
import { Services } from "./components/Services";
import { mergeContent } from "./lib/mergeContent";
import { defaultContent } from "./lib/defaultContent";
import { loadBookings, loadContent, saveBookings, getOccupiedSlots, BOOKINGS_KEY, normalizeBookingDate, normalizeBookingTime, onBookingsUpdated } from "./lib/storage";
import type { BookingPayload, BookingRecord, SiteContent } from "./types/content";

const randomId = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}`);

const copyMessageToClipboard = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};

const buildWhatsAppText = (payload: BookingPayload) => {
  return (
    `Halo Beneficial Haircut, saya ingin booking jadwal:\n\n` +
    `Nama: *${payload.name}*\n` +
    `No. WhatsApp: *${payload.phone}*\n` +
    `Tanggal: *${payload.date}*\n` +
    `Jam: *${payload.time}*\n` +
    `Layanan: *${payload.service}*\n\n` +
    `Apakah slot tersedia?`
  );
};

export default function HomePage() {
  const [content] = useState<SiteContent>(() => {
    const stored = loadContent();
    return stored ? mergeContent(stored) : mergeContent(defaultContent);
  });
  const [bookings, setBookings] = useState<BookingRecord[]>(() => loadBookings());
  const [menuOpen, setMenuOpen] = useState(false);
  const [navShadow, setNavShadow] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavShadow(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const rawDate = (data.get("date") as string) || "";
    const rawTime = (data.get("time") as string) || "";
    const payload: BookingPayload = {
      name: (data.get("name") as string) || "",
      phone: (data.get("phone") as string) || "",
      date: normalizeBookingDate(rawDate),
      time: normalizeBookingTime(rawTime),
      service: (data.get("service") as string) || "",
    };

    const whatsappText = buildWhatsAppText(payload);
    const phoneOwner = content.booking.phoneOwner;

    const newBooking: BookingRecord = { id: randomId(), ...payload };
    setBookings((prev) => {
      const next = [newBooking, ...prev];
      saveBookings(next);
      return next;
    });

    copyMessageToClipboard(whatsappText).catch(() => {
      /* best effort */
    });

    const whatsappUrl = `https://wa.me/${phoneOwner}?text=${encodeURIComponent(whatsappText)}`;
    const opened = window.open(whatsappUrl, "_blank", "noopener");
    if (!opened) {
      window.location.href = whatsappUrl;
    }

    event.currentTarget.reset();
  };

  const occupiedSlots = useMemo(() => getOccupiedSlots(bookings), [bookings]);

  // Sync with bookings added or removed from another tab.
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === BOOKINGS_KEY) {
        setBookings(loadBookings());
      }
    };
    const unsubscribe = onBookingsUpdated(() => {
      setBookings(loadBookings());
    });
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      unsubscribe();
    };
  }, []);

  return (
    <div className="font-sans text-brand-black antialiased bg-white selection:bg-brand-red selection:text-white scroll-smooth">
      <NavBar navShadow={navShadow} menuOpen={menuOpen} onToggleMenu={() => setMenuOpen(!menuOpen)} onClose={() => setMenuOpen(false)} />
      <Hero data={content.hero} />
      <Services services={content.services} />
      <Gallery items={content.gallery} />
      <Booking bookingTimes={content.booking.times} bookingInfo={content.booking} onSubmit={handleBooking} occupiedSlots={occupiedSlots} />
      <Footer footer={content.footer} />
    </div>
  );
}
