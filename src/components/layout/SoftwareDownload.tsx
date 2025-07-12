"use client";

import clsx from "clsx";
import Link from "next/link";
import type { ReactElement } from "react";
import { useState } from "react";

import FoliaIcon from "@/assets/brand/folia.svg";
import PaperIcon from "@/assets/brand/paper.svg";
import VelocityIcon from "@/assets/brand/velocity.svg";
import WaterfallIcon from "@/assets/brand/waterfall.svg";
import SoftwareBuilds from "@/components/data/SoftwareBuilds";
import SoftwareDownloadButton from "@/components/input/SoftwareDownloadButton";
import type { ProjectProps } from "@/lib/context/downloads";
import { useVersionBuilds } from "@/lib/service/hooks";

const ICONS = {
  paper: PaperIcon,
  velocity: VelocityIcon,
  folia: FoliaIcon,
  waterfall: WaterfallIcon,
} as const;

export interface SoftwareDownloadProps {
  id: string;
  description: ReactElement | string;
  experimentalWarning?: string;
  eol?: boolean;
}

const SoftwareDownload = ({
  id,
  project,
  description,
  experimentalWarning,
  eol,
}: SoftwareDownloadProps & ProjectProps) => {
  const [isStable, setStable] = useState(true);
  const version = isStable
    ? project.latestStableVersion
    : (project.latestExperimentalVersion ?? project.latestStableVersion);
  const { data: builds } = useVersionBuilds(id, version);
  const latestBuild = builds && builds[0];

  const toggleStable = () => {
    setStable(!isStable);
  };

  const Icon = ICONS[id as keyof typeof ICONS];

  return (
    <>
      <header className="max-w-7xl flex flex-row flex-wrap mx-auto px-4 pt-32 pb-16 lg:pt-48 lg:pb-26 gap-16">
        {eol && (
          <div className="text-center px-4 py-8 -mt-16 font-bold bg-red-400 dark:bg-red-500 shadow-md rounded-lg w-full">
            {project.name} has reached end of life! It is no longer maintained or supported.
          </div>
        )}
        <div className="flex-1">
          <div className="flex flex-row mb-6 gap-4 items-center">
            <div className="w-12 h-12 rounded-lg bg-gray-800 p-3">{Icon && <Icon />}</div>
            <h1 className="font-medium text-xl">Downloads</h1>
          </div>
          <h2 className="font-medium leading-normal lg:text-5xl lg:leading-normal text-4xl">
            Get {project.name}&nbsp;
            <span
              style={{
                color: `var(${eol ? "--channel-eol" : `--channel-${latestBuild?.channel.toLowerCase()}`})`,
              }}
            >
              {version}
            </span>
          </h2>
          <p className="text-xl mt-4">{isStable ? description : (experimentalWarning ?? description)}</p>
          <div className="flex flex-col gap-4 mt-8">
            <SoftwareDownloadButton projectId={id} project={project} build={latestBuild} version={version} eol={eol} />
            {project.latestExperimentalVersion && (
              <button
                className={clsx(
                  "rounded-lg flex flex-row w-full md:w-100 border text-white transition-border pl-5 py-3",
                  isStable
                    ? "dark:border-red-500 dark:text-red-400 border-red-900 text-red-700"
                    : "dark:border-blue-600 dark:text-blue-400 border-blue-900 text-blue-700",
                )}
                onClick={toggleStable}
              >
                {isStable ? "Toggle experimental builds for " : "Back to stable builds for "}
                {isStable ? project.latestExperimentalVersion : project.latestStableVersion}
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 lg:flex hidden justify-end"></div>
      </header>
      <section id="builds" className="max-w-7xl mx-auto py-8">
        <h2 className="text-center text-xl font-medium">Older builds</h2>
        <p className="text-center text-gray-800 dark:text-gray-200 text-lg mt-2 mb-8 px-4">
          Looking for older builds - or changelogs? We got you!&nbsp;
          <br />
          <span className="text-gray-700 dark:text-gray-400">
            Even older builds are available in our&nbsp;
            <Link href={`/downloads/all?project=${id}`} className="text-gray-700 dark:text-gray-400 underline">
              build explorer
            </Link>
            .
          </span>
        </p>
        <SoftwareBuilds project={id} version={version} builds={builds} eol={eol} />
      </section>
    </>
  );
};

export default SoftwareDownload;
