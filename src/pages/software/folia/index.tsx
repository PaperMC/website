import Image from "next/image";
import type { ReactElement } from "react";

import FoliaIcon from "@/assets/brand/folia.svg";
import BoltIcon from "@/assets/icons/heroicons/bolt.svg";
import ChatBubbleLeftRightIcon from "@/assets/icons/heroicons/chat-bubble-left-right.svg";
import CodeBracketIcon from "@/assets/icons/heroicons/code-bracket.svg";
import HomeImage3 from "@/assets/images/home-3.png";
import FeatureCard from "@/components/data/FeatureCard";
import Button from "@/components/input/Button";
import SoftwareHeader from "@/components/layout/SoftwareHeader";
import SEO from "@/components/util/SEO";
import type { HangarProjectProps } from "@/lib/context/downloads";
import { getProjectProps } from "@/lib/context/downloads";

const FoliaHome = ({ project }: HangarProjectProps): ReactElement => {
  return (
    <>
      <SEO
        title="Folia"
        description="Folia is a new fork of Paper that adds regionized multithreading to the server."
        keywords={[
          "papermc",
          "folia",
          "server",
          "minecraft",
          "performance",
          "regionized",
          "multithreading",
          "fork",
        ]}
      />
      <SoftwareHeader
        id="folia"
        name="Folia"
        versionGroup={project.latestVersionGroup}
        icon={FoliaIcon}
        header={<>What is Folia?</>}
        description="Folia is a new fork of Paper that adds regionized multithreading to the server. Access to Folia builds isn't currently available. To build Folia, you need to compile from source following Paper's standard compilation guide."
        github="https://github.com/PaperMC/Folia"
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
              icon={BoltIcon}
              label="How's it different from Paper?"
              description="Folia is designed to address the constant bottleneck of the Minecraft server running on a single thread causing performance issues. It is by no means a drop-in replacement for Paper."
            />
            <FeatureCard
              icon={ChatBubbleLeftRightIcon}
              label="Is Folia for me?"
              description="Folia won't be useful for the majority of servers out there and will break most public plugins. It's ideal for servers with very high players counts, that offer gamemodes that naturally spread players out, such as SkyBlock or SMP."
            />
            <FeatureCard
              icon={CodeBracketIcon}
              label="Where can I learn more?"
              description="You can visit the GitHub repository for Folia to read an overview of the project, and some frequently asked questions."
            />
          </div>
        </div>
      </section>
      <section
        id="facts"
        className="flex flex-col max-w-7xl mx-auto px-4 py-8 gap-8 md:(gap-12 py-16)"
      >
        <div className="flex flex-col gap-6 md:(flex-row gap-8) xl:gap-24 items-center">
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
            <p className="md:(mt-6 text-xl) text-gray-900 dark:text-gray-100 mt-3">
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
};

FoliaHome.softwareProps = {
  github: "https://github.com/PaperMC/Folia",
};

export default FoliaHome;

export const getStaticProps = getProjectProps("folia", false);
