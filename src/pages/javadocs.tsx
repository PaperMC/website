import type { NextPage, GetStaticProps } from "next";

import FoliaIcon from "@/assets/brand/folia.svg";
import PaperIcon from "@/assets/brand/paper.svg";
import VelocityIcon from "@/assets/brand/velocity.svg";
import WaterfallIcon from "@/assets/brand/waterfall.svg";
import SoftwarePreview from "@/components/data/SoftwarePreview";
import SEO from "@/components/util/SEO";
import { getProject } from "@/lib/service/fill";

interface JavadocProps {
  paperVersion: string;
  foliaVersion: string;
  velocityVersion: string;
  waterfallVersion: string;
}

const Javadocs: NextPage<JavadocProps> = ({
  paperVersion,
  foliaVersion,
  velocityVersion,
  waterfallVersion,
}: JavadocProps) => {
  return (
    <>
      <SEO
        title="Javadocs"
        description="Find javadocs for our software – including Paper, Folia, Velocity, and Waterfall."
        keywords={[
          "papermc",
          "paper",
          "folia",
          "javadocs",
          "velocity",
          "waterfall",
        ]}
        canonical="/javadocs"
      />
      <header className="max-w-7xl flex flex-col items-center mx-auto px-4 pt-32 pb-16 lg:pt-48 lg:pb-26 gap-2">
        <h1 className="font-medium leading-normal lg:text-5xl lg:leading-normal text-4xl">
          Javadocs
        </h1>
        <p className="text-xl text-center mb-6">
          {"You can find the javadocs for our software below:"}
        </p>
        <div className="grid md:grid-cols-4 lg:mt-6 gap-2 px-2 xl:gap-4">
          <SoftwarePreview
            id="paper"
            name="Paper"
            icon={PaperIcon}
            javadocs={paperVersion}
          />
          <SoftwarePreview
            id="folia"
            name="Folia"
            icon={FoliaIcon}
            javadocs={foliaVersion}
          />
          <SoftwarePreview
            id="velocity"
            name="Velocity"
            icon={VelocityIcon}
            javadocs={velocityVersion}
          />
          <SoftwarePreview
            id="waterfall"
            name="Waterfall"
            icon={WaterfallIcon}
            javadocs={waterfallVersion}
          />
        </div>
      </header>
    </>
  );
};

export default Javadocs;

function stringToSemver(version: string): string {
  // We may be passed something like 3.4.0-SNAPSHOT, so we need the 3.4.0
  return version.match(/(\d+\.\d+\.\d+)/)?.[0] ?? version;
}

export const getStaticProps: GetStaticProps<JavadocProps> = async () => {
  const { versions: paper_groups } = await getProject("paper");
  const { versions: folia_groups } = await getProject("folia");
  const { versions: velocity_groups } = await getProject("velocity");
  const { versions: waterfall_groups } = await getProject("waterfall");
  return {
    props: {
      paperVersion: Object.values(paper_groups).flat()[0],
      foliaVersion: Object.keys(folia_groups)[0], // In Folia's case Javadocs are only available for major versions
      velocityVersion: stringToSemver(Object.values(velocity_groups).flat()[0]), // Velocity's JDs don't have the -SNAPSHOT suffix (but we also can't use the version group)
      waterfallVersion: Object.values(waterfall_groups).flat()[0],
    },
    revalidate: 3600, // 1 hour
  };
};
