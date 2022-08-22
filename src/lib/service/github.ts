import useSWR, { SWRResponse } from "swr";

export interface Contributor {
  login: string;
  id: number;
  avatar_url: string;
  contributions: number;
}

const CONTRIBUTORS_URL =
  "https://api.github.com/repos/PaperMC/Paper/contributors?per_page=100";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useGitHubContributors = (): SWRResponse<Contributor[]> =>
  useSWR(CONTRIBUTORS_URL, fetcher);
