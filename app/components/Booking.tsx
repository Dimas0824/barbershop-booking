"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { BookingContent } from "../types/content";
import { normalizeBookingDate, normalizeBookingTime } from "../lib/storage";

type BookingProps = {
  bookingTimes: string[];
  bookingInfo: BookingContent;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  occupiedSlots: Map<string, Set<string>>;
};

export function Booking({ bookingTimes = [], bookingInfo, onSubmit, occupiedSlots }: BookingProps) {
  const phoneOwner = bookingInfo.phoneOwner || "#";
  const openHours = bookingInfo.openHours || "09:00 AM - Menyesuaikan";
  const openNote = bookingInfo.openNote || "*Buka hanya hari Selasa*";

  const formattedPhone = phoneOwner.startsWith("+") ? phoneOwner : `+${phoneOwner}`;
  const [selectedDate, setSelectedDate] = useState("");

  const availableTimes = useMemo(() => {
    if (!selectedDate) return bookingTimes;
    const normalizedDate = normalizeBookingDate(selectedDate);
    if (!normalizedDate) return bookingTimes;
    const blocked = occupiedSlots.get(normalizedDate) ?? new Set<string>();
    return bookingTimes.filter((time) => !blocked.has(normalizeBookingTime(time)));
  }, [bookingTimes, occupiedSlots, selectedDate]);

  return (
    <section id="booking" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-black rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-5/12 p-10 md:p-12 text-white flex flex-col justify-between relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

            <div className="relative z-10 space-y-6">
              <div>
                <h3 className="text-3xl font-bold mb-2">Buat Reservasi</h3>
                <p className="text-gray-300">Jangan antre lama. Booking jadwal potong rambutmu sekarang.</p>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-location-dot text-brand-red" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Lokasi</h4>
                    <p className="text-sm text-gray-300">Jl. Burung Gereja No.9, Arjowinangun, Kota Malang</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-clock text-brand-red" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Jam Buka</h4>
                    <p className="text-sm text-gray-300">{openHours}</p>
                    <p className="text-xs text-gray-400 mt-1" dangerouslySetInnerHTML={{ __html: openNote }} />
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <i className="fa-brands fa-whatsapp text-brand-red" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Kontak</h4>
                    <p className="text-sm text-gray-300">{formattedPhone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-7/12 bg-gray-50 p-10 md:p-12">
            <form className="space-y-5" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2" htmlFor="name">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-brand-black focus:ring-0 outline-none transition-all"
                    placeholder="Nama Anda"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2" htmlFor="phone">
                    No. WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-brand-black focus:ring-0 outline-none transition-all"
                    placeholder="08xxxxx"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2" htmlFor="date">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-brand-black focus:ring-0 outline-none transition-all"
                    onChange={(event) => setSelectedDate(event.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2" htmlFor="time">
                    Jam
                  </label>
                  <select
                    id="time"
                    name="time"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-brand-black focus:ring-0 outline-none transition-all appearance-none"
                  >
                    <option value="">Pilih Jam</option>
                    {selectedDate && availableTimes.length === 0 ? (
                      <option value="" disabled>
                        Semua slot untuk tanggal ini penuh
                      </option>
                    ) : (
                      availableTimes.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))
                    )}
                  </select>
                  {selectedDate && availableTimes.length === 0 && (
                    <p className="text-xs text-red-600 mt-1">Silakan pilih tanggal lain, semua slot sudah terisi.</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Layanan</label>
                <div className="grid grid-cols-2 gap-4">
                  {[{ label: "No Fade (15K)", value: "No Fade" }, { label: "Fade (20K)", value: "Fade" }].map((service) => (
                    <label key={service.value} className="cursor-pointer relative block overflow-hidden">
                      <input type="radio" name="service" value={service.value} defaultChecked={service.value === "No Fade"} className="peer sr-only" />
                      <div className="p-3 border border-gray-200 rounded-lg text-center transition-all peer-checked:border-brand-red peer-checked:text-brand-red">
                        <span className="block text-sm font-bold text-gray-900 peer-checked:text-brand-red">{service.label}</span>
                      </div>
                      <span className="pointer-events-none absolute inset-0 bg-brand-red/0 transition-[background] peer-checked:bg-brand-red/10" aria-hidden="true" />
                      <span className="pointer-events-none absolute inset-0 border border-brand-red/30 rounded-lg opacity-0 transition-opacity peer-checked:opacity-100" aria-hidden="true" />
                      <span className="sr-only peer-checked:not-sr-only absolute -top-1 right-0 rounded-full bg-white px-2 text-[11px] font-semibold text-brand-red border border-brand-red opacity-0 transition-opacity peer-checked:opacity-100">
                        Terpilih
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-brand-red text-white font-bold rounded-lg shadow-lg hover:bg-red-700 transition-colors flex justify-center items-center gap-2"
              >
                Kirim Booking via WhatsApp <i className="fa-brands fa-whatsapp text-lg" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
