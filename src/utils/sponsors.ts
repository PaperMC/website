import type { SponsorData } from "@/types/sponsors";

export async function fetchAllSponsors(): Promise<SponsorData> {
    const response = await fetch("https://raw.githubusercontent.com/PaperMC/papermc.io/data/sponsors.json");
    const data: SponsorData = await response.json();

    return data;
}