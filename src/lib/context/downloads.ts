import type { GetStaticProps } from "next";
import { createContext } from "react";

import type {
  HangarProjectListPagination,
  HangarProjectList,
} from "@/lib/service/hangar";
import { getHangarProjects } from "@/lib/service/hangar";
import type { Build } from "@/lib/service/types";
import { getProject, getVersionBuilds } from "@/lib/service/v2";

export interface DownloadsContextProps {
  projectId: string;
  project?: ProjectDescriptor;
  builds?: Build[];
  version: string;
  stable: boolean;
}

export interface ProjectDescriptor {
  name: string;
  latestStableVersion: string;
  latestExperimentalVersion: string | null;
  latestVersionGroup: string;
}

export interface ProjectProps {
  project: ProjectDescriptor;
}

export interface HangarProjectProps extends ProjectProps {
  hangarProjectListPagination: HangarProjectListPagination;
}

export const DownloadsContext = createContext<DownloadsContextProps>({
  projectId: "paper",
  project: undefined,
  builds: undefined,
  version: "",
  stable: true,
});

const isVersionStable = async (
  project: string,
  version: string,
): Promise<boolean> => {
  const { builds } = await getVersionBuilds(project, version);
  for (let i = builds.length - 1; i >= 0; i--) {
    if (builds[i].channel === "default") return true;
  }

  return false;
};

export const getProjectProps = (
  id: string,
  hangarProject: boolean = true,
): GetStaticProps => {
  return async () => {
    const { project_name, versions, version_groups } = await getProject(id);
    const hangarProjectList: HangarProjectList | null = hangarProject
      ? await getHangarProjects(id)
      : null;

    let latestStableVersion = versions[versions.length - 1];
    for (let i = versions.length - 1; i >= 0; i--) {
      if (await isVersionStable(id, versions[i])) {
        latestStableVersion = versions[i];
        break;
      }
    }

    const latestExperimentalVersion =
      latestStableVersion !== versions[versions.length - 1]
        ? versions[versions.length - 1]
        : null;

    const project: ProjectDescriptor = {
      name: project_name,
      latestStableVersion,
      latestExperimentalVersion,
      latestVersionGroup: version_groups[version_groups.length - 1],
    };

    return {
      props: {
        project,
        hangarProjectListPagination: hangarProjectList
          ? hangarProjectList.pagination
          : null,
      },
      revalidate: 600, // 10 minutes
    };
  };
};
