import Image from "next/image";
import type { ReactElement } from "react";

import WaterfallIcon from "@/assets/brand/waterfall.svg";
import BoltIcon from "@/assets/icons/heroicons/bolt.svg";
import ChatBubbleLeftRightIcon from "@/assets/icons/heroicons/chat-bubble-left-right.svg";
import CodeBracketIcon from "@/assets/icons/heroicons/code-bracket.svg";
import CommunityImage from "@/assets/images/community.png";
import HomeImage1 from "@/assets/images/home-1.png";
import VelocityImage from "@/assets/images/velocity.png";
import FeatureCard from "@/components/data/FeatureCard";
import Button from "@/components/input/Button";
import SoftwareHeader from "@/components/layout/SoftwareHeader";
import SEO from "@/components/util/SEO";
import type { HangarProjectProps } from "@/lib/context/downloads";
import { getProjectProps } from "@/lib/context/downloads";

const WaterfallHome = ({ project }: HangarProjectProps): ReactElement => {
  return (
    <>
      <SEO
        title="Waterfall"
        description="Waterfall is an upgraded BungeeCord, offering full compatibility with improvements to performance and stability."
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
        versionGroup={project.latestVersionGroup}
        icon={WaterfallIcon}
        header={<>The Bungee-compatible upgrade</>}
        description="Waterfall is an upgraded BungeeCord, offering full compatibility with improvements to performance and stability."
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
              label="Fast, smooth, and easy"
              description="Waterfall is a simple BungeeCord fork with additional improvements to stability and performance."
            />
            <FeatureCard
              icon={ChatBubbleLeftRightIcon}
              label="An active and growing community"
              description="If you encounter any problems, you can come talk with us on Discord and get real time support."
            />
            <FeatureCard
              icon={CodeBracketIcon}
              label="Compatible with Bungee"
              description="Everything that works with BungeeCord works with Waterfall. The switch is seamless and easy: Simply swap out the relevant downloads and you’re good to go."
            />
          </div>
        </div>
      </section>
      <section
        id="facts"
        className="flex flex-col max-w-7xl mx-auto px-4 py-8 gap-8 md:(gap-12 py-16)"
      >
        <div className="flex flex-col gap-6 md:(flex-row gap-8) xl:gap-24 items-center">
          <div className="w-full flex-1 rounded-xl bg-gray-900 aspect-video relative overflow-clip">
            <Image
              alt=""
              src={VelocityImage}
              placeholder="blur"
              fill
              sizes="(min-width: 80rem) 40rem, (min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-2xl md:text-4xl">
              Don&apos;t need BungeeCord compatibility?
            </h2>
            <p className="md:(mt-6 text-xl) text-gray-900 dark:text-gray-100 mt-3">
              If you don’t desperately need BungeeCord plugins on your proxy,
              Velocity is the best proxy software available. Designed with
              performance and scalability in mind, Velocity is a lot faster and
              much more stable than BungeeCord.
            </p>
            <div className="flex flex-row gap-4 mt-8">
              <Button variant="filled" href="/software/velocity" dense>
                Learn more
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 md:(flex-row-reverse gap-8) xl:gap-24 items-center">
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
            <h2 className="font-semibold text-2xl md:text-4xl">
              Getting Started
            </h2>
            <p className="md:(mt-6 text-xl) text-gray-900 dark:text-gray-100 mt-3">
              To get started with Waterfall, you will need to download and
              install the latest version of the proxy software. Once you&apos;re
              ready, take a look at our documentation.
            </p>
            <div className="flex flex-row gap-4 mt-8">
              <Button variant="filled" href="/downloads/waterfall" dense>
                Downloads
              </Button>
              <Button
                variant="outlined"
                href="https://docs.papermc.io/waterfall/getting-started"
                external
                dense
              >
                Documentation
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 md:(flex-row-reverse gap-8) xl:gap-24 items-center">
          <div className="flex-1">
            <h2 className="font-semibold text-2xl md:text-4xl">
              Together with a community of server owners
            </h2>
            <p className="md:(mt-6 text-xl) text-gray-900 dark:text-gray-100 mt-3">
              Whether you need help with your proxy settings, server lag, or
              need a guide for formatting your chat, our knowledgeable staff and
              friendly community are always around to lend a hand.
            </p>
            <div className="flex flex-row gap-4 mt-8">
              <Button
                variant="filled"
                href="https://discord.gg/papermc"
                external
                dense
              >
                Join our Discord
              </Button>
            </div>
          </div>
          <div className="w-full flex-1 rounded-xl aspect-video relative overflow-clip">
            <Image
              alt=""
              src={CommunityImage}
              placeholder="blur"
              fill
              sizes="(min-width: 80rem) 40rem, (min-width: 768px) 40vw, 100vw"
              className="object-cover"
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

export const getStaticProps = getProjectProps("waterfall");
