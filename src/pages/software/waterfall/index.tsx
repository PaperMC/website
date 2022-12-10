import type { ReactElement } from "react";

import PaperIcon from "@/assets/brand/paper.svg";
import BoltIcon from "@/assets/icons/heroicons/bolt.svg";
import ChatBubbleLeftRightIcon from "@/assets/icons/heroicons/chat-bubble-left-right.svg";
import CodeBracketIcon from "@/assets/icons/heroicons/code-bracket.svg";
import FeatureCard from "@/components/data/FeatureCard";
import SoftwareHeader from "@/components/layout/SoftwareHeader";
import SEO from "@/components/util/SEO";

const WaterfallHome = (): ReactElement => {
  return (
    <>
      <SEO
        title="Waterfall"
        description="Waterfall is an upgraded BungeeCord, offering full compatibility with better performance."
        keywords={[
          "waterfall",
          "proxy",
          "minecraft",
          "performance",
          "bungeecord",
          "fork",
        ]}
      />
      <SoftwareHeader
        id="waterfall"
        name="Waterfall"
        icon={PaperIcon}
        header={<>The Bungee-compatible upgrade</>}
        description="Waterfall is an upgraded BungeeCord, offering full compatibility with better performance."
      />
      <section
        id="why"
        className="w-full pt-10 pb-5 bg-primary-200 dark:bg-background-dark-80"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="font-semibold text-xl md:text-2xl px-6 lg:px-4">
            Why Waterfall?
          </h2>
          <div className="grid md:grid-cols-3 mt-6 gap-2 px-2 xl:gap-4">
            <FeatureCard
              icon={BoltIcon}
              label="Fast, smooth, and easy."
              description="Whatever you need, Waterfall delivers. It doesn’t skip out on the essentials and provides an uncompromising and fully supported platform for your proxy."
            />
            <FeatureCard
              icon={ChatBubbleLeftRightIcon}
              label="An active and growing community."
              description="Waterfall has an active and growing community of server administrators and developers. Got problems? Come talk with us on Discord and get real time support."
            />
            <FeatureCard
              icon={CodeBracketIcon}
              label="Compatible with Bungee."
              description="Everything that works with BungeeCord works with Waterfall. With no compromises, the switch is seamless and easy. Simply swap out the relevant downloads and you’re good to go."
            />
          </div>
        </div>
      </section>
    </>
  );
};

WaterfallHome.softwareProps = {
  github: "https://github.com/PaperMC/Waterfall",
};

export default WaterfallHome;
