import type { ReactElement } from "react";

import PaperIcon from "@/assets/brand/paper.svg";
import SoftwareDownload from "@/components/layout/SoftwareDownload";
import SEO from "@/components/util/SEO";
import type { ProjectProps } from "@/lib/context/downloads";
import { getProjectProps } from "@/lib/context/downloads";

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
