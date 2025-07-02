import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SoftwareDownload from "@/components/layout/SoftwareDownload";
import type { ProjectDescriptor } from "@/lib/context/downloads";
import { getProject, getVersionBuilds } from "@/lib/service/fill";

export const metadata: Metadata = {
  title: "Folia",
  description:
    "Download the latest builds of Folia, the experimental Paper fork with regionised multithreading.",
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

export default async function FoliaDownloadPage() {
  const project = await getProjectDescriptor("folia");

  if (!project) {
    notFound();
  }

  return (
    <SoftwareDownload
      id="folia"
      project={project}
      description="Download Folia, our new fork of Paper that adds regionized multithreading to the server"
      experimentalWarning="Download experimental builds of Folia, our new fork of Paper that adds regionized multithreading to the server. Proceed with caution!"
    />
  );
}
