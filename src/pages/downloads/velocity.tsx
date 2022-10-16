import type { ReactElement } from "react";

import VelocityIcon from "@/assets/brand/velocity.svg";
import SoftwareDownload from "@/components/layout/SoftwareDownload";
import SEO from "@/components/util/SEO";
import type { ProjectProps } from "@/lib/context/downloads";
import { getProjectProps } from "@/lib/context/downloads";

const VelocityDownloads = ({ project }: ProjectProps): ReactElement => {
  return (
    <>
      <SEO
        title="Velocity Downloads"
        description="Download Velocity, our high-performance Minecraft proxy."
        keywords={[
          "papermc",
          "minecraft",
          "performance",
          "velocity",
          "downloads",
          "jar",
        ]}
      />
      <SoftwareDownload
        id="velocity"
        project={project}
        icon={VelocityIcon}
        description="Download Velocity, our high-performance Minecraft proxy."
      />
    </>
  );
};

export default VelocityDownloads;

export const getStaticProps = getProjectProps("velocity");
