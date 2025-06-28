import type { ReactElement } from "react";

import FoliaIcon from "@/assets/brand/folia.svg";
import SoftwareDownload from "@/components/layout/SoftwareDownload";
import SEO from "@/components/util/SEO";
import type { ProjectProps } from "@/lib/context/downloads";
import { getProjectProps } from "@/lib/context/downloads";

const FoliaDownloads = ({ project }: ProjectProps): ReactElement => {
  return (
    <>
      <SEO
        title="Folia Downloads"
        description="Download Folia, our Minecraft server software offering unrivaled performance and stability."
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
        canonical="/downloads/folia"
      />
      <SoftwareDownload
        id="folia"
        project={project}
        icon={FoliaIcon}
        description="Download Folia, our new fork of Paper that adds regionized multithreading to the server"
        experimentalWarning="Download experimental builds of Folia, our new fork of Paper that adds regionized multithreading to the server. Proceed with caution!"
      />
    </>
  );
};

FoliaDownloads.softwareProps = {
  github: "https://github.com/PaperMC/Folia",
};

export default FoliaDownloads;

export const getStaticProps = getProjectProps("folia", false);
