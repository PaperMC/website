import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import DownloadsAllClient from "./downloads-all-client";

import { getProject } from "@/lib/service/fill";

export const metadata: Metadata = {
  title: "Build explorer",
  description: "Build explorer for PaperMC projects. Proceed with caution!",
  keywords: [],
};

const INITIAL_PROJECT = "paper";

export default async function DownloadsAllPage() {
  try {
    const project = await getProject(INITIAL_PROJECT);
    const flattenedVersions = Object.values(project.versions).flat();

    return (
      <Suspense>
        <DownloadsAllClient initialProjectId={project.project.id} initialProjectVersion={flattenedVersions[0]} />
      </Suspense>
    );
  } catch (error) {
    console.error("Failed to load initial project data:", error);
    notFound();
  }
}
