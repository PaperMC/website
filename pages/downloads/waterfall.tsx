import PaperIcon from "assets/brand/paper.svg";

import { ReactElement } from "react";
import SoftwareDownload from "~/components/layout/SoftwareDownload";
import { getProjectProps, ProjectProps } from "~/context/downloads";
import SEO from "~/components/util/SEO";

const WaterfallDownloads = ({ project }: ProjectProps): ReactElement => {
  return (
    <>
      <SEO
        title="Waterfall Downloads"
        description="Download Waterfall, our Bungee-compatible upgrade, offering better performance and full compatibility."
        keywords={[
          "papermc",
          "minecraft",
          "performance",
          "bungeecord",
          "waterfall",
          "downloads",
          "jar",
        ]}
      />
      <SoftwareDownload
        id="waterfall"
        project={project}
        icon={PaperIcon}
        description="Download Waterfall, our Bungee-compatible upgrade, offering better performance and full compatibility."
      />
    </>
  );
};

export default WaterfallDownloads;

export const getStaticProps = getProjectProps("waterfall");
