export interface HangarProjectList {
  pagination: HangarProjectListPagination;
}

export interface HangarProjectListPagination {
  limit: number;
  offset: number;
  count: number;
}

export const getHangarProjects = (
  platform: string,
): Promise<HangarProjectList> =>
  fetch(
    `https://hangar.papermc.io/api/v1/projects?limit=1&offset=0&sort=-stars&platform=${platform.toUpperCase()}`,
  ).then((res) => res.json());
