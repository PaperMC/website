import type { Metadata } from "next";
import Image from "next/image";

import PlayerCountDisplay from "./player-count-display";

import HomeImage1 from "@/assets/images/home-1.webp";
import HomeImage2 from "@/assets/images/home-2.webp";
import HomeImage3 from "@/assets/images/home-3.webp";
import SoftwarePreview from "@/components/data/SoftwarePreview";
import { Terminal } from "@/components/data/Terminal";
import Button from "@/components/input/Button";
import type { ProjectDescriptor } from "@/lib/context/downloads";
import { getProject, getBStats, getVersionBuilds } from "@/lib/service/fill";

export const metadata: Metadata = {
  title: "Home",
  description:
    "PaperMC is a Minecraft software organization focusing on improving the game's ecosystem with faster and more secure software.",
  keywords: ["papermc", "paper", "velocity", "minecraft", "performance"],
};

export const revalidate = 600; // 10 minutes

const isVersionStable = async (project: string, version: string): Promise<boolean> => {
  try {
    const builds = await getVersionBuilds(project, version);
    for (let i = builds.length - 1; i >= 0; i--) {
      if (builds[i].channel === "STABLE") return true;
    }
    return false;
  } catch {
    return false;
  }
};

export default async function HomePage() {
  const [projectData, bstatsData] = await Promise.all([
    getProject("paper").catch(() => null),
    getBStats().catch(() => ({ servers: 0, players: 0 })),
  ]);

  let projectDescriptor: ProjectDescriptor | null = null;
  if (projectData) {
    const flattenedVersions = Object.values(projectData.versions).flat().reverse();
    let latestStableVersion = flattenedVersions[flattenedVersions.length - 1] || "1.21.4";

    // Check versions from newest to oldest to find the latest stable one
    for (let i = flattenedVersions.length - 1; i >= 0; i--) {
      if (await isVersionStable("paper", flattenedVersions[i])) {
        latestStableVersion = flattenedVersions[i];
        break;
      }
    }

    const latestExperimentalVersion =
      latestStableVersion !== flattenedVersions[flattenedVersions.length - 1]
        ? flattenedVersions[flattenedVersions.length - 1]
        : null;

    projectDescriptor = {
      name: projectData.project.name,
      latestStableVersion,
      latestExperimentalVersion,
      latestVersionGroup: Object.keys(projectData.versions)[0] || "1.21",
    };
  }

  return (
    <>
      <header className="max-w-7xl flex flex-row mx-auto px-4 pt-32 pb-26 lg:pt-48 lg:pb-46">
        <div className="flex-1">
          <h1 className="font-medium leading-normal lg:text-5xl lg:leading-normal text-4xl">
            Modern software. <br />
            <span className="text-blue-500">Built to perform.</span>
          </h1>
          <p className="text-xl mt-4">
            PaperMC improves Minecraft&apos;s ecosystem with fast, secure software and an expanding plugin API,
            providing quick releases and helpful support as the most widely used, performant, and stable software
            available.
          </p>
          <div className="flex flex-row gap-4 mt-8">
            <Button variant="filled" href="/downloads">
              Downloads
            </Button>
            <Button variant="outlined" href="https://docs.papermc.io" external>
              Documentation
            </Button>
          </div>
        </div>
        <div className="flex-1 lg:flex hidden justify-end">
          {projectDescriptor && <Terminal project={projectDescriptor} />}
        </div>
      </header>
      <section id="software" className="w-full pt-12 pb-8 bg-primary-200 dark:bg-background-dark-80">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-semibold text-xl md:text-2xl px-6 lg:px-4 mb-4">
            Your server deserves the&nbsp;
            <span className="text-blue-500">best.</span>
          </h2>
          <div className="grid md:grid-cols-3 md:-ml-4 gap-2 px-2 xl:gap-4">
            <SoftwarePreview
              id="paper"
              name="Paper"
              description="Paper is a Minecraft game server based on Spigot, designed to greatly improve performance and offer more advanced features and API."
            />
            <SoftwarePreview
              id="velocity"
              name="Velocity"
              description="Velocity is a high-performance, scalable Minecraft proxy server that allows players to connect to multiple Minecraft servers under the proxy."
            />
          </div>
        </div>
      </section>
      <section id="facts" className="flex flex-col max-w-7xl mx-auto px-4 py-8 gap-8 md:gap-12 md:py-16">
        <div className="flex flex-col gap-6 md:flex-row-reverse md:gap-8 xl:gap-24 items-center">
          <div className="w-full flex-1 rounded-xl bg-gray-900 aspect-video relative overflow-clip">
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
            <h2 className="font-semibold text-2xl md:text-4xl">A diverse plugin ecosystem</h2>
            <p className="md:mt-6 md:text-xl text-gray-900 dark:text-gray-100 mt-3">
              Crafted by the PaperMC team & contributors, Hangar is our own dedicated plugin repository, now in open
              beta! A place for developers to host their creations, and server owners to enrich their player&apos;s
              gameplay. From Administration Tools, to Minigames, you&apos;ll find it all on Hangar.
            </p>
            <div className="flex flex-row gap-4 mt-8">
              <Button variant="filled" href="https://hangar.papermc.io/" external>
                Check out Hangar
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 md:flex-row md:gap-8 xl:gap-24 items-center">
          <div className="w-full flex-1 rounded-xl bg-gray-900 aspect-video relative overflow-clip">
            <Image
              alt=""
              src={HomeImage1}
              placeholder="blur"
              fill
              sizes="(min-width: 80rem) 40rem, (min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-2xl md:text-4xl break-all">
              Powering&nbsp;
              <PlayerCountDisplay fallbackPlayers={bstatsData.players} />
              &nbsp;players
            </h2>
            <p className="md:mt-6 md:text-xl text-gray-900 dark:text-gray-100 mt-3">
              PaperMC&apos;s software powers hundreds of thousands of Minecraft servers on a daily basis, from small
              single-servers setups to massive Minecraft server networks. Designed with utility and performance in mind,
              it can handle whatever you throw at it.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-6 md:flex-row-reverse md:gap-8 xl:gap-24 items-center">
          <div className="w-full flex-1 rounded-xl bg-gray-900 aspect-video relative overflow-clip">
            <Image
              alt=""
              src={HomeImage2}
              placeholder="blur"
              fill
              sizes="(min-width: 80rem) 40rem, (min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-2xl md:text-4xl">The promise of stability</h2>
            <p className="md:mt-6 md:text-xl text-gray-900 dark:text-gray-100 mt-3">
              Our software is designed with security and stability in mind. We have consistently been among the first to
              fix vulnerabilities in the Minecraft space for years, so you can rest assured that PaperMC software is a
              good choice.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
