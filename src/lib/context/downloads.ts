import type { GetStaticProps } from "next";
import { createContext } from "react";

import type { Build } from "@/lib/service/types";
import { getProject, getVersionBuilds } from "@/lib/service/v2";

export interface DownloadsContextProps {
  projectId: string;
  project?: ProjectDescriptor;
  builds?: Build[];
  version: string;
}

export interface ProjectDescriptor {
  name: string;
  latestStableVersion: string;
  latestExperimentalVersion: string;
  latestVersionGroup: string;
}

export interface ProjectProps {
  project: ProjectDescriptor;
}

export const DownloadsContext = createContext<DownloadsContextProps>({
  projectId: "paper",
  project: undefined,
  builds: undefined,
  version: "",
});

const isVersionStable = async (
  project: string,
  version: string
): Promise<boolean> => {
  const { builds } = await getVersionBuilds(project, version);
  for (let i = builds.length - 1; i >= 0; i--) {
    if (builds[i].channel === "default") return true;
  }

  return false;
};

const isVersionExperimentalStable = async (
  project: string,
  version: string
): Promise<boolean> => {
  const { builds } = await getVersionBuilds(project, version);
  for (let i = builds.length - 1; i >= 0; i--) {
    if (builds[i].channel === "experimental") return true;
  }

  return false;
};

export const getProjectProps = (id: string): GetStaticProps => {
  return async () => {
    const { project_name, versions, version_groups } = await getProject(id);

    let latestStableVersion = versions[versions.length - 1];
    let latestExperimentalVersion = null;
    for (let i = versions.length - 1; i >= 0; i--) {
      if (await isVersionStable(id, versions[i])) {
        latestStableVersion = versions[i];
        break;
      }
      if (
        !latestExperimentalVersion &&
        (await isVersionExperimentalStable(id, versions[i]))
      ) {
        latestExperimentalVersion = versions[i];
      }
    }

    const project = {
      name: project_name,
      latestStableVersion,
      latestExperimentalVersion,
      latestVersionGroup: version_groups[version_groups.length - 1],
    };

    return {
      props: {
        project,
      },
      revalidate: 600, // 10 minutes
    };
  };
};
