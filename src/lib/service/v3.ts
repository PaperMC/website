import type { SWRResponse } from "swr";
import useSWR from "swr";

import { swrNoAutoUpdateSettings } from "./api";

import type { Build, Project, ProjectsResponse } from "@/lib/service/types";

const API_ENDPOINT = "https://fill.papermc.io/v3";

const fetcher = (path: string) =>
  fetch(API_ENDPOINT + path).then((res) => res.json());

export const useProjects = (): SWRResponse<ProjectsResponse> =>
  useSWR("/projects", fetcher, swrNoAutoUpdateSettings);

export const useProject = (project: string): SWRResponse<Project> =>
  useSWR(`/projects/${project}`, fetcher, swrNoAutoUpdateSettings);

export const useVersionBuilds = (
  project: string,
  version: string,
): SWRResponse<Build[]> =>
  useSWR(
    `/projects/${project}/versions/${version}/builds`,
    fetcher,
    swrNoAutoUpdateSettings,
  );

// TODO: Better error handling?
const getJSON = <T>(path: string): Promise<T> => fetcher(path);

export const getProject = (project: string): Promise<Project> =>
  getJSON(`/projects/${project}`);

export const getVersionBuilds = (
  project: string,
  version: string,
): Promise<Build[]> =>
  getJSON(`/projects/${project}/versions/${version}/builds`);
