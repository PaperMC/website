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
        {formatCommitMessage(change.message, project, styles.issue)}
      </p>
    ))}
    {build.commits.length === 0 && <i className="text-gray-600">No changes</i>}
  </>
);

export default SoftwareBuildChanges;

const formatCommitMessage = (summary: string, project: string, highlightClass: string): ReactElement[] => {
  // Regex for issues (#123) and commit links
  const regex = /(@?https:\/\/github\.com\/[\w-]+\/[\w-]+\/commit\/([a-f0-9]{7,40}))|([^&])(#[0-9]+)/gim;
  let lastIndex = 0;
  let match;
  const elements: ReactElement[] = [];
  let key = 0;

  // Use regex to find all matches
  while ((match = regex.exec(summary)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      elements.push(<Fragment key={key++}>{summary.slice(lastIndex, match.index)}</Fragment>);
    }
    if (match[2]) {
      // Commit link
      const url = match[1].replace(/^@/, "");
      const shortHash = match[2].slice(0, 7);
      elements.push(
        <a key={key++} className={highlightClass} href={url} target="_blank" rel="noreferrer">
          {shortHash}
        </a>,
      );
    } else if (match[4]) {
      // Issue reference
      elements.push(
        <Fragment key={key++}>{match[3]}</Fragment>,
        <a
          key={key++}
          className={highlightClass}
          href={`https://github.com/PaperMC/${project}/issues/${match[4].slice(1)}`}
          target="_blank"
          rel="noreferrer"
        >
          {match[4]}
        </a>,
      );
    }
    lastIndex = regex.lastIndex;
  }
  // Add any remaining text
  if (lastIndex < summary.length) {
    elements.push(<Fragment key={key++}>{summary.slice(lastIndex)}</Fragment>);
  }
  return elements;
};
