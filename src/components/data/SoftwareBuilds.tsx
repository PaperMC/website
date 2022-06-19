import { ReactElement } from "react";
import { Build } from "~/service/types";
import Skeleton from "~/components/data/Skeleton";
import { getVersionBuildDownloadURL } from "~/service/v2";

export interface SoftwareBuildsProps {
  project: string;
  version: string;
  builds?: Build[];
}

const SoftwareBuilds = ({
  project,
  version,
  builds,
}: SoftwareBuildsProps): ReactElement => (
  <div className="flex flex-col gap-4">
    {builds &&
      builds
        .slice()
        .reverse()
        .slice(1, 6)
        .map((build) => (
          <div className="flex flex-row items-start" key={build.build}>
            <a
              role="button"
              href={getVersionBuildDownloadURL(
                project,
                version,
                build.build,
                build.downloads["application"].name
              )}
              rel="noreferrer"
              target="_blank"
              className="bg-gray-800 text-gray-100 text-sm text-center font-medium rounded-full p-2 min-w-16 mr-4"
            >
              #{build.build}
            </a>
            <div className="flex flex-col mt-1 text-gray-900">
              {build.changes.map((change) => (
                <p key={change.commit}>{change.summary}</p>
              ))}
            </div>
          </div>
        ))}
    {!builds &&
      [...Array(5)].map((_, k) => (
        <div className="flex flex-row items-start w-full" key={k}>
          <div className="bg-gray-800 rounded-full p-2 min-w-16 mr-4 ">
            <Skeleton className="h-5" />
          </div>
          <Skeleton className="mt-1 flex-grow" />
        </div>
      ))}
  </div>
);

export default SoftwareBuilds;
