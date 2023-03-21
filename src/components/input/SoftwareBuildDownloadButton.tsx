import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useState } from "react";

import CloneIcon from "@/assets/icons/fontawesome/clone-icon.svg";
import ChevronDownIcon from "@/assets/icons/heroicons/chevron-down.svg";
import DocumentDownloadIcon from "@/assets/icons/heroicons/document-download.svg";
import type { BuildDownload } from "@/lib/service/types";
import { getVersionBuildDownloadURL } from "@/lib/service/v2";

interface SoftwareBuildDownloadButtonProps {
  project: string;
  version: string;
  build: number;
  downloads: Record<string, BuildDownload>;
  stable: boolean;
}

const SoftwareBuildDownloadButton = ({
  project,
  version,
  build,
  downloads,
  stable,
}: SoftwareBuildDownloadButtonProps) => {
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
          "rounded-lg flex flex-row items-center w-min transition-shadow text-white transition-color hover:shadow-lg",
          stable
            ? "bg-blue-600 hover:bg-blue-500"
            : "bg-red-500 hover:bg-red-400"
        )}
      >
        {/* eslint-disable-next-line react/jsx-no-target-blank */}
        <a
          className="flex flex-row flex-1 items-center gap-1 pl-1 py-1"
          href={getVersionBuildDownloadURL(
            project,
            version,
            build,
            downloads["application"].name
          )}
          target="_blank"
        >
          <div className="w-5 h-5">
            <DocumentDownloadIcon />
          </div>
          <div className="text-xs border-r pr-1 border-gray-300/50">
            Download
          </div>
        </a>
        <Menu.Button aria-label="Other download variants" className={"h-4"}>
          <ChevronDownIcon className="w-4 h-4 text-gray-200 mx-1" />
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
        <Menu.Items className="absolute right-0 z-1 mt-2 origin-top-left rounded-md bg-background-light-10 shadow-lg divide-y divide-gray-200 border border-gray-200 w-full md:w-max dark:(bg-background-dark-80 divide-gray-800 border-gray-800)">
          {Object.entries(downloads).map(([name, download]) => (
            <Menu.Item key={name}>
              {() => (
                <div className="hover:bg-blue-100 dark:hover:bg-gray-800 transition-colors">
                  {/* eslint-disable-next-line react/jsx-no-target-blank */}
                  <a
                    href={getVersionBuildDownloadURL(
                      project,
                      version,
                      build,
                      download.name
                    )}
                    target="_blank"
                  >
                    <div className="px-2 py-1">
                      <div className="font-medium text-sm">
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
                      <div className="text-gray-700 dark:text-gray-300 text-xs mt-1 flex items-center">
                        <span>{download.sha256}</span>
                        <span
                          className="ml-1 h-4 w-4"
                          onClick={async (evt) => {
                            evt.preventDefault();
                            await navigator.clipboard.writeText(
                              download.sha256
                            );
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

export default SoftwareBuildDownloadButton;
