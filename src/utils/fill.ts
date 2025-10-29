import type { Build, BuildChannel, Project } from "@/utils/types";

const API_ENDPOINT = "https://fill.papermc.io/v3";

export async function getProject(project: string): Promise<Project> {
  const res = await fetch(`${API_ENDPOINT}/projects/${project}`);
  if (!res.ok) {
    throw new Error(`getProject(${project}) failed: ${res.status}`);
  }
  return res.json() as Promise<Project>;
}

export async function getVersionBuilds(project: string, version: string, channel?: BuildChannel): Promise<Build[]> {
  let url = `${API_ENDPOINT}/projects/${project}/versions/${version}/builds`;
  if (channel) {
    url += `?channel=${encodeURIComponent(channel)}`;
  }
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`getVersionBuilds(${project}, ${version}, ${channel}) failed: ${res.status}`);
  }
  return res.json() as Promise<Build[]>;
}

export async function getLatestBuild(project: string, version: string): Promise<Build | null> {
  const url = `${API_ENDPOINT}/projects/${project}/versions/${version}/builds/latest`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`getLatestBuild(${project}, ${version}) failed: ${res.status}`);
  }
  return res.json() as Promise<Build>;
}
