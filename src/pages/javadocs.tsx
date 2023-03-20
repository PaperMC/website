import type { NextPage } from "next";
import type { GetStaticProps } from "next";

import PaperIcon from "@/assets/brand/paper.svg";
import VelocityIcon from "@/assets/brand/velocity.svg";
import WaterfallIcon from "@/assets/brand/waterfall.svg";
import SoftwarePreview from "@/components/data/SoftwarePreview";
import SEO from "@/components/util/SEO";
import type { ProjectDescriptor } from "@/lib/context/downloads";
import { getProjectDescriptor } from "@/lib/context/downloads";

interface JavadocProps {
  paper: ProjectDescriptor;
  velocity: ProjectDescriptor;
  waterfall: ProjectDescriptor;
}

const Javadocs: NextPage<JavadocProps> = ({
  paper,
  velocity,
  waterfall,
}: JavadocProps) => {
  return (
    <>
      <SEO
        title="Javadocs"
        description="Find javadocs for our software – including Paper, Velocity, and Waterfall."
        keywords={["papermc", "paper", "javadocs", "velocity", "waterfall"]}
      />
      <header className="max-w-7xl flex flex-col items-center mx-auto px-4 pt-32 pb-16 lg:(pt-48 pb-26) gap-2">
        <h1 className="font-medium leading-normal lg:(text-5xl leading-normal) text-4xl">
          Javadocs
        </h1>
        <p className="text-xl text-center mb-6">
          {"You can find the javadocs for our software below:"}
        </p>
        <div className="grid md:grid-cols-3 lg:mt-6 gap-2 px-2 xl:gap-4">
          <SoftwarePreview
            id="paper"
            name="Paper"
            icon={PaperIcon}
            javadocs={paper.latestVersionGroup}
          />
          <SoftwarePreview
            id="velocity"
            name="Velocity"
            icon={VelocityIcon}
            javadocs={velocity.latestVersionGroup}
          />
          <SoftwarePreview
            id="waterfall"
            name="Waterfall"
            icon={WaterfallIcon}
            javadocs={waterfall.latestVersionGroup}
          />
        </div>
      </header>
    </>
  );
};

export default Javadocs;

export const getStaticProps: GetStaticProps<JavadocProps> = async () => {
  return {
    props: {
      paper: await getProjectDescriptor("paper"),
      velocity: await getProjectDescriptor("velocity"),
      waterfall: await getProjectDescriptor("waterfall"),
    },
    revalidate: 3600, // 1 hour
  };
};
