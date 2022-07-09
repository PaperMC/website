import PaperIcon from "assets/brand/paper.svg";
import VelocityIcon from "assets/brand/velocity.svg";
import TerminalIllustration from "assets/illustrations/terminal.svg";

import type { NextPage } from "next";
import Button from "~/components/input/Button";
import SoftwarePreview from "~/components/data/SoftwarePreview";
import SEO from "~/components/util/SEO";

const Home: NextPage = () => {
  return (
    <>
      <SEO
        title="Home"
        description="PaperMC is a Minecraft software organization focusing on improving
            the game’s ecosystem with faster and more secure software."
        keywords={["papermc", "paper", "minecraft", "performance"]}
      />
      <header className="container flex flex-row mx-auto px-4 pt-32 pb-26 lg:(pt-48 pb-46) gap-16">
        <div className="flex-1">
          <h1 className="font-medium leading-normal lg:(text-5xl leading-normal) text-4xl">
            Modern software. <br />
            <span className="text-blue-500">Built to perform.</span>
          </h1>
          <p className="text-xl mt-4">
            PaperMC is a Minecraft software organization focusing on improving
            the game’s ecosystem with faster and more secure software. Our
            server, Paper, is leading the competition as the most performant and
            stable available.
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
          <TerminalIllustration className="max-h-82 rounded-md" />
        </div>
      </header>
      <section id="software" className="w-full pt-16 pb-8 bg-primary-200">
        <div className="container mx-auto">
          <h2 className="font-medium text-xl md:text-2xl px-4">
            Your server deserves the best
          </h2>
          <div className="grid md:grid-cols-3 mt-6 gap-2 px-2 xl:(gap-16 gap-4)">
            <SoftwarePreview
              id="paper"
              name="Paper"
              icon={PaperIcon}
              description="Paper is the next generation of Minecraft servers, offering uncompromising performance."
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
    </>
  );
};

export default Home;
