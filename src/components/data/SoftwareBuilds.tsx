import clsx from "clsx";

import DownloadIcon from "@/assets/icons/heroicons/document-download.svg";
import Skeleton from "@/components/data/Skeleton";
import SoftwareBuildChanges from "@/components/data/SoftwareBuildChanges";
import type { Build } from "@/lib/service/types";
import { formatISODateTime, formatRelativeDate } from "@/lib/util/time";

export interface SoftwareBuildsProps {
  project: string;
  version: string;
  builds?: Build[];
  eol?: boolean;
}

const SoftwareBuilds = ({ project, version, builds, eol }: SoftwareBuildsProps) => (
  <div className="flex flex-col gap-1">
    {builds &&
      builds.slice(0, 10).map((build) => (
        <div
          className="flex flex-row items-center hover:bg-blue-100 dark:hover:bg-gray-900 px-4 py-2 rounded-lg transition-colors"
          key={build.id}
        >
          {/* eslint-disable-next-line react/jsx-no-target-blank */}
          <a
            role="button"
            href={build.downloads["server:default"].url}
            target="_blank"
            className={clsx(
              "text-gray-100 text-sm text-center font-medium rounded-full p-2 min-w-16 mr-4 inline-flex items-center gap-1",
              build.channel === "STABLE" && !eol ? "bg-gray-800" : "bg-red-500",
            )}
          >
            <DownloadIcon className="w-4 h-4" />#{build.id}
          </a>
          <div className="flex-1 flex flex-col text-gray-900 dark:text-gray-200 min-w-0">
            <SoftwareBuildChanges project={project} build={build} version={version} />
          </div>
          <div
            className="hidden md:block text-gray-500 dark:text-gray-300 mt-1 ml-2"
            title={formatISODateTime(new Date(build.time))}
          >
            {formatRelativeDate(new Date(build.time))}
          </div>
        </div>
      ))}
    {!builds &&
      [...Array(5)].map((_, k) => (
        <div className="flex flex-row items-start w-full" key={k}>
          <div className="bg-gray-800 rounded-full p-2 min-w-16 mr-4 ">
            <Skeleton className="h-5" />
          </div>
          <Skeleton className="mt-1 grow" />
        </div>
      ))}
  </div>
);

export default SoftwareBuilds;
