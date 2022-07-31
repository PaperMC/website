import { GetStaticProps, NextPage } from "next";
import { ProjectDescriptor } from "~/context/downloads";
import { useState } from "react";
import { getProject, getVersionBuilds, useVersionBuilds } from "~/service/v2";
import SEO from "~/components/util/SEO";
import SoftwarePreview from "~/components/data/SoftwarePreview";
import PaperIcon from "assets/brand/paper.svg";
import VelocityIcon from "assets/brand/velocity.svg";

const Downloads: NextPage = () => {
  return (
    <>
      <SEO
        title="Downloads"
        description="Find downloads for our software – including Paper, Velocity, and Waterfall."
        keywords={[
          "papermc",
          "minecraft",
          "performance",
          "paper",
          "velocity",
          "waterfall",
          "downloads",
        ]}
      />
      <header className="max-w-7xl flex flex-col items-center mx-auto px-4 pt-32 pb-16 lg:(pt-48 pb-26) gap-2">
        <h1 className="font-medium leading-normal lg:(text-5xl leading-normal) text-4xl">
          Downloads
        </h1>
        <p className="text-xl text-center mb-6">
          {"It's time! Get started by downloading our software."}
        </p>
        <div className="grid md:grid-cols-3 mt-6 gap-2 px-2 xl:gap-4">
          <SoftwarePreview
            id="paper"
            name="Paper"
            icon={PaperIcon}
            description="Paper is the next generation of Minecraft servers, offering uncompromising performance."
            download
          />
          <SoftwarePreview
            id="velocity"
            name="Velocity"
            icon={VelocityIcon}
            description="Velocity is the modern, high performance Minecraft server proxy."
            download
          />
          <SoftwarePreview
            id="waterfall"
            name="Waterfall"
            icon={PaperIcon}
            description="Waterfall is a BungeeCord-replacing proxy that aims to improve performance and stability."
            download
          />
        </div>
      </header>
    </>
  );
};

export default Downloads;
