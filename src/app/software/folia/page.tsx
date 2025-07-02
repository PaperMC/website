import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import HomeImage3 from "@/assets/images/home-3.webp";
import FeatureCard from "@/components/data/FeatureCard";
import Button from "@/components/input/Button";
import SoftwareHeader from "@/components/layout/SoftwareHeader";
import type { ProjectDescriptor } from "@/lib/context/downloads";
import { getProject, getVersionBuilds } from "@/lib/service/fill";

export const metadata: Metadata = {
  title: "Folia",
  description:
    "Folia is a new fork of Paper that adds regionized multithreading to the server.",
  keywords: [
    "papermc",
    "folia",
    "server",
    "minecraft",
    "performance",
    "regionized",
    "multithreading",
    "fork",
  ],
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
      } catch {}
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

export default async function FoliaSoftwarePage() {
  const project = await getProjectDescriptor("folia");

  if (!project) {
    notFound();
  }

  return (
    <>
      <SoftwareHeader
        id="folia"
        name="Folia"
        versionGroup={project.latestVersionGroup}
        header={<>What is Folia?</>}
        description="Folia is a new fork of Paper that adds regionized multithreading to the server"
      />
      <section
        id="why"
        className="w-full pt-10 pb-5 bg-primary-200 dark:bg-background-dark-80"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="font-semibold text-xl md:text-2xl px-6 lg:px-4">
            About Folia
          </h2>
          <div className="grid md:grid-cols-3 mt-6 gap-2 px-2 xl:gap-4">
            <FeatureCard
              iconId="bolt"
              label="How's it different from Paper?"
              description="Folia is designed to address the constant bottleneck of the Minecraft server running on a single thread causing performance issues. It is by no means a drop-in replacement for Paper."
            />
            <FeatureCard
              iconId="chat-bubble-left-right"
              label="Is Folia for me?"
              description="Folia won't be useful for the majority of servers out there and will break most public plugins. It's ideal for servers with very high players counts, that offer gamemodes that naturally spread players out, such as SkyBlock or SMP."
            />
            <FeatureCard
              iconId="code-bracket"
              label="Where can I learn more?"
              description="You can visit the GitHub repository for Folia to read an overview of the project, and some frequently asked questions."
            />
          </div>
        </div>
      </section>
      <section
        id="facts"
        className="flex flex-col max-w-7xl mx-auto px-4 py-8 gap-8 md:gap-12 md:py-16"
      >
        <div className="flex flex-col gap-6 md:flex-row md:gap-8 xl:gap-24 items-center">
          <div className="w-full flex-1 rounded-xl aspect-video relative overflow-clip">
            <Image
              alt=""
              src={HomeImage3}
              placeholder="blur"
              fill
              sizes="(min-width: 80rem) 40rem, (min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-2xl md:text-4xl">
              A diverse plugin ecosystem
            </h2>
            <p className="md:mt-6 md:text-xl text-gray-900 dark:text-gray-100 mt-3">
              Crafted by the PaperMC team & contributors, Hangar is our own
              dedicated plugin repository, now in open beta! View over&nbsp;
              <span className={"text-blue-500"}>100</span>
              &nbsp;different plugins that support Folia, or list your own with
              a very streamlined creation process.
            </p>
            <div className="flex flex-row gap-4 mt-8">
              <Button
                variant="filled"
                href="https://hangar.papermc.io/"
                external
                dense
              >
                Check out Hangar
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
