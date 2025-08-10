import type { SWRInfiniteResponse } from "swr/infinite";
import useSWRInfinite from "swr/infinite";

import { swrNoAutoUpdateSettings } from "./api";

export interface Contributor {
  login: string;
  id: number;
  avatar_url: string;
  contributions: number;
}

const CONTRIBUTORS_BASE_URL = "https://api.github.com/repos/PaperMC/Paper/contributors?per_page=100";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getURL = (pageIndex: number, previousPageData: any): string | null => {
  if (previousPageData && previousPageData.length < 100) return null;
  return `${CONTRIBUTORS_BASE_URL}&page=${pageIndex + 1}`;
};

export const useGitHubContributors = (): SWRInfiniteResponse<Contributor[]> =>
  useSWRInfinite(getURL, fetcher, swrNoAutoUpdateSettings);

export const getProjectRepository = (project: string, version: string): string => {
  if (project !== "paper") return `https://github.com/PaperMC/${project}`;
  if (version == "1.7.10") return "https://github.com/PaperMC/Paper-1.7";
  
  const baseVersion = [21, 4]; // 1.21.4 is after the hardfork
  const isBelowBaseVersion = version
    .replace(/^1\./, "")
    .split(".")
    .map(Number)
    .some((v, i) => v < (baseVersion[i] || 0));

  return isBelowBaseVersion ? "https://github.com/PaperMC/Paper-Archive" : "https://github.com/PaperMC/Paper";
};
