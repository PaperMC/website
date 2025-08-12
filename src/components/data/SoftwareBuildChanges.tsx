import type { ReactElement } from "react";
import { Fragment } from "react";

import { getProjectRepository } from "@/lib/service/github";
import type { Build } from "@/lib/service/types";
import styles from "@/styles/components/data/SoftwareBuildChanges.module.css";

export interface SoftwareBuildChangesProps {
  project: string;
  projectName?: string;
  build: Build;
  version: string;
}

const SoftwareBuildChanges = ({ project, projectName, build, version }: SoftwareBuildChangesProps) => (
  <>
    {build.commits.map((change) => {
      const [firstLine, ...restLines] = change.message.split(/\r?\n/);
      const hasAdditionalContent = restLines.length > 0;
      const fullMessage = hasAdditionalContent ? change.message : undefined;

      return (
        <p key={change.sha} className={styles.commitMessage}>
          <a
            href={`${getProjectRepository(project, version, projectName)}/commit/${change.sha}`}
            className={styles.commit}
            rel="noreferrer"
            target="_blank"
          >
            {change.sha.slice(0, 7)}
          </a>
          <span title={fullMessage}>{formatCommitMessage(firstLine, project, styles.issue, projectName)}</span>
        </p>
      );
    })}
    {build.commits.length === 0 && <i className="text-gray-600">No changes</i>}
  </>
);

export default SoftwareBuildChanges;

const formatCommitMessage = (
  summary: string,
  project: string,
  highlightClass: string,
  projectName?: string,
): ReactElement[] => {
  // Regex for issues (#123) and commit links
  const regex = /(@?https:\/\/github\.com\/[\w-]+\/[\w-]+\/commit\/([a-f0-9]{7,40}))|([^&])(#[0-9]+)/gim;
  let key = 0;
  const trimmedSummary = summary.replace(/[\r\n]+$/g, "");
  const elements: ReactElement[] = [];
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(trimmedSummary)) !== null) {
    if (match.index > lastIndex) {
      elements.push(<Fragment key={key++}>{trimmedSummary.slice(lastIndex, match.index)}</Fragment>);
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
      elements.push(
        <Fragment key={key++}>{match[3]}</Fragment>,
        <a
          key={key++}
          className={highlightClass}
          href={`https://github.com/PaperMC/${projectName || project}/issues/${match[4].slice(1)}`}
          target="_blank"
          rel="noreferrer"
        >
          {match[4]}
        </a>,
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < trimmedSummary.length) {
    elements.push(<Fragment key={key++}>{trimmedSummary.slice(lastIndex)}</Fragment>);
  }
  return elements;
};
