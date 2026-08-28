import { getLatestBuild, getProject, getVersionBuilds } from "@/utils/fill";
import { getHangarProjects } from "@/utils/hangar";
import { type ProjectDescriptor, type Build, type Project } from "@/utils/types";

export const DOWNLOAD_PROJECT_IDS = ["paper", "velocity", "waterfall", "folia"] as const;
export type DownloadProjectId = (typeof DOWNLOAD_PROJECT_IDS)[number];
export const DOWNLOAD_REGIONS = ["wnam", "weur", "apac"] as const;
export type DownloadRegion = (typeof DOWNLOAD_REGIONS)[number];

const DOWNLOAD_PROJECT_ID_SET: ReadonlySet<string> = new Set(DOWNLOAD_PROJECT_IDS);

export function isDownloadProjectId(value: unknown): value is DownloadProjectId {
  return typeof value === "string" && DOWNLOAD_PROJECT_ID_SET.has(value);
}

export function downloadsPagePath(project: DownloadProjectId): `/downloads/${DownloadProjectId}` {
  return `/downloads/${project}`;
}

export function downloadsPageCacheTag(project: DownloadProjectId): `downloads:${DownloadProjectId}` {
  return `downloads:${project}`;
}

export function downloadRegionForContinent(continent?: string): DownloadRegion {
  if (continent === "EU" || continent === "AF") return "weur";
  if (continent === "AS" || continent === "OC") return "apac";
  return "wnam";
}

export type ProjectDescriptorOrError = { error?: string; value?: ProjectDescriptor };
export type ProjectBuildsOrError = { error?: string; value?: { latest?: Build; builds: Build[] } };
export type DownloadsPageData = {
  projectResult: ProjectDescriptorOrError;
  stableBuildsResult: ProjectBuildsOrError;
  experimentalBuildsResult: ProjectBuildsOrError | null;
};

export type DownloadsPageSnapshot = {
  streamId: string;
  generation: number;
  revision: string;
  data: DownloadsPageData;
};

export type DownloadsLiveStatus = "connecting" | "live" | "reconnecting" | "paused" | "offline";

export function downloadsPageDataKvKey(projectId: string) {
  return `downloads:${projectId}`;
}

export function isValidDownloadsPageData(data: DownloadsPageData): boolean {
  return (
    data.projectResult.error === undefined &&
    data.stableBuildsResult.error === undefined &&
    data.experimentalBuildsResult?.error === undefined
  );
}

