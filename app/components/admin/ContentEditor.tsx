"use client";

import type { ChangeEvent } from "react";
import { Card } from "./Card";
import { InputField } from "./InputField";
import type { SiteContent } from "../../types/content";

type ContentEditorProps = {
  form: SiteContent;
  onChange: (path: string, value: unknown) => void;
  updateService: (index: number, field: string, value: unknown) => void;
  updateGallery: (index: number, field: string, value: unknown) => void;
  addGalleryItem: () => void;
};

export function ContentEditor({ form, onChange, updateService, updateGallery, addGalleryItem }: ContentEditorProps) {
  const handleFeaturesChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const features = event.target.value
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    updateService(index, "features", features);
  };

  const handleTimesChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const times = event.target.value
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    onChange("booking.times", times);
  };

  const handleGalleryUpload = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateGallery(index, "src", reader.result);
      }
    };
    reader.readAsDataURL(file);
    event.currentTarget.value = "";
  };

  return (
    <div className="space-y-6">
      <Card title="Hero Section" description="Banner utama website">
        <div className="grid md:grid-cols-2 gap-6">
          <InputField
            label="Judul"
            textarea
            rows={3}
            value={form.hero?.title || ""}
            onChange={(event) => onChange("hero.title", (event.target as HTMLTextAreaElement).value)}
            placeholder="Masukkan judul hero"
          />
          <InputField
            label="Subjudul"
            textarea
            rows={3}
            value={form.hero?.subtitle || ""}
            onChange={(event) => onChange("hero.subtitle", (event.target as HTMLTextAreaElement).value)}
            placeholder="Masukkan subjudul hero"
          />
          <div className="md:col-span-2">
            <InputField
              label="URL Background Image"
              value={form.hero?.background || ""}
              onChange={(event) => onChange("hero.background", (event.target as HTMLInputElement).value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      </Card>

      <Card title="Layanan (Services)" description="Daftar layanan yang ditawarkan">
        <div className="grid md:grid-cols-2 gap-6">
          {(form.services || []).map((service, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-5 space-y-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Layanan #{index + 1}</span>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!service.featured}
                    onChange={(event) => updateService(index, "featured", event.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-gray-600">Featured</span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  value={service.name || ""}
                  onChange={(event) => updateService(index, "name", event.target.value)}
                  placeholder="Nama layanan"
                />
                <input
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  value={service.price || ""}
                  onChange={(event) => updateService(index, "price", event.target.value)}
                  placeholder="Harga"
                />
              </div>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                rows={2}
                value={service.desc || ""}
                onChange={(event) => updateService(index, "desc", event.target.value)}
                placeholder="Deskripsi layanan"
              />
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                value={(service.features || []).join(", ")}
                onChange={(event) => handleFeaturesChange(index, event)}
                placeholder="Fitur (pisahkan dengan koma)"
              />
            </div>
          ))}
        </div>
      </Card>

      <Card
        title="Galeri Foto"
        description="Koleksi foto karya"
        action={
          <button
            onClick={addGalleryItem}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-red-600 transition-colors"
            type="button"
          >
            + Tambah Foto
          </button>
        }
      >
        <div className="grid md:grid-cols-3 gap-4">
          {(form.gallery || []).map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
              <div className="text-xs font-semibold text-gray-500 mb-2">Foto #{index + 1}</div>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                value={item.title || ""}
                onChange={(event) => updateGallery(index, "title", event.target.value)}
                placeholder="Judul foto"
              />
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                value={item.src || ""}
                onChange={(event) => updateGallery(index, "src", event.target.value)}
                placeholder="URL gambar atau tempel link Instagram"
              />
              <label className="text-[11px] font-semibold text-gray-500">Atau unggah foto dari perangkat Anda</label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleGalleryUpload(index, event)}
                className="w-full rounded-lg text-xs text-gray-600"
              />
              {item.src && (
                <div className="mt-2 space-y-1">
                  <p className="text-[11px] text-gray-500">Pratinjau saat ini</p>
                  <div className="h-32 overflow-hidden rounded-xl border border-dashed border-gray-300">
                    <img src={item.src} alt={item.title || `Gallery ${index + 1}`} className="h-full w-full object-cover" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card title="Informasi Booking" description="Pengaturan untuk sistem booking">
        <div className="grid md:grid-cols-2 gap-6">
          <InputField
            label="Nomor WhatsApp Pemilik"
            value={form.booking?.phoneOwner || ""}
            onChange={(event) => onChange("booking.phoneOwner", (event.target as HTMLInputElement).value)}
            placeholder="08xx xxxx xxxx"
          />
          <InputField
            label="Jam Operasional"
            value={form.booking?.openHours || ""}
            onChange={(event) => onChange("booking.openHours", (event.target as HTMLInputElement).value)}
            placeholder="09:00 - 21:00"
          />
          <InputField
            label="Catatan Jam Buka"
            value={form.booking?.openNote || ""}
            onChange={(event) => onChange("booking.openNote", (event.target as HTMLInputElement).value)}
            placeholder="Buka setiap hari"
          />
          <InputField
            label="Jam Tersedia (pisahkan dengan koma)"
            value={(form.booking?.times || []).join(", ")}
            onChange={handleTimesChange}
            placeholder="09:00, 10:00, 11:00, ..."
          />
        </div>
      </Card>

      <Card title="Footer & Peta Lokasi" description="Informasi kontak dan lokasi">
        <div className="grid md:grid-cols-2 gap-6">
          <InputField
            label="Alamat Lengkap"
            value={form.footer?.address || ""}
            onChange={(event) => onChange("footer.address", (event.target as HTMLInputElement).value)}
            placeholder="Jl. Contoh No. 123, Kota"
          />
          <InputField
            label="Google Maps URL"
            value={form.footer?.mapUrl || ""}
            onChange={(event) => onChange("footer.mapUrl", (event.target as HTMLInputElement).value)}
            placeholder="https://maps.google.com/..."
          />
          <InputField
            label="Link Instagram"
            value={form.footer?.instagram || ""}
            onChange={(event) => onChange("footer.instagram", (event.target as HTMLInputElement).value)}
            placeholder="https://instagram.com/..."
          />
          <InputField
            label="Link TikTok"
            value={form.footer?.tiktok || ""}
            onChange={(event) => onChange("footer.tiktok", (event.target as HTMLInputElement).value)}
            placeholder="https://tiktok.com/@..."
          />
        </div>
      </Card>
    </div>
  );
}
