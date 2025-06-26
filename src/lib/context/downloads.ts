import type { GetStaticProps } from "next";
import { createContext } from "react";

import type {
  HangarProjectListPagination,
  HangarProjectList,
} from "@/lib/service/hangar";
import { getHangarProjects } from "@/lib/service/hangar";
import type { Build } from "@/lib/service/types";
import { getProject, getVersionBuilds } from "@/lib/service/v3";

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
  const builds = await getVersionBuilds(project, version);
  for (let i = builds.length - 1; i >= 0; i--) {
    if (builds[i].channel === "STABLE") return true;
  }

  return false;
};

export const getProjectProps = (
  id: string,
  hangarProject: boolean = true,
): GetStaticProps => {
  return async () => {
    const {
      project: { id: projectId },
      versions,
    } = await getProject(id);
    const hangarProjectList: HangarProjectList | null = hangarProject
      ? await getHangarProjects(id)
      : null;
    const flattenedVersions = Object.values(versions).flat().reverse();
    let latestStableVersion = flattenedVersions[flattenedVersions.length - 1];
    for (let i = flattenedVersions.length - 1; i >= 0; i--) {
      if (await isVersionStable(id, flattenedVersions[i])) {
        latestStableVersion = flattenedVersions[i];
        break;
      }
    }

    const latestExperimentalVersion =
      latestStableVersion !== flattenedVersions[flattenedVersions.length - 1]
        ? flattenedVersions[flattenedVersions.length - 1]
        : null;

    const project: ProjectDescriptor = {
      name: projectId,
      latestStableVersion,
      latestExperimentalVersion,
      latestVersionGroup: Object.keys(versions)[0],
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
