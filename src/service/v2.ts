import useSWR, { SWRResponse } from "swr";
import { Project, ProjectsResponse, VersionBuilds, VersionFamilyBuilds } from "~/service/types";

const API_ENDPOINT = "https://api.papermc.io/v2";

const fetcher = (path: string) =>
  fetch(API_ENDPOINT + path).then(res => res.json());

export const useProjects = (): SWRResponse<ProjectsResponse> =>
  useSWR("/projects", fetcher);

export const useProject = (project: string): SWRResponse<Project> =>
  useSWR(`/projects/${project}`, fetcher);

export const useVersionBuilds = (project: string, version: string): SWRResponse<VersionBuilds> =>
  useSWR(`/projects/${project}/versions/${version}/builds`);

export const useVersionFamilyBuilds = (project: string, family: string): SWRResponse<VersionFamilyBuilds> =>
  useSWR(`/projects/${project}/version_group/${family}/builds`);
