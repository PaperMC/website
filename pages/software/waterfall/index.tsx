import { ReactElement } from "react";

import PaperIcon from "@/assets/brand/paper.svg";
import SoftwareHeader from "@/components/layout/SoftwareHeader";
import SEO from "@/components/util/SEO";

const WaterfallHome = (): ReactElement => {
  return (
    <>
      <SEO
        title="Waterfall"
        description="Waterfall is an upgraded BungeeCord, offering full compatibility with better performance."
        keywords={[
          "waterfall",
          "proxy",
          "minecraft",
          "performance",
          "bungeecord",
          "fork",
        ]}
      />
      <SoftwareHeader
        id="waterfall"
        name="Waterfall"
        icon={PaperIcon}
        header={<>The bungee-compatible upgrade</>}
        description="Waterfall is an upgraded BungeeCord, offering full compatibility with better performance."
      />
    </>
  );
};

export default WaterfallHome;
