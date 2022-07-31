import { ReactElement } from "react";
import { Build } from "~/service/types";
import Skeleton from "~/components/data/Skeleton";
import { getVersionBuildDownloadURL } from "~/service/v2";
import { formatRelativeDate } from "~/util/time";

export interface SoftwareBuildChangesProps {
  build: Build;
}

const SoftwareBuildChanges = ({
  build,
}: SoftwareBuildChangesProps): ReactElement => (
  <>
    {build.changes.map((change) => (
      <p key={change.commit}>{change.summary}</p>
    ))}
    {build.changes.length === 0 && <i className="text-gray-600">No changes</i>}
  </>
);

export default SoftwareBuildChanges;
