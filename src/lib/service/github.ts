import type { SWRInfiniteResponse } from "swr/infinite";
import useSWRInfinite from "swr/infinite";

import { swrNoAutoUpdateSettings } from "./api";

export interface Contributor {
  login: string;
  id: number;
  avatar_url: string;
  contributions: number;
}

const CONTRIBUTORS_BASE_URL =
  "https://api.github.com/repos/PaperMC/Paper/contributors?per_page=100";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getURL = (pageIndex: number, previousPageData: any): string | null => {
  if (previousPageData && previousPageData.length < 100) return null;
  return `${CONTRIBUTORS_BASE_URL}&page=${pageIndex + 1}`;
};

export const useGitHubContributors = (): SWRInfiniteResponse<Contributor[]> =>
  useSWRInfinite(getURL, fetcher, swrNoAutoUpdateSettings);
