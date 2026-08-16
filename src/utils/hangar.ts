export interface HangarProjectList {
  pagination: HangarProjectListPagination;
}

export interface HangarProjectListPagination {
  limit: number;
  offset: number;
  count: number;
}

export async function getHangarProjects(platform: string): Promise<HangarProjectList | null> {
  try {
    const response = await fetch(
      `https://hangar.papermc.io/api/v1/projects?limit=1&offset=0&sort=-stars&platform=${platform.toUpperCase()}`
    );

    if (!response.ok || !response.headers.get("content-type")?.includes("application/json")) {
      console.warn(`Unable to fetch Hangar projects for ${platform}: ${response.status}`);
      return null;
    }

    return (await response.json()) as HangarProjectList;
  } catch (error) {
    console.warn(`Unable to fetch Hangar projects for ${platform}:`, error);
    return null;
  }
}
