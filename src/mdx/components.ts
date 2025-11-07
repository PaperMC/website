// @ts-nocheck // fix this properly later maybe :D
import Contributors from "@/components/news/Contributors.astro";
import DownloadButton from "@/components/news/DownloadButton.astro";
import MandatoryBackups from "@/components/news/MandatoryBackups.astro";

export const components = {
  Contributors,
  DownloadButton,
  MandatoryBackups,
} as const;
