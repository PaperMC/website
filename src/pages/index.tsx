import type { NextPage } from "next";
import Image from "next/image";

import PaperIcon from "@/assets/brand/paper.svg";
import VelocityIcon from "@/assets/brand/velocity.svg";
import HomeImage1 from "@/assets/images/home-1.png";
import Skeleton from "@/components/data/Skeleton";
import SoftwarePreview from "@/components/data/SoftwarePreview";
import Button from "@/components/input/Button";
import SEO from "@/components/util/SEO";
import { useBstatsPlayers } from "@/lib/service/bstats";
import { Terminal } from "@/components/data/Terminal";

const Home: NextPage = () => {
  const { data: playerData } = useBstatsPlayers();

  return (
    <>
      <SEO
        title="Home"
        description="PaperMC is a Minecraft software organization focusing on improving
            the game’s ecosystem with faster and more secure software."
        keywords={["papermc", "paper", "minecraft", "performance"]}
      />
      <header className="max-w-7xl flex flex-row mx-auto px-4 pt-32 pb-26 lg:(pt-48 pb-46) gap-16">
        <div className="flex-1">
          <h1 className="font-medium leading-normal lg:(text-5xl leading-normal) text-4xl">
            Modern software. <br />
            <span className="text-blue-500">Built to perform.</span>
          </h1>
          <p className="text-xl mt-4">
            PaperMC is a Minecraft software organization focused on improving the game’s ecosystem with faster and more
            secure software. Our server, Paper, is leading the competition as the most performant and stable one
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
          <Terminal />
        </div>
      </header>
      <section id="software" className="w-full pt-16 pb-8 bg-primary-200 dark:bg-background-dark-80">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-semibold text-xl md:text-2xl px-4">
            Your server deserves the&nbsp;
            <span className="text-blue-500">best.</span>
          </h2>
          <div className="grid md:grid-cols-3 mt-6 gap-2 px-2 xl:gap-4">
            <SoftwarePreview
              id="paper"
              name="Paper"
              icon={PaperIcon}
              description="Paper is the next generation of Minecraft server software, offering uncompromising performance."
            />
            <SoftwarePreview
              id="velocity"
              name="Velocity"
              icon={VelocityIcon}
              description="Velocity is the modern, high performance Minecraft server proxy."
            />
            <SoftwarePreview
              id="waterfall"
              name="Waterfall"
              icon={PaperIcon}
              description="Waterfall is a BungeeCord-replacing proxy that aims to improve performance and stability."
            />
          </div>
        </div>
      </section>
      <section id="facts" className="flex flex-col max-w-7xl mx-auto px-4 py-8 gap-8 md:(gap-12 py-20)">
        <div className="flex flex-col gap-6 md:(flex-row gap-8) xl:gap-24 items-center">
          <div className="w-full flex-1 rounded-xl bg-gray-900 aspect-video relative overflow-clip">
            <Image alt="" src={HomeImage1} objectFit="cover" layout="fill" placeholder="blur" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-2xl md:text-4xl break-all">
              Powering&nbsp;
              {playerData ? (
                <span className="text-blue-500">{Math.round(playerData[0][1] / 1000)}k+</span>
              ) : (
                <Skeleton className="w-30 h-6 inline-block" />
              )}
              &nbsp;players
            </h2>
            <p className="md:(mt-6 text-xl) text-gray-900 dark:text-gray-100 mt-3">
              PaperMC’s software powers tens of thousands of Minecraft servers on a daily basis, from small SMPs to
              ground-breaking Minecraft networks. Designed with utility and performance in mind, it can handle whatever
              you throw at it.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-6 md:(flex-row-reverse gap-8) xl:gap-24 items-center">
          <div className="w-full flex-1 rounded-xl bg-gray-900 aspect-video" />
          <div className="flex-1">
            <h2 className="font-semibold text-2xl md:text-4xl">Security-first approach</h2>
            <p className="md:(mt-6 text-xl) text-gray-900 dark:text-gray-100 mt-3">
              Our software is designed with security and stability in mind. We have consistently been among the first to
              fix vulnerabilities in the Minecraft space for years, so you can rest assured that PaperMC software is a
              good choice.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
