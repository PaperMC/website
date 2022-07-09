import VelocityIcon from "assets/brand/velocity.svg";

import { ReactElement } from "react";
import SoftwareHeader from "~/components/layout/SoftwareHeader";

const VelocityHome = (): ReactElement => {
  return (
    <>
      <SoftwareHeader
        name="Velocity"
        icon={VelocityIcon}
        header={<>Next generation speed and capability</>}
        description="Velocity is the modern, high-performance proxy, in every sense. Boasting unparalleled speed and next-level design, it’s a full alternative to Waterfall with its own plugin ecosystem."
      />
    </>
  );
};

export default VelocityHome;
