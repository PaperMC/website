import { ReactElement } from "react";

import styles from "styles/components/data/SoftwareBuildChanges.module.css";
import { Build } from "~/service/types";

export interface SoftwareBuildChangesProps {
  project: string;
  build: Build;
}

const SoftwareBuildChanges = ({
  project,
  build,
}: SoftwareBuildChangesProps): ReactElement => (
  <>
    {build.changes.map((change) => (
      <p key={change.commit}>
        <a
          href={`https://github.com/PaperMC/${project}/commit/${change.commit}`}
          className={styles.commit}
          rel="noreferrer"
          target="_blank"
        >
          {change.commit.slice(0, 7)}
        </a>
        {change.summary}
      </p>
    ))}
    {build.changes.length === 0 && <i className="text-gray-600">No changes</i>}
  </>
);

export default SoftwareBuildChanges;
