import type { SWRResponse } from "swr";
import useSWR from "swr";

import { cachedFetcher, enhancedFetcher, swrNoAutoUpdateSettings } from "./api";

import type {
  Project,
  ProjectsResponse,
  VersionBuilds,
  VersionFamilyBuilds,
} from "@/lib/service/types";

const API_ENDPOINT = "https://api.papermc.io/v2";

// Enhanced fetcher specific to PaperMC API
const apiFetcher = (path: string) => cachedFetcher(API_ENDPOINT + path);

export const useProjects = (): SWRResponse<ProjectsResponse> =>
  useSWR("/projects", apiFetcher, swrNoAutoUpdateSettings);

export const useProject = (project: string): SWRResponse<Project> =>
  useSWR(`/projects/${project}`, apiFetcher, swrNoAutoUpdateSettings);

export const useVersionBuilds = (
  project: string,
  version: string,
): SWRResponse<VersionBuilds> =>
  useSWR(
    `/projects/${project}/versions/${version}/builds`,
    apiFetcher,
    swrNoAutoUpdateSettings,
  );

export const useVersionFamilyBuilds = (
  project: string,
  family: string,
): SWRResponse<VersionFamilyBuilds> =>
  useSWR(
    `/projects/${project}/version_group/${family}/builds`,
    apiFetcher,
    swrNoAutoUpdateSettings,
  );

// Improved direct API calls with error handling
const getJSON = async <T>(path: string): Promise<T> => {
  try {
    return await enhancedFetcher(API_ENDPOINT + path);
  } catch (error) {
    console.error(`Error fetching from PaperMC API (${path}):`, error);
    throw error;
  }
};

export const getProject = (project: string): Promise<Project> =>
  getJSON(`/projects/${project}`);

export const getVersionBuilds = (
  project: string,
  version: string,
): Promise<VersionBuilds> =>
  getJSON(`/projects/${project}/versions/${version}/builds`);

export const getVersionBuildDownloadURL = (
  project: string,
  version: string,
  build: number,
  file: string,
): string =>
  `${API_ENDPOINT}/projects/${project}/versions/${version}/builds/${build}/downloads/${file}`;
