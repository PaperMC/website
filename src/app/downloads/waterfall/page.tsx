import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import SoftwareDownload from "@/components/layout/SoftwareDownload";
import type { ProjectDescriptor } from "@/lib/context/downloads";
import { getProject, getVersionBuilds } from "@/lib/service/fill";

export const metadata: Metadata = {
  title: "Waterfall",
  description:
    "Download the latest builds of Waterfall, the BungeeCord fork focused on performance and stability.",
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

export default async function WaterfallDownloadPage() {
  const project = await getProjectDescriptor("waterfall");

  if (!project) {
    notFound();
  }

  return (
    <SoftwareDownload
      id="waterfall"
      project={project}
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
