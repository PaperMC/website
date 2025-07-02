import type { Metadata } from "next";
import Link from "next/link";

import SoftwareDownloadPage from "@/components/layout/SoftwareDownloadPage";

export const metadata: Metadata = {
  title: "Waterfall",
  description:
    "Download the latest builds of Waterfall, the BungeeCord fork focused on performance and stability.",
};

export const revalidate = 600; // 10 minutes

export default function WaterfallDownloadPage() {
  return (
    <SoftwareDownloadPage
      id="waterfall"
      description={
        <>
          Waterfall has reached end of life. We recommend you transition to{" "}
          <Link
            className="text-blue-500 hover:text-blue-400 hover:underline"
            href="/software/velocity"
          >
            Velocity
          </Link>
          . For more information see the{" "}
          <a
            className="text-blue-500 hover:text-blue-400 hover:underline"
            href="https://forums.papermc.io/threads/1088/"
          >
            announcement
          </a>
          . <br />
          Download unsupported, archived Waterfall builds below.
        </>
      }
      eol
    />
  );
}
