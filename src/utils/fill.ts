import type { Build, Project } from "@/utils/types";

const API_ENDPOINT = "https://fill.papermc.io/v3";
const BSTATS_URL = "https://bstats.org/api/v1/plugins/580/charts/players/data/?maxElements=1";

const edgeFetch = (url: string, ttlSeconds = 300): Promise<Response> => {
  return fetch(url, {
    cf: {
      cacheTtl: ttlSeconds,
      cacheEverything: true,
    },
  });
};

export async function getProject(project: string): Promise<Project> {
  const res = await edgeFetch(`${API_ENDPOINT}/projects/${project}`, 600);
  if (!res.ok) {
    throw new Error(`getProject(${project}) failed: ${res.status}`);
  }
  return res.json() as Promise<Project>;
}

export async function getVersionBuilds(project: string, version: string): Promise<Build[]> {
  const res = await edgeFetch(`${API_ENDPOINT}/projects/${project}/versions/${version}/builds`, 300);
  if (!res.ok) {
    throw new Error(`getVersionBuilds(${project}, ${version}) failed: ${res.status}`);
  }
  return res.json() as Promise<Build[]>;
}

export async function getBStats(): Promise<{ servers: number; players: number }> {
  try {
    const res = await edgeFetch(BSTATS_URL, 300);
    const data = (await res.json()) as Array<[number, number]> | null | undefined;
    const players = data?.[0]?.[1] ?? 0;
    return { servers: Math.round(players / 20), players };
  } catch (error) {
    console.error("Failed to fetch bStats:", error);
    return { servers: 0, players: 0 };
  }
}
