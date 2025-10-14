import type { Build, Project } from "@/utils/types";

const API_ENDPOINT = "https://fill.papermc.io/v3";
const BSTATS_URL =
  "https://bstats.org/api/v1/plugins/580/charts/players/data/?maxElements=1";

export async function getProject(project: string): Promise<Project> {
  const res = await fetch(`${API_ENDPOINT}/projects/${project}`);

  if (!res.ok) {
    throw new Error(`getProject(${project}) failed: ${res.status}`);
  }
  return res.json();
}

export async function getVersionBuilds(
  project: string,
  version: string
): Promise<Build[]> {
  const res = await fetch(
    `${API_ENDPOINT}/projects/${project}/versions/${version}/builds`
  );

  if (!res.ok) {
    throw new Error(
      `getVersionBuilds(${project}, ${version}) failed: ${res.status}`
    );
  }
  return res.json();
}

export async function getBStats(): Promise<{
  servers: number;
  players: number;
}> {
  try {
    const response = await fetch(BSTATS_URL);
    const data = await response.json();
    const players = data[0]?.[1] || 0;
    return { servers: Math.round(players / 20), players };
  } catch (error) {
    console.error("Failed to fetch bStats:", error);
    return { servers: 0, players: 0 };
  }
}
