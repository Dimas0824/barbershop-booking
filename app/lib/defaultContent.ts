import { SiteContent } from "../types/content";

export const defaultContent: SiteContent = {
    hero: {
        title: "Kualitas Barbershop\nPremium.",
        subtitle:
            "Tampil lebih percaya diri dengan potongan rambut terbaik. Kami memberikan detail dan gradasi yang presisi untuk gaya rambut Anda.",
        background:
            "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop",
    },
    services: [
        {
            name: "NO FADE",
            price: "15K",
            desc: "Potongan samping tipis dengan gradasi setengah",
            features: ["Haircut Rapih", "Styling Pomade", "Konsultasi Gaya"],
            featured: false,
        },
        {
            name: "FADE",
            price: "20K",
            desc: "Gradasi halus dari pendek nol ke panjang",
            features: ["Detail Gradasi Premium", "Haircut Presisi", "Styling & Finishing"],
            featured: true,
        },
    ],
    gallery: [
        {
            title: "MID FADE",
            src: "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg?auto=compress&w=600&h=600&fit=crop",
        },
        {
            title: "LOW FADE",
            src: "https://images.pexels.com/photos/3992878/pexels-photo-3992878.jpeg?auto=compress&w=600&h=600&fit=crop",
        },
        {
            title: "TAPER FADE",
            src: "https://images.pexels.com/photos/1707830/pexels-photo-1707830.jpeg?auto=compress&w=600&h=600&fit=crop",
        },
        {
            title: "SKIN FADE",
            src: "https://images.pexels.com/photos/3992881/pexels-photo-3992881.jpeg?auto=compress&w=600&h=600&fit=crop",
        },
        {
            title: "HIGH FADE",
            src: "https://images.pexels.com/photos/3992875/pexels-photo-3992875.jpeg?auto=compress&w=600&h=600&fit=crop",
        },
        {
            title: "BUZZ CUT",
            src: "https://images.pexels.com/photos/3992879/pexels-photo-3992879.jpeg?auto=compress&w=600&h=600&fit=crop",
        },
    ],
    footer: {
        mapUrl:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.887240767232!2d112.6395!3d-8.0105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwMDAnMzcuOCJTIDExMsKwMzgnMjIuMiJF!5e0!3m2!1sen!2sid!4v1634567890123!5m2!1sen!2sid",
        address: "Jl. Burung Gereja No.9, Arjowinangun",
        instagram: "https://instagram.com/_beneficial.id",
        tiktok: "#",
    },
    booking: {
        phoneOwner: "#",
        openHours: "09:00 AM - Menyesuaikan",
        openNote: "*Buka hanya hari Selasa*",
        times: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "19:00", "20:00"],
    },
};
