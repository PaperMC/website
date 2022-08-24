import { ReactElement } from "react";

import PaperIcon from "@/assets/brand/paper.svg";
import SoftwareHeader from "@/components/layout/SoftwareHeader";
import SEO from "@/components/util/SEO";

const PaperHome = (): ReactElement => {
  return (
    <>
      <SEO
        title="Paper"
        description="Paper is the next generation Minecraft server, compatible with Spigot plugins and offering uncompromising performance."
        keywords={[
          "papermc",
          "paper",
          "server",
          "minecraft",
          "performance",
          "spigot",
          "fork",
        ]}
      />
      <SoftwareHeader
        id="paper"
        name="Paper"
        icon={PaperIcon}
        header={
          <>
            The blazing fast
            <br />
            <span className="text-blue-500">Minecraft server</span>
          </>
        }
        description="Paper is the next generation Minecraft server, compatible with Spigot plugins and offering uncompromising performance."
      />
    </>
  );
};

export default PaperHome;
