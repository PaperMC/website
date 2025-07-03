import type { Metadata } from "next";

import SponsorsClient from "./sponsors-client";

export const metadata: Metadata = {
  title: "Sponsors",
  description: "Without contributors our projects wouldn't be possible. Find out how you can help.",
  keywords: ["papermc", "paper", "minecraft", "sponsor", "contributing"],
};

export default function SponsorsPage() {
  return <SponsorsClient />;
}
