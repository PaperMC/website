import { getLatestBuild, getProject, getVersionBuilds } from "@/utils/fill";
import { getHangarProjects } from "@/utils/hangar";
import { type ProjectDescriptor, type Build, type Project } from "@/utils/types";

export const DOWNLOAD_PROJECT_IDS = ["paper", "velocity", "waterfall", "folia"] as const;
export type DownloadProjectId = (typeof DOWNLOAD_PROJECT_IDS)[number];

const DOWNLOAD_PROJECT_ID_SET: ReadonlySet<string> = new Set(DOWNLOAD_PROJECT_IDS);

export function isDownloadProjectId(value: unknown): value is DownloadProjectId {
  return typeof value === "string" && DOWNLOAD_PROJECT_ID_SET.has(value);
}

export type ProjectDescriptorOrError = { error?: string; value?: ProjectDescriptor };
export type ProjectBuildsOrError = { error?: string; value?: { latest?: Build; builds: Build[] } };
export type DownloadsPageData = {
  projectResult: ProjectDescriptorOrError;
  stableBuildsResult: ProjectBuildsOrError;
  experimentalBuildsResult: ProjectBuildsOrError | null;
};

export function downloadsPageDataKvKey(projectId: string) {
  return `downloads:${projectId}`;
}

function downloadsPageDataErrors(data: DownloadsPageData) {
  if (
    data.projectResult.error === undefined &&
    data.stableBuildsResult.error === undefined &&
    data.experimentalBuildsResult?.error === undefined
  ) {
    return null;
  }

  return {
    projectError: data.projectResult.error,
    stableError: data.stableBuildsResult.error,
    experimentalError: data.experimentalBuildsResult?.error,
  };
}

export async function refreshDownloadsPageCache({
  projectId,
  kv,
  logUnchanged = false,
}: {
  projectId: string;
  kv: KVNamespace;
  logUnchanged?: boolean;
}): Promise<void> {
  // `null` means the key does not exist yet; `undefined` means the read failed.
  const previousRaw = await kv.get(downloadsPageDataKvKey(projectId)).catch((error) => {
    console.warn(`Failed to read previous cache for ${projectId} before refresh:`, error);
    return undefined;
  });

  const data = await fetchDownloadsPageData(projectId);

  const errors = downloadsPageDataErrors(data);
  if (errors) {
    console.warn(`Not updating cache for ${projectId}: fetch returned errors`, errors);
    return;
  }

  // Stored values are written by this exact serialization, so comparing raw strings is a reliable change check.
  const serialized = JSON.stringify(data);

  if (previousRaw === serialized) {
    if (logUnchanged) {
      console.log(`Cache already current for ${projectId}: ${describeDownloadsPageData(data)}`);
    }
    return;
  }

  await kv.put(downloadsPageDataKvKey(projectId), serialized);

  const initial = previousRaw === null ? " (initial population)" : "";
  console.log(`Updated cache for ${projectId}: ${describeDownloadsPageData(data)}${initial}`);
}

/** One-line summary of the stable/experimental state stored in the downloads page cache. */
function describeDownloadsPageData(data: DownloadsPageData): string {
  const project = data.projectResult.value;
  const stable = formatVersionSummary("stable", project?.latestStableVersion, data.stableBuildsResult.value);
  const experimental = data.experimentalBuildsResult?.value;
  if (!experimental) return stable;
  return `${stable}, ${formatVersionSummary("experimental", project?.latestExperimentalVersion, experimental)}`;
}

/** Renders one cached version line, e.g. "stable v1.21.8 latest=2544 (3 builds)". */
function formatVersionSummary(label: string, version: string | null | undefined, result: ProjectBuildsOrError["value"]): string {
  return `${label} v${version ?? "unknown"} latest=${result?.latest?.id ?? "none"} (${result?.builds.length ?? 0} builds)`;
}

export async function fetchDownloadsPageData(projectId: string, kv?: KVNamespace): Promise<DownloadsPageData> {
  if (kv) {
    const cachedString = await kv.get(downloadsPageDataKvKey(projectId));
    if (cachedString !== null) {
      const data = JSON.parse(cachedString);
      if (data.projectResult && data.stableBuildsResult) {
        return data;
      }
    }
  }

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

  const data = { projectResult, stableBuildsResult, experimentalBuildsResult };
  if (kv) {
    const errors = downloadsPageDataErrors(data);
    if (errors) {
      console.warn(`Failed to fully populate downloads page data for ${projectId} after a cache miss`, errors);
    }
  }
  return data;
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
  const newestVersion = flattenedVersions[flattenedVersions.length - 1];
  if (!newestVersion) {
    throw new Error(`Project ${project.project.id} has no versions`);
  }

  let latestStableVersion: string | undefined;

  // Check for stable builds
  for (let i = flattenedVersions.length - 1; i >= 0; i--) {
    if (preReleaseRegex.test(flattenedVersions[i])) continue; // Skip pre-release versions
    try {
      const build = await getLatestBuild(project.project.id, flattenedVersions[i]);
      if (build === null) continue;
      if (build.channel === "STABLE" || build.channel === "RECOMMENDED") {
        latestStableVersion = flattenedVersions[i];
        break;
      }
    } catch (error) {
      throw new Error(`Failed to determine whether ${project.project.id} ${flattenedVersions[i]} is stable`, { cause: error });
    }
  }

  if (!latestStableVersion) {
    throw new Error(`Project ${project.project.id} has no version with a stable or recommended build`);
  }

  const latestExperimentalVersion = latestStableVersion !== newestVersion ? newestVersion : null;

  return { latestStableVersion, latestExperimentalVersion };
}

export async function getProjectDescriptor(id: string): Promise<ProjectDescriptor> {
  const projectData = await getProject(id);
  const { latestStableVersion, latestExperimentalVersion } = await findStableAndExperimentalVersions(projectData);

  return {
    id,
    name: projectData.project.name,
    latestStableVersion,
    latestExperimentalVersion,
    latestVersionGroup: Object.keys(projectData.versions)[0],
  };
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
