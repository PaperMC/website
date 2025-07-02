import type { Build, Project } from "@/lib/service/types";

const API_ENDPOINT = "https://fill.papermc.io/v3";
const BSTATS_URL =
  "https://bstats.org/api/v1/plugins/580/charts/players/data/?maxElements=1";

const fetcher = (path: string) =>
  fetch(API_ENDPOINT + path).then((res) => res.json());

export const getProject = (project: string): Promise<Project> =>
  fetcher(`/projects/${project}`);

export const getVersionBuilds = (
  project: string,
  version: string,
): Promise<Build[]> =>
  fetcher(`/projects/${project}/versions/${version}/builds`);

export const getBStats = async (): Promise<{
  servers: number;
  players: number;
}> => {
  try {
    const response = await fetch(BSTATS_URL);
    const data = await response.json();
    const players = data[0]?.[1] || 0;
    return { servers: Math.round(players / 20), players }; // Estimate servers based on players
  } catch (error) {
    console.error("Failed to fetch bStats:", error);
    return { servers: 0, players: 0 };
  }
};
