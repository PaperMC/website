import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SoftwareDownload from "@/components/layout/SoftwareDownload";
import type { ProjectDescriptor } from "@/lib/context/downloads";
import { getProject, getVersionBuilds } from "@/lib/service/fill";

export const metadata: Metadata = {
  title: "Paper",
  description:
    "Download the latest builds of Paper, the high-performance Minecraft server software.",
};

export const revalidate = 600; // 10 minutes

async function getProjectDescriptor(
  id: string,
): Promise<ProjectDescriptor | null> {
  try {
    const projectData = await getProject(id);
    const flattenedVersions = Object.values(projectData.versions)
      .flat()
      .reverse();
    let latestStableVersion = flattenedVersions[flattenedVersions.length - 1];

    // Check for stable builds
    for (let i = flattenedVersions.length - 1; i >= 0; i--) {
      try {
        const builds = await getVersionBuilds(id, flattenedVersions[i]);
        if (builds.some((build) => build.channel === "STABLE")) {
          latestStableVersion = flattenedVersions[i];
          break;
        }
      } catch {
        // Continue to next version if this one fails
      }
    }

    const latestExperimentalVersion =
      latestStableVersion !== flattenedVersions[flattenedVersions.length - 1]
        ? flattenedVersions[flattenedVersions.length - 1]
        : null;

    return {
      name: projectData.project.name,
      latestStableVersion,
      latestExperimentalVersion,
      latestVersionGroup: Object.keys(projectData.versions)[0],
    };
  } catch (error) {
    console.error(`Failed to fetch project ${id}:`, error);
    return null;
  }
}

export default async function PaperDownloadPage() {
  const project = await getProjectDescriptor("paper");

  if (!project) {
    notFound();
  }

  return (
    <SoftwareDownload
      id="paper"
      project={project}
      description="Download Paper, our Minecraft server software offering unrivaled performance and stability."
      experimentalWarning="Download experimental builds of Paper, our Minecraft server software offering unrivaled performance and stability. Proceed with caution!"
    />
  );
}
