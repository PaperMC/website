import type { Metadata } from "next";

import SoftwareDownloadPage from "@/components/layout/SoftwareDownloadPage";

export const metadata: Metadata = {
  title: "Folia",
  description:
    "Download the latest builds of Folia, the experimental Paper fork with regionised multithreading.",
};

export const revalidate = 600; // 10 minutes

export default function FoliaDownloadPage() {
  return (
    <SoftwareDownloadPage
      id="folia"
      description="Download Folia, our new fork of Paper that adds regionized multithreading to the server"
      experimentalWarning="Download experimental builds of Folia, our new fork of Paper that adds regionized multithreading to the server. Proceed with caution!"
    />
  );
}
