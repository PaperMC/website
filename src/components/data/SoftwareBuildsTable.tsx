import SoftwareBuildChanges from "@/components/data/SoftwareBuildChanges";
import type { Build } from "@/lib/service/types";
import { getVersionBuildDownloadURL } from "@/lib/service/v2";
import { formatRelativeDate, formatISODateTime } from "@/lib/util/time";
import styles from "@/styles/components/data/SoftwareBuildsTable.module.css";

export interface SoftwareBuildsTableProps {
  project: string;
  version: string;
  builds: Build[];
}

const SoftwareBuildsTable = ({
  project,
  version,
  builds,
}: SoftwareBuildsTableProps) => {
  return (
    <table className="w-full relative">
      <thead className="sticky top-0 bg-background-light-10 dark:bg-background-dark-90 shadow-sm">
        <tr className={styles.header}>
          <th>Build</th>
          <th>Changelog</th>
          <th>Timestamp</th>
          <th>Download</th>
        </tr>
      </thead>
      <tbody className={styles.body}>
        {builds
          .slice()
          .reverse()
          .map((build) => (
            <tr key={build.build}>
              <td>
                <span
                  className={
                    "rounded-full py-2 px-3 min-w-16 " +
                    (build.channel === "experimental"
                      ? "bg-red-500"
                      : "bg-gray-800")
                  }
                >
                  #{build.build}
                </span>
              </td>
              <td>
                <SoftwareBuildChanges project={project} build={build} />
              </td>
              <td title={formatISODateTime(new Date(build.time))}>
                {formatRelativeDate(new Date(build.time))}
              </td>
              <td>
                {Object.entries(build.downloads).map(([name, download]) => (
                  <a
                    key={name}
                    href={getVersionBuildDownloadURL(
                      project,
                      version,
                      build.build,
                      download.name
                    )}
                    rel="noreferrer"
                    target="_blank"
                    className={styles.download}
                  >
                    {name}
                  </a>
                ))}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default SoftwareBuildsTable;
