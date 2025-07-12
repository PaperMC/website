import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import CommunityImage from "@/assets/images/community.webp";
import VelocityImage from "@/assets/images/velocity.webp";
import Button from "@/components/input/Button";
import SoftwareHeader from "@/components/layout/SoftwareHeader";
import { getProjectDescriptor } from "@/lib/util/downloads";

export const metadata: Metadata = {
  title: "Waterfall",
  description:
    "Waterfall is an upgraded BungeeCord, offering full compatibility with improvements to performance and stability.",
  keywords: ["waterfall", "proxy", "minecraft", "performance", "bungeecord", "fork"],
};

export const revalidate = 600; // 10 minutes

export default async function WaterfallSoftwarePage() {
  const project = await getProjectDescriptor("waterfall");

  if (!project) {
    notFound();
  }

  return (
    <>
      <SoftwareHeader
        id="waterfall"
        name="Waterfall"
        versionGroup={project.latestVersionGroup}
        header={<>Waterfall has reached end of life</>}
        description={
          <>
            We recommend you transition to{" "}
            <Link className="text-blue-500 hover:text-blue-400 hover:underline" href="/software/velocity">
              Velocity
            </Link>
            . For more information see the{" "}
            <a
              className="text-blue-500 hover:text-blue-400 hover:underline"
              href="https://forums.papermc.io/threads/1088/"
            >
              announcement
            </a>
            . <br /> Archived Waterfall builds and docs are available here.
          </>
        }
        eol
      />
      <section id="facts" className="flex flex-col max-w-7xl mx-auto px-4 py-8 gap-8 md:gap-12 md:py-16">
        <div className="flex flex-col gap-6 md:flex-row md:gap-8 xl:gap-24 items-center">
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
            <h2 className="font-semibold text-2xl md:text-4xl">Need an updated proxy? Use Velocity!</h2>
            <p className="md:mt-6 md:text-xl text-gray-900 dark:text-gray-100 mt-3">
              All the experience the PaperMC team has gained from working on Waterfall has applied to Velocity. Designed
              with performance and scalability in mind, Velocity is the best proxy software available.
            </p>
            <div className="flex flex-row gap-4 mt-8">
              <Button variant="filled" href="/software/velocity" dense>
                Learn more
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 md:flex-row-reverse md:gap-8 xl:gap-24 items-center">
          <div className="flex-1">
            <h2 className="font-semibold text-2xl md:text-4xl">Together with a community of server owners</h2>
            <p className="md:mt-6 md:text-xl text-gray-900 dark:text-gray-100 mt-3">
              Whether you need help with your proxy settings, server lag, or need a guide for formatting your chat, our
              knowledgeable staff and friendly community are always around to lend a hand.
            </p>
            <div className="flex flex-row gap-4 mt-8">
              <Button variant="filled" href="https://discord.gg/papermc" external dense>
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
}
