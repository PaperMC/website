import PaperIcon from "assets/brand/paper.svg";

import { ReactElement } from "react";
import SoftwareHeader from "~/components/layout/SoftwareHeader";

const PaperHome = (): ReactElement => {
  return (
    <>
      <SoftwareHeader
        name="Paper"
        icon={PaperIcon}
        header={
          <>
            A blazing fast
            <br/>
            <span className="text-blue-500">Minecraft server</span>
          </>
        }
        description="Paper is the next generation Minecraft server, compatible with Spigot plugins and offering uncompromising performance."
      />
    </>
  );
};

export default PaperHome;
