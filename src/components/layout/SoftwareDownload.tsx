import Link from "next/link";
import type { FunctionComponent, ReactElement } from "react";
import { useState } from "react";

import SoftwareBuilds from "@/components/data/SoftwareBuilds";
import SoftwareDownloadButton from "@/components/input/SoftwareDownloadButton";
import type { ProjectProps } from "@/lib/context/downloads";
import { DownloadsContext } from "@/lib/context/downloads";
import { useVersionBuilds } from "@/lib/service/v2";

export interface SoftwareDownloadProps {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: FunctionComponent<any>;
  description: string;
  experimentalWarning?: string;
}

const SoftwareDownload = ({
  id,
  project,
  icon: Icon,
  description,
  experimentalWarning,
}: SoftwareDownloadProps & ProjectProps): ReactElement => {
  const { data: stableBuilds } = useVersionBuilds(
    id,
    project.latestStableVersion
  );
  // todo how do I avoid this call when latestExperimentalVersion is null?
  const { data: experimentalBuilds } = useVersionBuilds(
    id,
    project.latestExperimentalVersion
  );

  const [isStable, setStable] = useState(true);
  const builds = isStable ? stableBuilds : experimentalBuilds;
  const version = isStable
    ? project.latestStableVersion
    : project.latestExperimentalVersion;

  const toggleStable = () => {
    setStable(!isStable);
  };

  return (
    <DownloadsContext.Provider
      value={{
        projectId: id,
        project,
        builds: builds?.builds,
        version,
        stable: isStable,
      }}
    >
      <header className="max-w-7xl flex flex-row mx-auto px-4 pt-32 pb-16 lg:(pt-48 pb-26) gap-16">
        <div className="flex-1">
          <div className="flex flex-row mb-6 gap-4 items-center">
            <div className="w-12 h-12 rounded-lg bg-gray-800 p-3">
              {Icon && <Icon />}
            </div>
            <h1 className="font-medium text-xl">Downloads</h1>
          </div>
          <h2 className="font-medium leading-normal lg:(text-5xl leading-normal) text-4xl">
            Get {project.name}&nbsp;
            <span className={isStable ? "text-blue-600" : "text-red-500"}>
              {version}
            </span>
          </h2>
          <p className="text-xl mt-4">
            {isStable ? description : experimentalWarning}
          </p>
          <div className="flex flex-col gap-4 mt-8">
            <SoftwareDownloadButton />
            {isStable && project.latestExperimentalVersion && (
              <button
                className="rounded-lg flex flex-row w-full md:w-100 bg-red-500 transition-shadow text-white transition-color hover:shadow-lg pl-5 py-3"
                onClick={toggleStable}
              >
                Toggle experimental builds for&nbsp;
                {project.latestExperimentalVersion}
              </button>
            )}
            {!isStable && project.latestExperimentalVersion && (
              <button
                className="rounded-lg flex flex-row w-full md:w-100 bg-blue-600 transition-shadow text-white transition-color hover:shadow-lg pl-5 py-3"
                onClick={toggleStable}
              >
                Back to stable builds for&nbsp;
                {project.latestStableVersion}
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 lg:flex hidden justify-end"></div>
      </header>
      <section id="builds" className="max-w-7xl mx-auto py-8">
        <h2 className="text-center text-xl font-medium">Older builds</h2>
        <p className="text-center text-gray-800 dark:text-gray-200 text-lg mt-2 mb-8 px-4">
          Looking for older builds - or changelog? We got you!
        </p>
        <SoftwareBuilds
          project={id}
          version={version}
          builds={builds?.builds}
        />
        <p className="mt-10 text-center text-gray-700 dark:text-gray-400">
          Looking for even older builds? Try out our&nbsp;
          <Link href="/downloads/all" passHref>
            <a className="text-gray-700 dark:text-gray-400 underline">
              build explorer
            </a>
          </Link>
        </p>
      </section>
    </DownloadsContext.Provider>
  );
};

export default SoftwareDownload;
