import { ReactElement } from "react";

import VelocityIcon from "@/assets/brand/velocity.svg";
import BoltIcon from "@/assets/icons/heroicons/bolt.svg";
import ChatBubbleLeftRightIcon from "@/assets/icons/heroicons/chat-bubble-left-right.svg";
import CodeBracketIcon from "@/assets/icons/heroicons/code-bracket.svg";
import FeatureCard from "@/components/data/FeatureCard";
import SoftwareHeader from "@/components/layout/SoftwareHeader";
import SEO from "@/components/util/SEO";

const VelocityHome = (): ReactElement => {
  return (
    <>
      <SEO
        title="Velocity"
        description="Velocity is the modern, high-performance proxy, in every sense. Boasting unparalleled speed and next-level design, it’s a full alternative to Waterfall with its own plugin ecosystem."
        keywords={[
          "velocity",
          "proxy",
          "minecraft",
          "performance",
          "bungeecord",
        ]}
      />
      <SoftwareHeader
        id="velocity"
        name="Velocity"
        icon={VelocityIcon}
        header={<>Next generation speed and capability</>}
        description="Velocity is the modern, high-performance proxy, in every sense. Boasting unparalleled speed and next-level design, it’s a full alternative to Waterfall with its own plugin ecosystem."
      />
      <section
        id="why"
        className="w-full pt-16 pb-8 bg-primary-200 dark:bg-background-dark-80"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="font-semibold text-xl md:text-2xl px-4">
            Why Velocity?
          </h2>
          <div className="grid md:grid-cols-3 mt-6 gap-2 px-2 xl:gap-4">
            <FeatureCard
              icon={BoltIcon}
              label="Out with the old, in with the new."
              description="Velocity is the very best proxy software available. Boasting much expanded capabilities due to next-level technical design, it runs laps around BungeeCord."
            />
            <FeatureCard
              icon={ChatBubbleLeftRightIcon}
              label="An active and growing community."
              description="Velocity has an active and growing community of server administrators and developers. Got problems? Come talk with us on Discord and get real time support."
            />
            <FeatureCard
              icon={CodeBracketIcon}
              label="Plenty of plugins to choose from."
              description="While BungeeCord has more third-party software due to its longer life so far, Velocity isn’t lacking in the essentials. With enough to get going and more added every day, Velocity’s got what you need."
            />
          </div>
        </div>
      </section>
    </>
  );
};

VelocityHome.softwareProps = {
  github: "https://github.com/PaperMC/Velocity",
};

export default VelocityHome;
