export interface HangarProjectList {
  pagination: Pagination;
}

export interface Pagination {
  limit: number;
  offset: number;
  count: number;
}

export const getHangarProjects = (
  platform: string,
): Promise<HangarProjectList> =>
  fetch(
    `https://hangar.papermc.io/api/v1/projects?orderWithRelevance=true&limit=1&offset=0&platform=${platform.toUpperCase()}`,
  ).then((res) => res.json());
