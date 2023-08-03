import clsx from "clsx";

import { useProject } from "@/lib/service/v2";

interface ProjectSubTreeProps {
  id: string;
  name: string;
}

const ProjectSubTree = ({
  id,
  name,
  selectedProject,
  selectedVersion,
  onSelect,
}: ProjectSubTreeProps & DownloadsTreeProps) => {
  const { data: project } = useProject(id);

  return (
    <>
      <div className="pl-3 py-1 rounded-md font-bold">
        {project?.project_name ?? name}
      </div>
      {project?.versions
        ?.slice()
        ?.reverse()
        ?.map((version) => (
          <button
            key={version}
            className={clsx(
              "pl-6 py-1 rounded-md hover:bg-blue-100 hover:dark:bg-gray-900 transition-colors text-gray-800 dark:text-gray-200 block w-full text-left",
              selectedProject === id &&
                selectedVersion === version &&
                "bg-blue-100 dark:bg-blue-900",
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
      <ProjectSubTree id="waterfall" name="Waterfall" {...props} />
    </nav>
  );
};

export default DownloadsTree;
