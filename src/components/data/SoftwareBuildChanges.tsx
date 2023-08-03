import type { ReactElement } from "react";
import { Fragment } from "react";

import type { Build } from "@/lib/service/types";
import styles from "@/styles/components/data/SoftwareBuildChanges.module.css";

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
        {highlightIssues(change.summary, project, styles.issue)}
      </p>
    ))}
    {build.changes.length === 0 && <i className="text-gray-600">No changes</i>}
  </>
);

export default SoftwareBuildChanges;

const highlightIssues = (
  summary: string,
  project: string,
  highlightClass: string,
): JSX.Element[] => {
  return summary.split(/([^&])(#[0-9]+)/gm).map((part: string, i: number) => {
    if (!part.match(/#[0-9]+/)) {
      return <Fragment key={i}>{part}</Fragment>;
    }

    return (
      <a
        key={i}
        className={highlightClass}
        href={`https://github.com/PaperMC/${project}/issues/${part.slice(1)}`}
        target="_blank"
        rel="noreferrer"
      >
        {part}
      </a>
    );
  });
};
