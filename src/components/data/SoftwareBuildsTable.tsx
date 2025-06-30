import clsx from "clsx";

import SoftwareDownloadButton from "../input/SoftwareDownloadButton";

import SoftwareBuildChanges from "@/components/data/SoftwareBuildChanges";
import type { Build } from "@/lib/service/types";
import { formatISODateTime, formatRelativeDate } from "@/lib/util/time";
import styles from "@/styles/components/data/SoftwareBuildsTable.module.css";

export interface SoftwareBuildsTableProps {
  project: string;
  version: string;
  builds: Build[];
  eol?: boolean;
}

const SoftwareBuildsTable = ({ project, version, builds, eol }: SoftwareBuildsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full relative">
        <thead className="sticky top-0 z-40 bg-background-light-10 dark:bg-background-dark-90 shadow-xs">
          <tr className={styles.header}>
            <th>Build</th>
            <th>Changelog</th>
            <th>Timestamp</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody className={styles.body}>
          {builds.map((build) => (
            <tr key={build.id}>
              <td>
                <span
                  className={clsx("text-sm font-medium text-gray-100 rounded-full py-2 px-3 min-w-16")}
                  style={{
                    backgroundColor: `var(${eol ? "--channel-eol" : `--channel-${build.channel.toLowerCase()}`})`,
                  }}
                >
                  #{build.id}
                </span>
              </td>
              <td>
                <SoftwareBuildChanges project={project} build={build} version={version} />
              </td>
              <td className={"whitespace-nowrap"} title={formatISODateTime(new Date(build.time))}>
                {formatRelativeDate(new Date(build.time))}
              </td>
              <td className={"gap-1"}>
                <SoftwareDownloadButton projectId={project} version={version} build={build} compact eol={eol} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SoftwareBuildsTable;