export async function downloadsPageDataRevision(data: DownloadsPageData): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonicalJson(data)));
  return `sha256:${Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

export async function fetchDownloadsPageSnapshot(
  projectId: string,
  kv: KVNamespace,
  coordinator?: () => DurableObjectStub
): Promise<DownloadsPageSnapshot> {
  const cachedString = await kv.get(downloadsPageDataKvKey(projectId));
  if (cachedString !== null) {
    try {
      const cached: unknown = JSON.parse(cachedString);
      if (isDownloadsPageSnapshot(cached)) return cached;

      // Read snapshots written by deployments from before the envelope was introduced.
      if (isDownloadsPageData(cached)) {
        return { streamId: "uninitialized", generation: 0, revision: await downloadsPageDataRevision(cached), data: cached };
      }
    } catch {
      // Fall through to the coordinator or Fill if the cached value is malformed.
    }
  }

  const coordinated = await fetchCoordinatorSnapshot(coordinator);
  if (coordinated) return coordinated;

  const data = await fetchDownloadsPageData(projectId);
  return { streamId: "uninitialized", generation: 0, revision: await downloadsPageDataRevision(data), data };
}

export async function fetchDownloadsPageData(projectId: string): Promise<DownloadsPageData> {
  const projectResult = await getProjectDescriptorOrError(projectId);
  let stableBuildsResultPromise: Promise<ProjectBuildsOrError> | null = null;
  let experimentalBuildsResultPromise: Promise<ProjectBuildsOrError> | null = null;
  if (projectResult.value) {
    stableBuildsResultPromise = fetchBuildsOrError(projectId, projectResult.value.latestStableVersion);
    if (projectResult.value.latestExperimentalVersion) {
      experimentalBuildsResultPromise = fetchBuildsOrError(projectId, projectResult.value.latestExperimentalVersion);
    }
  } else {
    stableBuildsResultPromise = Promise.resolve({ error: projectResult.error });
    experimentalBuildsResultPromise = Promise.resolve({ error: projectResult.error });
  }

  const [stableBuildsResult, experimentalBuildsResult] = await Promise.all([stableBuildsResultPromise, experimentalBuildsResultPromise]);

  return { projectResult, stableBuildsResult, experimentalBuildsResult };
}

function isDownloadsPageSnapshot(value: unknown): value is DownloadsPageSnapshot {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<DownloadsPageSnapshot>;
  return (
    typeof candidate.streamId === "string" &&
    Number.isSafeInteger(candidate.generation) &&
    (candidate.generation ?? -1) >= 0 &&
    typeof candidate.revision === "string" &&
    isDownloadsPageData(candidate.data)
  );
}

async function fetchCoordinatorSnapshot(coordinator?: () => DurableObjectStub): Promise<DownloadsPageSnapshot | undefined> {
  if (!coordinator) return undefined;
  try {
    const response = await coordinator().fetch("https://downloads.internal/snapshot");
    if (!response.ok) return undefined;
    const snapshot: unknown = await response.json();
    return isDownloadsPageSnapshot(snapshot) ? snapshot : undefined;
  } catch {
    return undefined;
  }
}

function isDownloadsPageData(value: unknown): value is DownloadsPageData {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<DownloadsPageData>;
  return candidate.projectResult !== undefined && candidate.stableBuildsResult !== undefined;
}

function canonicalJson(value: unknown): string {
  return JSON.stringify(sortJsonValue(value));
}

function sortJsonValue(value: unknown): unknown {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(sortJsonValue);

  const record = value as Record<string, unknown>;
  return Object.fromEntries(
    Object.keys(record)
      .sort()
      .map((key) => [key, sortJsonValue(record[key])])
  );
}

export async function fetchBuildsOrError(projectId: string, versionId: string): Promise<ProjectBuildsOrError> {
  try {
    const res = await getVersionBuilds(projectId, versionId);
    const builds = Array.isArray(res) ? res : [];
    const latestBuild = builds[0] || undefined;
    return { value: { latest: latestBuild, builds } };
  } catch (e) {
    return { error: `Failed to load builds for ${projectId} ${versionId}: ${e}` };
  }
}

export async function getProjectDescriptorOrError(id: string): Promise<ProjectDescriptorOrError> {
  try {
    const result = await getProjectDescriptor(id);
    if (result == null) {
      return { error: `Project ${id} not found` };
    }
    return { value: result };
  } catch (error) {
    return { error: `Failed to fetch project ${id}: ${error}` };
  }
}

const preReleaseRegex = /-pre|-rc/;

async function findStableAndExperimentalVersions(
  project: Project
): Promise<{ latestStableVersion: string; latestExperimentalVersion: string | null }> {
  const flattenedVersions = Object.values(project.versions).flat().reverse();
  let latestStableVersion = flattenedVersions[flattenedVersions.length - 1];

  // Check for stable builds
  for (let i = flattenedVersions.length - 1; i >= 0; i--) {
    if (preReleaseRegex.test(flattenedVersions[i])) continue; // Skip pre-release versions
    try {
      const build = await getLatestBuild(project.project.id, flattenedVersions[i]);
      if (build !== null && (build.channel === "STABLE" || build.channel === "RECOMMENDED")) {
        latestStableVersion = flattenedVersions[i];
        break;
      }
    } catch {
      // Continue to next version if this one fails
    }
  }

  const latestExperimentalVersion =
    latestStableVersion !== flattenedVersions[flattenedVersions.length - 1] ? flattenedVersions[flattenedVersions.length - 1] : null;

  return { latestStableVersion, latestExperimentalVersion };
}

export async function getProjectDescriptor(id: string): Promise<ProjectDescriptor | null> {
  try {
    const projectData = await getProject(id);
    const { latestStableVersion, latestExperimentalVersion } = await findStableAndExperimentalVersions(projectData);

    return {
      id,
      name: projectData.project.name,
      latestStableVersion,
      latestExperimentalVersion,
      latestVersionGroup: Object.keys(projectData.versions)[0],
    };
  } catch (error) {
    console.error(`Failed to fetch project ${id}:`, error);
    return null;
  }
}

export async function getProjectDescriptorWithHangar(id: string): Promise<{ project: ProjectDescriptor; hangarCount: number } | null> {
  try {
    const [projectData, hangarData] = await Promise.all([getProject(id), getHangarProjects(id)]);

    const { latestStableVersion, latestExperimentalVersion } = await findStableAndExperimentalVersions(projectData);

    return {
      project: {
        id,
        name: projectData.project.name,
        latestStableVersion,
        latestExperimentalVersion,
        latestVersionGroup: Object.keys(projectData.versions)[0],
      },
      hangarCount: hangarData?.pagination?.count || 0,
    };
  } catch (error) {
    console.error(`Failed to fetch project ${id}:`, error);
    return null;
  }
}
