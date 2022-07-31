import PaperIcon from "assets/brand/paper.svg";

import { ReactElement } from "react";
import SoftwareHeader from "~/components/layout/SoftwareHeader";
import SEO from "~/components/util/SEO";

const WaterfallHome = (): ReactElement => {
  return (
    <>
      <SEO
        title="Waterfall"
        description="Waterfall is an upgraded BungeeCord, offering better performance and full compatibility."
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
        description="Waterfall is an upgraded BungeeCord, offering better performance and full compatibility."
      />
    </>
  );
};

export default WaterfallHome;
