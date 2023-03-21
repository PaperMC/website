import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useContext, useState } from "react";

import CloneIcon from "@/assets/icons/fontawesome/clone-icon.svg";
import ChevronDownIcon from "@/assets/icons/heroicons/chevron-down.svg";
import DocumentDownloadIcon from "@/assets/icons/heroicons/document-download.svg";
import Skeleton from "@/components/data/Skeleton";
import { DownloadsContext } from "@/lib/context/downloads";
import { getVersionBuildDownloadURL } from "@/lib/service/v2";

const SoftwareDownloadButton = () => {
  const { projectId, project, builds, version, stable } =
    useContext(DownloadsContext);

  const latestBuild = builds && builds[builds.length - 1];
  const [copied, setCopied] = useState("");
  const [timeoutHandler, setTimeoutHandler] = useState<NodeJS.Timeout | null>(
    null
  );

  const updateCopied = (text: string) => {
    if (timeoutHandler) {
      clearTimeout(timeoutHandler);
    }
    setCopied(text);
    setTimeoutHandler(setTimeout(() => setCopied(""), 2000));
  };

  return (
    <Menu as="div" className="relative w-full">
      <div
        className={clsx(
          "rounded-lg flex flex-row w-full md:w-100 transition-shadow text-white transition-color hover:shadow-lg",
          stable
            ? "bg-blue-600 hover:bg-blue-500"
            : "bg-red-500 hover:bg-red-400"
        )}
      >
        <a
          className="flex flex-row flex-1 items-center gap-8 pl-5 py-3"
          href={
            project &&
            latestBuild &&
            getVersionBuildDownloadURL(
              projectId,
              project.latestStableVersion,
              latestBuild.build,
              latestBuild.downloads["application"].name
            )
          }
          rel="noreferrer"
          target="_blank"
        >
          <div className="w-8 h-8">
            <DocumentDownloadIcon />
          </div>
          <div className="text-left flex-1 border-r border-gray-300/50">
            {project && builds && latestBuild ? (
              <>
                <span className="font-medium text-lg">
                  {project.name} {version}
                </span>
                <p className="text-gray-100">
                  {latestBuild && `Build #${latestBuild.build}`}
                </p>
              </>
            ) : (
              <>
                <Skeleton className="w-40 mb-2" />
                <Skeleton className="w-20 h-5" />
              </>
            )}
          </div>
        </a>
        <Menu.Button aria-label="Other download variants">
          <ChevronDownIcon className="w-6 h-6 text-gray-200 mx-5" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 mt-2 origin-top-left rounded-md bg-background-light-10 shadow-lg divide-y divide-gray-200 border border-gray-200 w-full md:w-auto dark:(bg-background-dark-80 divide-gray-800 border-gray-800)">
          {latestBuild &&
            Object.entries(latestBuild.downloads).map(([name, download]) => (
              <Menu.Item key={name}>
                {() => (
                  <div className="hover:bg-blue-100 dark:hover:bg-gray-800 transition-colors">
                    <a
                      href={
                        project &&
                        latestBuild &&
                        getVersionBuildDownloadURL(
                          projectId,
                          version,
                          latestBuild.build,
                          download.name
                        )
                      }
                      rel="noreferrer"
                      target="_blank"
                    >
                      <div className="px-4 py-3">
                        <div className="font-medium">
                          {download.name}
                          {name === "application" && (
                            <span className="ml-2 text-xs rounded-full py-0.5 px-2 bg-yellow-200/80 text-yellow-800">
                              Recommended
                            </span>
                          )}
                          {copied === download.sha256 && (
                            <span className="ml-2 text-xs rounded-full py-0.5 px-2 bg-green-200/80 text-green-800">
                              Copied
                            </span>
                          )}
                        </div>
                        <div className="text-gray-700 dark:text-gray-300 text-xs">
                          {download.sha256}
                          <span
                            className="ml-2 h-6 w-6 inline-flex items-center justify-center"
                            onClick={(evt) => {
                              evt.preventDefault();
                              navigator.clipboard.writeText(download.sha256);
                              updateCopied(download.sha256);
                            }}
                          >
                            <CloneIcon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                          </span>
                        </div>
                      </div>
                    </a>
                  </div>
                )}
              </Menu.Item>
            ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default SoftwareDownloadButton;
