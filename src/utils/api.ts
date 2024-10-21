import type { HangarProjectList } from "@/types/hangar";
import type { Project, ProjectDescriptor, ProjectsResponse, VersionBuilds, VersionFamilyBuilds } from "@/types/project";
import { fetchHangarProjects } from "./hangar";

const API_ENDPOINT = "https://api.papermc.io/v2";

export async function fetchProjects(): Promise<ProjectsResponse> {
  const response = await fetch(`${API_ENDPOINT}/projects`);
  return response.json();
}

export async function fetchProject(project: string): Promise<Project> {
  const response = await fetch(`${API_ENDPOINT}/projects/${project}`);
  return response.json();
}

export async function fetchVersionBuilds(project: string, version: string): Promise<VersionBuilds> {
  const response = await fetch(`${API_ENDPOINT}/projects/${project}/versions/${version}/builds`);
  return response.json();
}

export async function fetchVersionFamilyBuilds(project: string, family: string): Promise<VersionFamilyBuilds> {
  const response = await fetch(`${API_ENDPOINT}/projects/${project}/version_group/${family}/builds`);
  return response.json();
}

export const generateVersionBuildDownloadURL = (project: string, version: string, build: number, file: string): string =>
  `${API_ENDPOINT}/projects/${project}/versions/${version}/builds/${build}/downloads/${file}`;

export const isVersionStable = async (
  project: string,
  version: string,
): Promise<boolean> => {
  const { builds } = await fetchVersionBuilds(project, version);
  for (let i = builds.length - 1; i >= 0; i--) {
    if (builds[i].channel === "default") return true;
  }

  return false;
};

export async function aggregateProjectInfo(id: string, hangarProject: boolean) {
  const { project_name, versions, version_groups } = await fetchProject(id);
  const hangarProjectList: HangarProjectList | null = hangarProject ? await fetchHangarProjects(id) : null;

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
      project,
      hangarProjectList,
    }
}
