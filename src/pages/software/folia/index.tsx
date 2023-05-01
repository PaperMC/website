import type { ReactElement } from "react";

import PaperIcon from "@/assets/brand/paper.svg";
import BoltIcon from "@/assets/icons/heroicons/bolt.svg";
import ChatBubbleLeftRightIcon from "@/assets/icons/heroicons/chat-bubble-left-right.svg";
import CodeBracketIcon from "@/assets/icons/heroicons/code-bracket.svg";
import FeatureCard from "@/components/data/FeatureCard";
import SoftwareHeader from "@/components/layout/SoftwareHeader";
import SEO from "@/components/util/SEO";
import type { ProjectProps } from "@/lib/context/downloads";
import { getProjectProps } from "@/lib/context/downloads";

const FoliaHome = ({ project }: ProjectProps): ReactElement => {
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
        icon={PaperIcon}
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
    </>
  );
};

FoliaHome.softwareProps = {
  github: "https://github.com/PaperMC/Folia",
};

export default FoliaHome;

export const getStaticProps = getProjectProps("folia");
