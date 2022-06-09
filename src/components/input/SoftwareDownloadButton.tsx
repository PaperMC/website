import DocumentDownloadIcon from "assets/icons/heroicons/document-download.svg";

import { useContext } from "react";
import { DownloadsContext } from "~/context/downloads";
import { getVersionBuildDownloadURL } from "~/service/v2";
import { formatRelativeDate } from "~/util/time";

const SoftwareDownloadButton = () => {
  const { selectedProject, project, builds } = useContext(DownloadsContext);

  const latestBuild = builds && builds[builds.length - 1];

  return (
    <a
      role="button"
      className="rounded-lg px-8 py-4 flex flex-row items-center w-full md:w-80 bg-primary-600 transition-shadow transition-color gap-8 hover:(bg-primary-800 shadow-md)"
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
        <span className="font-medium text-lg">
          {project && builds
            ? `${project.name} Build ${latestBuild?.build}`
            : "Loading..."}
        </span>
        <p className="text-gray-800">
          {latestBuild && formatRelativeDate(new Date(latestBuild.time))}
        </p>
      </div>
    </a>
  );
};

export default SoftwareDownloadButton;
