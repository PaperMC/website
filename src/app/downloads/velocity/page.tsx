import type { Metadata } from "next";

import SoftwareDownloadPage from "@/components/layout/SoftwareDownloadPage";

export const metadata: Metadata = {
  title: "Velocity",
  description:
    "Download the latest builds of Velocity, the modern Minecraft proxy server.",
};

export const revalidate = 600; // 10 minutes

export default function VelocityDownloadPage() {
  return (
    <SoftwareDownloadPage
      id="velocity"
      description="Download Velocity, our high-performance Minecraft proxy."
    />
  );
}
