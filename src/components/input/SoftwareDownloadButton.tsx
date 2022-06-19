import DocumentDownloadIcon from "assets/icons/heroicons/document-download.svg";

import { useContext } from "react";
import { DownloadsContext } from "~/context/downloads";
import { getVersionBuildDownloadURL } from "~/service/v2";
import Skeleton from "~/components/data/Skeleton";

const SoftwareDownloadButton = () => {
  const { selectedProject, project, builds } = useContext(DownloadsContext);

  const latestBuild = builds && builds[builds.length - 1];

  return (
    <a
      role="button"
      className="rounded-lg px-8 py-4 flex flex-row items-center w-full md:w-100 bg-blue-500 transition-shadow text-white transition-color gap-8 hover:(bg-blue-600 shadow-md)"
      target="_blank"
      href={
        project &&
        latestBuild &&
        getVersionBuildDownloadURL(
          selectedProject,
          project.latestVersion,
          latestBuild.build,
          latestBuild.downloads["application"].name
        )
      }
      rel="noreferrer"
    >
      <div className="w-8 h-8">
        <DocumentDownloadIcon />
      </div>
      <div className="text-left">
        {project && builds && latestBuild ? (
          <>
            <span className="font-medium text-lg">
              {project.name} {project.latestVersion}
            </span>
            <p className="text-gray-100">
              {latestBuild && `Build #${latestBuild.build}`}
            </p>
          </>
        ) : (
          <>
            <Skeleton className="w-40 mb-2" />
            <Skeleton className="w-20" />
          </>
        )}
      </div>
    </a>
  );
};

export default SoftwareDownloadButton;
