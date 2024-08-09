import type { HangarProjectList } from "@/types/hangar";

export const getHangarProjects = (
  platform: string,
): Promise<HangarProjectList> => {
  return fetch(
    `https://hangar.papermc.io/api/v1/projects?limit=1&offset=0&sort=-stars&platform=${platform.toUpperCase()}`,
  ).then((res) => res.json());
};
