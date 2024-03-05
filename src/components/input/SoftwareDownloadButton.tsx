import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useState } from "react";

import CloneIcon from "@/assets/icons/fontawesome/clone-icon.svg";
import ChevronDownIcon from "@/assets/icons/heroicons/chevron-down.svg";
import DocumentDownloadIcon from "@/assets/icons/heroicons/document-download.svg";
import Skeleton from "@/components/data/Skeleton";
import type { ProjectDescriptor } from "@/lib/context/downloads";
import type { Build } from "@/lib/service/types";
import { getVersionBuildDownloadURL } from "@/lib/service/v2";
import styles from "@/styles/components/input/SoftwareDownloadButton.module.css";

export interface SoftwareDownloadButtonProps {
  projectId: string;
  project?: ProjectDescriptor;
  build?: Build;
  version: string;
  stable: boolean;
  compact?: boolean;
  eol?: boolean;
}

const SoftwareDownloadButton = ({
  projectId,
  project,
  build,
  version,
  stable,
  compact,
  eol,
}: SoftwareDownloadButtonProps) => {
  const [copied, setCopied] = useState("");
  const [timeoutHandler, setTimeoutHandler] = useState<NodeJS.Timeout | null>(
    null,
  );

  const updateCopied = (text: string) => {
    if (timeoutHandler) {
      clearTimeout(timeoutHandler);
    }
    setCopied(text);
    setTimeoutHandler(setTimeout(() => setCopied(""), 2000));
  };

  return (
    <Menu as="div" className="relative w-max">
      <div
        className={clsx(
          "rounded-lg flex flex-row ransition-shadow text-white transition-color hover:shadow-lg",
          !compact && "w-full md:w-100",
          stable && !eol
            ? "bg-blue-600 hover:bg-blue-500"
            : "bg-red-500 hover:bg-red-400",
        )}
      >
        {/* eslint-disable-next-line react/jsx-no-target-blank */}
        <a
          className={clsx(
            "flex flex-row flex-1 items-center",
            compact ? "gap-2 pl-2 leading-0 py-1" : "gap-8 pl-5 py-3",
          )}
          href={
            projectId &&
            build &&
            getVersionBuildDownloadURL(
              projectId,
              version,
              build.build,
              build.downloads["application"].name,
            )
          }
          target="_blank"
        >
          <div className={compact ? "w-4 h-4" : "w-8 h-8"}>
            <DocumentDownloadIcon />
          </div>
          <div className="text-left flex-1 border-r border-gray-300/50 pr-3">
            {compact ? (
              <span className="font-medium text-sm">Download</span>
            ) : projectId && build ? (
              <>
                <span className="font-medium text-lg">
                  {project?.name ?? projectId} {version}
                </span>
                <p className="text-gray-100">
                  {build && `Build #${build.build}`}
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
        <Menu.Button aria-label="Other download variants" className="leading-0">
          <ChevronDownIcon
            className={clsx(
              "text-gray-200",
              compact ? "w-4 h-4 mx-3" : "w-6 h-6 mx-5",
            )}
          />
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
        <Menu.Items
          className={clsx(
            styles.menu,
            compact
              ? "origin-top-right right-0"
              : "origin-top-left left-0 w-full md:w-auto",
          )}
        >
          {build &&
            Object.entries(build.downloads).map(([name, download]) => (
              <Menu.Item key={name}>
                {() => (
                  <div className="hover:bg-blue-100 dark:hover:bg-gray-800 transition-colors">
                    {/* eslint-disable-next-line react/jsx-no-target-blank */}
                    <a
                      href={
                        projectId &&
                        build &&
                        getVersionBuildDownloadURL(
                          projectId,
                          version,
                          build.build,
                          download.name,
                        )
                      }
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
                        <div className="text-gray-700 dark:text-gray-300 text-xs inline-flex items-center w-full">
                          <span className="truncate">{download.sha256}</span>
                          <button
                            className="ml-2 h-6 w-6"
                            onClick={(evt) => {
                              evt.preventDefault();
                              navigator.clipboard.writeText(download.sha256);
                              updateCopied(download.sha256);
                            }}
                          >
                            <CloneIcon className="h-4 w-4" />
                          </button>
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
