export interface Result {
  pagination: Pagination;
}

export interface Pagination {
  limit: number;
  offset: number;
  count: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const getJSON = <T>(path: string): Promise<T> => fetcher(path);

export const useHangarProjects = (platform: string): Promise<Result> =>
  getJSON(
    `https://hangar.papermc.io/api/v1/projects?orderWithRelevance=true&limit=1&offset=0&platform=${platform.toUpperCase()}`,
  );
