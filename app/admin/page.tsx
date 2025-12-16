"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BookingManager } from "../components/admin/BookingManager";
import { ContentEditor } from "../components/admin/ContentEditor";
import { mergeContent } from "../lib/mergeContent";
import { defaultContent } from "../lib/defaultContent";
import { loadBookings, loadContent, saveBookings, saveContent } from "../lib/storage";
import type { BookingRecord, SiteContent } from "../types/content";

type TabKey = "bookings" | "content";

const cloneContent = (value: SiteContent): SiteContent => {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as SiteContent;
};

const randomId = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}`);

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("bookings");
  const [form, setForm] = useState<SiteContent>(() => {
    const stored = loadContent();
    return stored ? mergeContent(stored) : mergeContent(defaultContent);
  });
  const [bookings, setBookings] = useState<BookingRecord[]>(() => loadBookings());
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const setMessageWithTimeout = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 2500);
  };

  const onChange = (path: string, value: unknown) => {
    setForm((prev) => {
      const next = cloneContent(prev);
      const keys = path.split(".");
      let ref: Record<string, unknown> = next as unknown as Record<string, unknown>;
      for (let i = 0; i < keys.length - 1; i += 1) {
        const key = keys[i];
        if (!ref[key]) ref[key] = {};
        ref = ref[key] as Record<string, unknown>;
      }
      ref[keys[keys.length - 1]] = value as never;
      return next;
    });
  };

  const updateService = (index: number, field: string, value: unknown) => {
    setForm((prev) => {
      const next = cloneContent(prev);
      const services = [...next.services];
      services[index] = { ...(services[index] || {}), [field]: value } as SiteContent["services"][number];
      next.services = services;
      return next;
    });
  };

  const updateGallery = (index: number, field: string, value: unknown) => {
    setForm((prev) => {
      const next = cloneContent(prev);
      const gallery = [...next.gallery];
      gallery[index] = { ...(gallery[index] || {}), [field]: value } as SiteContent["gallery"][number];
      next.gallery = gallery;
      return next;
    });
  };

  const addGalleryItem = () => {
    setForm((prev) => {
      const next = cloneContent(prev);
      next.gallery = next.gallery ? [...next.gallery] : [];
      next.gallery.push({ title: "NEW", src: "" });
      return next;
    });
  };

  const saveContentLocal = () => {
    setSaving(true);
    saveContent(form);
    setSaving(false);
    setMessageWithTimeout("Konten tersimpan");
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  const addBooking = (payload: Omit<BookingRecord, "id">) => {
    setBookings((prev) => {
      const next = [{ id: randomId(), ...payload }, ...prev];
      saveBookings(next);
      return next;
    });
    setMessageWithTimeout("Booking ditambahkan");
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => {
      const next = prev.filter((booking) => booking.id !== id);
      saveBookings(next);
      return next;
    });
    setMessageWithTimeout("Booking dihapus");
  };

  const bookingCount = useMemo(() => bookings.length, [bookings]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Kelola konten website dan booking</p>
            </div>
            <div className="flex items-center gap-2">
              {activeTab === "content" && (
                <button
                  onClick={saveContentLocal}
                  disabled={saving}
                  className="px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                type="button"
              >
                Keluar
              </button>
            </div>
          </div>

          <div className="flex gap-1 -mb-px">
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "bookings"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Manajemen Booking
              {bookingCount > 0 && <span className="ml-2 px-2 py-0.5 bg-gray-900 text-white text-xs rounded-full">{bookingCount}</span>}
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "content"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Manajemen Konten
            </button>
          </div>
        </div>
      </header>

      {message && (
        <div className="fixed top-24 right-4 z-50 animate-fade-in">
          <div
            className={`px-6 py-3 rounded-lg shadow-lg ${
              message.includes("Gagal")
                ? "bg-red-100 text-red-800 border border-red-200"
                : "bg-green-100 text-green-800 border border-green-200"
            }`}
          >
            {message}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "bookings" ? (
          <BookingManager bookings={bookings} onAdd={addBooking} onDelete={deleteBooking} />
        ) : (
          <ContentEditor
            form={form}
            onChange={onChange}
            updateService={updateService}
            updateGallery={updateGallery}
            addGalleryItem={addGalleryItem}
          />
        )}
      </main>
    </div>
  );
}
