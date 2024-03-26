import Link from "next/link";
import type { ReactElement } from "react";

import WaterfallIcon from "@/assets/brand/waterfall.svg";
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
        icon={WaterfallIcon}
        description={
          <>
            Waterfall has reached end of life. We recommend you transition to{" "}
            <Link
              className="text-blue-500 hover:text-blue-400 hover:underline"
              href="/software/velocity"
            >
              Velocity
            </Link>
            . For more information see the{" "}
            <a
              className="text-blue-500 hover:text-blue-400 hover:underline"
              href="https://forums.papermc.io/threads/1088/"
            >
              announcement
            </a>
            . <br />
            Download unsupported, archived Waterfall builds below.
          </>
        }
        eol
      />
    </>
  );
};

export default WaterfallDownloads;

export const getStaticProps = getProjectProps("waterfall");
