import Link from "next/link";
import type { FunctionComponent, ReactElement } from "react";

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
}

const SoftwareDownload = ({
  id,
  project,
  icon: Icon,
  description,
}: SoftwareDownloadProps & ProjectProps): ReactElement => {
  const { data: builds } = useVersionBuilds(id, project.latestVersion);

  return (
    <DownloadsContext.Provider
      value={{
        projectId: id,
        project,
        builds: builds?.builds,
      }}
    >
      <header className="max-w-7xl flex flex-row mx-auto px-4 pt-32 pb-26 lg:(pt-48 pb-46) gap-16">
        <div className="flex-1">
          <div className="flex flex-row mb-6 gap-4 items-center">
            <div className="w-12 h-12 rounded-lg bg-gray-800 p-3">
              {Icon && <Icon />}
            </div>
            <h1 className="font-medium text-xl">Downloads</h1>
          </div>
          <h2 className="font-medium leading-normal lg:(text-5xl leading-normal) text-4xl">
            Get {project.name}&nbsp;
            <span className="text-blue-600">{project.latestVersion}</span>
          </h2>
          <p className="text-xl mt-4">{description}</p>
          <div className="flex flex-row gap-4 mt-8">
            <SoftwareDownloadButton />
          </div>
        </div>
        <div className="flex-1 lg:flex hidden justify-end"></div>
      </header>
      <section id="builds" className="max-w-7xl mx-auto py-8">
        <h2 className="text-center text-xl font-medium">Recent builds</h2>
        <p className="text-center text-gray-800 dark:text-gray-200 text-lg mt-2 mb-8 px-4">
          Looking for recent builds - or changelog? We got you!
        </p>
        <SoftwareBuilds
          project={id}
          version={project.latestVersion}
          builds={builds?.builds}
        />
        <p className="mt-2 text-center text-gray-700 dark:text-gray-400">
          Looking for older builds? Try out our&nbsp;
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
