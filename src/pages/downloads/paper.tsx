import type { ReactElement } from "react";

import PaperIcon from "@/assets/brand/paper.svg";
import SoftwareDownload from "@/components/layout/SoftwareDownload";
import SEO from "@/components/util/SEO";
import type { ProjectProps } from "@/lib/context/downloads";
import { getProjectProps } from "@/lib/context/downloads";

const PaperDownloads = ({ project }: ProjectProps): ReactElement => {
  return (
    <>
      <SEO
        title="Paper Downloads"
        description="Download Paper, our Minecraft server software offering unrivaled performance and stability."
        keywords={[
          "papermc",
          "minecraft",
          "performance",
          "paper",
          "downloads",
          "jar",
        ]}
      />
      <SoftwareDownload
        id="paper"
        project={project}
        icon={PaperIcon}
        description="Download Paper, our Minecraft server software offering unrivaled performance and stability."
        experimentalWarning="Download experimental builds of Paper, our Minecraft server software offering unrivaled performance and stability. Proceed with caution!"
      />
    </>
  );
};

export default PaperDownloads;

export const getStaticProps = getProjectProps("paper");
