import type { ReactElement } from "react";

import PaperIcon from "@/assets/brand/paper.svg";
import BoltIcon from "@/assets/icons/heroicons/bolt.svg";
import ChatBubbleLeftRightIcon from "@/assets/icons/heroicons/chat-bubble-left-right.svg";
import CodeBracketIcon from "@/assets/icons/heroicons/code-bracket.svg";
import FeatureCard from "@/components/data/FeatureCard";
import SoftwareHeader from "@/components/layout/SoftwareHeader";
import SEO from "@/components/util/SEO";

const PaperHome = (): ReactElement => {
  return (
    <>
      <SEO
        title="Paper"
        description="Paper is the next generation Minecraft server software, compatible with Spigot plugins and offering uncompromising performance."
        keywords={[
          "papermc",
          "paper",
          "server",
          "minecraft",
          "performance",
          "spigot",
          "fork",
        ]}
      />
      <SoftwareHeader
        id="paper"
        name="Paper"
        icon={PaperIcon}
        header={
          <>
            The blazing fast
            <br />
            <span className="text-blue-500">Minecraft server</span>
          </>
        }
        description="Paper is the next generation Minecraft server software, compatible with Spigot plugins and offering uncompromising performance."
      />
      <section
        id="why"
        className="w-full pt-10 pb-5 bg-primary-200 dark:bg-background-dark-80"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="font-semibold text-xl md:text-2xl px-6 lg:px-4">Why Paper?</h2>
          <div className="grid md:grid-cols-3 mt-6 gap-2 px-2 xl:gap-4">
            <FeatureCard
              icon={BoltIcon}
              label="It's stupidly fast."
              description="Paper contains numerous improvements and optimizations resulting in a significant increase in performance."
            />
            <FeatureCard
              icon={ChatBubbleLeftRightIcon}
              label="An active and growing community."
              description="Paper has an active and growing community of server administrators and developers. Got problems? Come talk with us on Discord and get real time support."
            />
            <FeatureCard
              icon={CodeBracketIcon}
              label="An expanded API."
              description="Paper extends and improves the Bukkit and Spigot APIs so that you and your developers have more features and functionality at your fingertips."
            />
          </div>
        </div>
      </section>
    </>
  );
};

PaperHome.softwareProps = {
  github: "https://github.com/PaperMC/Paper",
};

export default PaperHome;
