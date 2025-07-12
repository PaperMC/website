import type { Metadata } from "next";

import SoftwareDownloadPage from "@/components/layout/SoftwareDownloadPage";

export const metadata: Metadata = {
  title: "Paper",
  description: "Download the latest builds of Paper, the high-performance Minecraft server software.",
};

export const revalidate = 600; // 10 minutes

export default function PaperDownloadPage() {
  return (
    <SoftwareDownloadPage
      id="paper"
      description="Download Paper, our Minecraft server software offering unrivaled performance and stability."
      experimentalWarning="Download experimental builds of Paper, our Minecraft server software offering unrivaled performance and stability. Proceed with caution!"
    />
  );
}
