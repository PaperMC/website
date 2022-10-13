import { ReactElement } from "react";

import PaperIcon from "@/assets/brand/paper.svg";
import SoftwareDownload from "@/components/layout/SoftwareDownload";
import SEO from "@/components/util/SEO";
import { getProjectProps, ProjectProps } from "@/lib/context/downloads";

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
      />
    </>
  );
};

export default PaperDownloads;

export const getStaticProps = getProjectProps("paper");
