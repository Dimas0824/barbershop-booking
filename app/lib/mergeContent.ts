import { defaultContent } from "./defaultContent";
import { SiteContent } from "../types/content";

export const mergeContent = (content?: Partial<SiteContent>): SiteContent => {
    const mergedServices = content?.services?.length ? content.services : defaultContent.services;
    const mergedGallery = content?.gallery?.length ? content.gallery : defaultContent.gallery;

    return {
        ...defaultContent,
        ...content,
        hero: { ...defaultContent.hero, ...(content?.hero || {}) },
        footer: { ...defaultContent.footer, ...(content?.footer || {}) },
        booking: { ...defaultContent.booking, ...(content?.booking || {}) },
        services: mergedServices,
        gallery: mergedGallery,
    } as SiteContent;
};
