import useSWR, { SWRResponse } from "swr";

export interface Contributor {
  login: string;
  id: number;
  avatar_url: string;
  contributions: number;
}

const CONTRIBUTORS_URL =
  "https://api.github.com/repos/PaperMC/Paper/contributors?per_page=100";

const fetcher = async (
  url: string,
  page: number = 1
): Promise<Contributor[]> => {
  const response = await fetch(`${url}&page=${page}`);
  const data = await response.json();
  if (data.length < 100) return data;

  return [...data, ...(await fetcher(url, page + 1))];
};

export const useGitHubContributors = (): SWRResponse<Contributor[]> =>
  useSWR(CONTRIBUTORS_URL, fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
    revalidateOnReconnect: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    refreshInterval: 0,
  });
