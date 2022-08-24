import useSWR, { SWRResponse } from "swr";

import {
  Project,
  ProjectsResponse,
  VersionBuilds,
  VersionFamilyBuilds,
} from "@/lib/service/types";

const API_ENDPOINT = "https://api.papermc.io/v2";

const fetcher = (path: string) =>
  fetch(API_ENDPOINT + path).then((res) => res.json());

export const useProjects = (): SWRResponse<ProjectsResponse> =>
  useSWR("/projects", fetcher);

export const useProject = (project: string): SWRResponse<Project> =>
  useSWR(`/projects/${project}`, fetcher);

export const useVersionBuilds = (
  project: string,
  version: string
): SWRResponse<VersionBuilds> =>
  useSWR(`/projects/${project}/versions/${version}/builds`, fetcher);

export const useVersionFamilyBuilds = (
  project: string,
  family: string
): SWRResponse<VersionFamilyBuilds> =>
  useSWR(`/projects/${project}/version_group/${family}/builds`, fetcher);

// TODO: Better error handling?
const getJSON = <T>(path: string): Promise<T> => fetcher(path);

export const getProject = (project: string): Promise<Project> =>
  getJSON(`/projects/${project}`);

export const getVersionBuilds = (
  project: string,
  version: string
): Promise<VersionBuilds> =>
  getJSON(`/projects/${project}/versions/${version}/builds`);

export const getVersionBuildDownloadURL = (
  project: string,
  version: string,
  build: number,
  file: string
): string =>
  `${API_ENDPOINT}/projects/${project}/versions/${version}/builds/${build}/downloads/${file}`;
