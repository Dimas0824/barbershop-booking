import { BookingRecord, SiteContent } from "../types/content";

export const CONTENT_KEY = "beneficial-content";
export const BOOKINGS_KEY = "beneficial-bookings";

const getSafeWindow = (): Window | null =>
    typeof window !== "undefined" ? window : null;

const pad = (value: string) => value.padStart(2, "0");

export const normalizeBookingDate = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return trimmed;
    }
    const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (slashMatch) {
        const [, day, month, year] = slashMatch;
        return `${year}-${pad(month)}-${pad(day)}`;
    }
    const compactMatch = trimmed.match(/^(\d{4})(\d{2})(\d{2})$/);
    if (compactMatch) {
        return `${compactMatch[1]}-${compactMatch[2]}-${compactMatch[3]}`;
    }
    return trimmed;
};

const normalizeTime = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    const match = trimmed.match(/^(\d{1,2}):(\d{2})$/);
    if (match) {
        const [, hour, minutes] = match;
        return `${pad(hour)}:${minutes}`;
    }
    return trimmed;
};

export const normalizeBookingTime = (value: string): string => normalizeTime(value);

let bookingsChannel: BroadcastChannel | null = null;
let contentChannel: BroadcastChannel | null = null;

const getBookingsChannel = (): BroadcastChannel | null => {
    if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") return null;
    if (!bookingsChannel) {
        bookingsChannel = new BroadcastChannel("beneficial-bookings");
    }
    return bookingsChannel;
};

const getContentChannel = (): BroadcastChannel | null => {
    if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") return null;
    if (!contentChannel) {
        contentChannel = new BroadcastChannel("beneficial-content");
    }
    return contentChannel;
};

const notifyBookingsUpdated = () => {
    getBookingsChannel()?.postMessage({ type: "bookings:update" });
};

const notifyContentUpdated = () => {
    getContentChannel()?.postMessage({ type: "content:update" });
};

export const onBookingsUpdated = (handler: () => void) => {
    const channel = getBookingsChannel();
    if (!channel) return () => {};
    const listener = (event: MessageEvent) => {
        if (event.data?.type === "bookings:update") {
            handler();
        }
    };
    channel.addEventListener("message", listener);
    return () => channel.removeEventListener("message", listener);
};

export const onContentUpdated = (handler: () => void) => {
    const channel = getContentChannel();
    if (!channel) return () => {};
    const listener = (event: MessageEvent) => {
        if (event.data?.type === "content:update") {
            handler();
        }
    };
    channel.addEventListener("message", listener);
    return () => channel.removeEventListener("message", listener);
};

export const loadContent = (): SiteContent | null => {
    const win = getSafeWindow();
    if (!win) return null;
    try {
        const raw = win.localStorage.getItem(CONTENT_KEY);
        return raw ? (JSON.parse(raw) as SiteContent) : null;
    } catch {
        return null;
    }
};

export const saveContent = (content: SiteContent): void => {
    const win = getSafeWindow();
    if (!win) return;
    try {
        win.localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
        notifyContentUpdated();
    } catch {
        // ignore quota errors
    }
};

export const loadBookings = (): BookingRecord[] => {
    const win = getSafeWindow();
    if (!win) return [];
    try {
        const raw = win.localStorage.getItem(BOOKINGS_KEY);
        const parsed = raw ? (JSON.parse(raw) as BookingRecord[]) : [];
        return parsed.map((booking) => ({
            ...booking,
            date: normalizeBookingDate(booking.date ?? ""),
            time: normalizeBookingTime(booking.time ?? ""),
        }));
    } catch {
        return [];
    }
};

export const saveBookings = (bookings: BookingRecord[]): void => {
    const win = getSafeWindow();
    if (!win) return;
    try {
        const normalized = bookings.map((booking) => ({
            ...booking,
            date: normalizeBookingDate(booking.date ?? ""),
            time: normalizeBookingTime(booking.time ?? ""),
        }));
        win.localStorage.setItem(BOOKINGS_KEY, JSON.stringify(normalized));
        notifyBookingsUpdated();
    } catch {
        // ignore quota errors
    }
};

export const getOccupiedSlots = (bookings: BookingRecord[]): Map<string, Set<string>> => {
    const slots = new Map<string, Set<string>>();
    bookings.forEach((booking) => {
        const normalizedDate = normalizeBookingDate(booking.date || "");
        const normalizedTime = normalizeBookingTime(booking.time || "");
        if (!normalizedDate || !normalizedTime) return;
        if (!slots.has(normalizedDate)) {
            slots.set(normalizedDate, new Set<string>());
        }
        slots.get(normalizedDate)?.add(normalizedTime);
    });
    return slots;
};
