import styles from "styles/components/data/SoftwareBuildsTable.module.css";
import SoftwareBuildChanges from "~/components/data/SoftwareBuildChanges";
import { Build } from "~/service/types";
import { getVersionBuildDownloadURL } from "~/service/v2";
import { formatRelativeDate } from "~/util/time";

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
      <thead className="sticky top-0 bg-background-light-10 shadow-sm">
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
              <td>#{build.build}</td>
              <td>
                <SoftwareBuildChanges project={project} build={build} />
              </td>
              <td>{formatRelativeDate(new Date(build.time))}</td>
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
