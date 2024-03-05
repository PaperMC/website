import clsx from "clsx";

import ArchiveIcon from "@/assets/icons/fontawesome/box-archive.svg";
import { useProject } from "@/lib/service/v2";

interface ProjectSubTreeProps {
  id: string;
  name: string;
  eol?: boolean;
}

const ProjectSubTree = ({
  id,
  name,
  selectedProject,
  selectedVersion,
  onSelect,
  eol,
}: ProjectSubTreeProps & DownloadsTreeProps) => {
  const { data: project } = useProject(id);

  return (
    <>
      <div className="pl-3 py-1 rounded-md font-bold flex gap-2 items-center">
        {project?.project_name ?? name}{" "}
        {eol && <ArchiveIcon className="fill-current h-4" />}
      </div>
      {project?.versions
        ?.slice()
        ?.reverse()
        ?.map((version) => (
          <button
            key={version}
            className={clsx(
              "pl-6 py-1 rounded-md transition-colors text-gray-800 dark:text-gray-200 block w-full text-left",
              eol
                ? "hover:bg-red-100 hover:dark:bg-red-900"
                : "hover:bg-blue-100 hover:dark:bg-gray-900",
              selectedProject === id &&
                selectedVersion === version &&
                (eol
                  ? "bg-red-100 dark:bg-red-900"
                  : "bg-blue-100 dark:bg-blue-900"),
            )}
            onClick={() => onSelect(id, version)}
          >
            {version}
          </button>
        ))}
    </>
  );
};

interface DownloadsTreeProps {
  selectedProject: string;
  selectedVersion: string;

  onSelect(project: string, version: string): void;
}

const DownloadsTree = (props: DownloadsTreeProps) => {
  return (
    <nav className="w-50 p-2 border-r border-gray-300 overflow-auto">
      <ProjectSubTree id="paper" name="Paper" {...props} />
      <ProjectSubTree id="velocity" name="Velocity" {...props} />
      <ProjectSubTree id="waterfall" name="Waterfall" eol {...props} />
    </nav>
  );
};

export default DownloadsTree;
