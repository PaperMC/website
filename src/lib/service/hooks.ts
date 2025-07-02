"use client";

import useSWR from "swr";

import type { Build, Project } from "@/lib/service/types";

const API_ENDPOINT = "https://fill.papermc.io/v3";
const fetcher = (url: string) => fetch(url).then((res) => res.json());
export function useVersionBuilds(project: string, version?: string) {
  return useSWR<Build[]>(version ? `${API_ENDPOINT}/projects/${project}/versions/${version}/builds` : null, fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  });
}

export function useProject(id: string) {
  return useSWR<Project>(`${API_ENDPOINT}/projects/${id}`, fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  });
}
