export type HeroContent = {
    title: string;
    subtitle: string;
    background: string;
};

export type ServiceItem = {
    name: string;
    price: string;
    desc: string;
    features: string[];
    featured?: boolean;
};

export type GalleryItem = {
    title: string;
    src: string;
};

export type FooterContent = {
    mapUrl: string;
    address: string;
    instagram: string;
    tiktok: string;
};

export type BookingContent = {
    phoneOwner: string;
    openHours: string;
    openNote: string;
    times: string[];
};

export type SiteContent = {
    hero: HeroContent;
    services: ServiceItem[];
    gallery: GalleryItem[];
    footer: FooterContent;
    booking: BookingContent;
};

export type BookingPayload = {
    name: string;
    phone: string;
    date: string;
    time: string;
    service: string;
};

export type BookingRecord = BookingPayload & {
    id: string;
};
