import type { Metadata } from "next";

import DownloadsClient from "./downloads-client";

export const metadata: Metadata = {
  title: "Downloads",
  description: "Download the latest builds of Paper, Velocity, Folia, and Waterfall.",
};

export default function DownloadsPage() {
  return <DownloadsClient />;
}
