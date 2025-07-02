import type { Metadata } from "next";

import SoftwarePreview from "@/components/data/SoftwarePreview";
import { getProject } from "@/lib/service/fill";

export const metadata: Metadata = {
  title: "Javadocs",
  description:
    "Find javadocs for our software – including Paper, Folia, Velocity, and Waterfall.",
  keywords: ["papermc", "paper", "folia", "javadocs", "velocity", "waterfall"],
};

export const revalidate = 3600; // 1 hour

function stringToSemver(version: string): string {
  // We may be passed something like 3.4.0-SNAPSHOT, so we need the 3.4.0
  return version.match(/(\d+\.\d+\.\d+)/)?.[0] ?? version;
}

export default async function JavadocsPage() {
  const [paperProject, foliaProject, velocityProject, waterfallProject] =
    await Promise.all([
      getProject("paper").catch(() => ({ versions: {} })),
      getProject("folia").catch(() => ({ versions: {} })),
      getProject("velocity").catch(() => ({ versions: {} })),
      getProject("waterfall").catch(() => ({ versions: {} })),
    ]);

  const paperVersion = Object.values(paperProject.versions).flat()[0];
  const foliaVersion = Object.keys(foliaProject.versions)[0]; // In Folia's case Javadocs are only available for major versions
  const velocityVersion = stringToSemver(
    Object.values(velocityProject.versions).flat()[0],
  ); // Velocity's JDs don't have the -SNAPSHOT suffix (but we also can't use the version group)
  const waterfallVersion = Object.values(waterfallProject.versions).flat()[0];

  return (
    <>
      <header className="max-w-7xl flex flex-col items-center mx-auto px-4 pt-32 pb-16 lg:pt-48 lg:pb-26 gap-2">
        <h1 className="font-medium leading-normal lg:text-5xl lg:leading-normal text-4xl">
          Javadocs
        </h1>
        <p className="text-xl text-center mb-6">
          You can find the javadocs for our software below:
        </p>
        <div className="grid md:grid-cols-4 lg:mt-6 gap-2 px-2 xl:gap-4">
          <SoftwarePreview id="paper" name="Paper" javadocs={paperVersion} />
          <SoftwarePreview id="folia" name="Folia" javadocs={foliaVersion} />
          <SoftwarePreview
            id="velocity"
            name="Velocity"
            javadocs={velocityVersion}
          />
          <SoftwarePreview
            id="waterfall"
            name="Waterfall"
            javadocs={waterfallVersion}
          />
        </div>
      </header>
    </>
  );
}
