import { useState, type FormEvent } from "react";
import type { BookingRecord } from "../../types/content";
import { Card } from "./Card";
import { InputField } from "./InputField";
import { normalizeBookingDate, normalizeBookingTime } from "../../lib/storage";

type BookingManagerProps = {
  bookings: BookingRecord[];
  onAdd: (payload: Omit<BookingRecord, "id">) => void;
  onDelete: (id: string) => void;
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const extractField = (text: string, label: string) => {
  const regex = new RegExp(`${escapeRegExp(label)}\\s*:\\s*(?:\\*([^*]+)\\*|([^\\n]+))`, "i");
  const match = regex.exec(text);
  const value = match?.[1] ?? match?.[2];
  return value ? value.trim() : null;
};

const parseWhatsAppBooking = (text: string): Omit<BookingRecord, "id"> | null => {
  if (!text) return null;
  const normalized = text.replace(/\r/g, "");
  const name = extractField(normalized, "Nama");
  const phone = extractField(normalized, "No. WhatsApp");
  const date = extractField(normalized, "Tanggal");
  const time = extractField(normalized, "Jam");
  const service = extractField(normalized, "Layanan");
  if (!name || !phone || !date || !time || !service) return null;
    const normalizedDate = normalizeBookingDate(date);
    const normalizedTime = normalizeBookingTime(time);
    if (!normalizedDate || !normalizedTime) return null;
    return { name, phone, date: normalizedDate, time: normalizedTime, service };
};

function AddBookingForm({ onSubmit }: { onSubmit: BookingManagerProps["onAdd"] }) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSubmit({
      name: (form.get("name") as string) || "",
      phone: (form.get("phone") as string) || "",
      date: (form.get("date") as string) || "",
      time: (form.get("time") as string) || "",
      service: (form.get("service") as string) || "",
    });
    event.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <InputField label="Nama Pelanggan" name="name" placeholder="Masukkan nama" required />
        <InputField label="Nomor WhatsApp" name="phone" placeholder="08xx xxxx xxxx" required />
        <InputField label="Tanggal" type="date" name="date" required />
        <InputField label="Jam" name="time" placeholder="09:00" required />
        <InputField label="Layanan" name="service" placeholder="Nama layanan" required />
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            + Tambah Booking
          </button>
        </div>
      </div>
    </form>
  );
}

export function BookingManager({ bookings, onAdd, onDelete }: BookingManagerProps) {
  const [whatsappText, setWhatsappText] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const slotAlreadyBooked = (payload: Omit<BookingRecord, "id">) => {
    const targetDate = normalizeBookingDate(payload.date);
    const targetTime = normalizeBookingTime(payload.time);
    if (!targetDate || !targetTime) return false;
    return bookings.some((booking) => {
      const bookingDate = normalizeBookingDate(booking.date);
      const bookingTime = normalizeBookingTime(booking.time);
      return bookingDate === targetDate && bookingTime === targetTime;
    });
  };

  const handleAddBooking = (payload: Omit<BookingRecord, "id">, source: "manual" | "whatsapp") => {
    const normalizedPayload = {
      ...payload,
      date: normalizeBookingDate(payload.date),
      time: normalizeBookingTime(payload.time),
    };
    if (slotAlreadyBooked(normalizedPayload)) {
      setFeedback({ type: "error", message: "Slot ini sudah terbooking." });
      return false;
    }
    onAdd(normalizedPayload);
    setFeedback({
      type: "success",
      message: source === "whatsapp" ? "Booking berhasil ditambahkan dari WhatsApp." : "Booking berhasil ditambahkan.",
    });
    return true;
  };

  const handleWhatsAppImport = () => {
    setFeedback(null);
    const parsed = parseWhatsAppBooking(whatsappText);
    if (!parsed) {
      setFeedback({ type: "error", message: "Tidak dapat memproses teks. Teks harus mengikuti format WhatsApp yang dikirimkan pelanggan." });
      return;
    }
    const added = handleAddBooking(parsed, "whatsapp");
    if (added) {
      setWhatsappText("");
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Tambah Booking Baru" description="Input data booking pelanggan">
        <AddBookingForm onSubmit={(payload) => handleAddBooking(payload, "manual")} />
      </Card>

      <Card title="Impor Booking dari WhatsApp" description="Tempelkan pesan booking otomatis yang masuk melalui WhatsApp.">
        <div className="space-y-3">
          <textarea
            rows={4}
            value={whatsappText}
            onChange={(event) => setWhatsappText(event.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400"
            placeholder="Salin pesan WhatsApp seperti: Halo Beneficial Haircut..."
          />
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleWhatsAppImport}
              className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Impor dari WhatsApp
            </button>
            <button
              type="button"
              onClick={() => {
                setWhatsappText("");
                setFeedback(null);
              }}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-colors font-medium"
            >
              Bersihkan
            </button>
          </div>
          {feedback && (
            <p className={`text-sm font-medium ${feedback.type === "success" ? "text-green-700" : "text-red-700"}`}>
              {feedback.message}
            </p>
          )}
        </div>
      </Card>

      <Card title="Daftar Booking" description={`Total ${bookings.length} booking terdaftar`}>
        {!bookings.length ? (
          <div className="py-12 text-center text-gray-500">
            <div className="flex flex-col items-center">
              <svg
                className="w-12 h-12 text-gray-300 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-sm font-medium">Belum ada booking tersimpan</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base mb-2 truncate">
                      {booking.name}
                    </h3>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="w-4 h-4 flex-shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">{booking.date}</span>
                        <span className="text-gray-400">•</span>
                        <span className="font-medium">{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="w-4 h-4 flex-shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="truncate font-medium">{booking.service}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="w-4 h-4 flex-shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="truncate font-medium">{booking.phone}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onDelete(booking.id)}
                    className="flex-shrink-0 text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors p-2 rounded-lg"
                    type="button"
                    aria-label="Hapus booking"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}