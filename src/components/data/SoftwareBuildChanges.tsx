import type { ReactElement } from "react";
import { Fragment } from "react";

import { getProjectRepository } from "@/lib/service/github";
import type { Build } from "@/lib/service/types";
import styles from "@/styles/components/data/SoftwareBuildChanges.module.css";

export interface SoftwareBuildChangesProps {
  project: string;
  build: Build;
  version: string;
}

const SoftwareBuildChanges = ({ project, build, version }: SoftwareBuildChangesProps) => (
  <>
    {build.commits.map((change) => (
      <p key={change.sha} className={styles.commitMessage}>
        <a
          href={`${getProjectRepository(project, version)}/commit/${change.sha}`}
          className={styles.commit}
          rel="noreferrer"
          target="_blank"
        >
          {change.sha.slice(0, 7)}
        </a>
        {highlightIssues(change.message, project, styles.issue)}
      </p>
    ))}
    {build.commits.length === 0 && <i className="text-gray-600">No changes</i>}
  </>
);

export default SoftwareBuildChanges;

const highlightIssues = (summary: string, project: string, highlightClass: string): ReactElement[] => {
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
