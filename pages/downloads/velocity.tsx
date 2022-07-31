import VelocityIcon from "assets/brand/velocity.svg";

import { ReactElement } from "react";
import SoftwareDownload from "~/components/layout/SoftwareDownload";
import { getProjectProps, ProjectProps } from "~/context/downloads";
import SEO from "~/components/util/SEO";

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
