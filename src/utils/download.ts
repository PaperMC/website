import { getLatestBuild, getProject, getVersionBuilds } from "@/utils/fill";
import { getHangarProjects } from "@/utils/hangar";
import { type ProjectDescriptor, type Build, type Project } from "@/utils/types";

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
  let stableBuildsResult: ProjectBuildsOrError | null = null;
  let experimentalBuildsResult: ProjectBuildsOrError | null = null;
  if (projectResult.value) {
    stableBuildsResult = await fetchBuildsOrError(projectId, projectResult.value.latestStableVersion);
    if (projectResult.value.latestExperimentalVersion) {
      experimentalBuildsResult = await fetchBuildsOrError(projectId, projectResult.value.latestExperimentalVersion);
    }
  } else {
    stableBuildsResult = { error: projectResult.error };
    experimentalBuildsResult = { error: projectResult.error };
  }

  return { projectResult, stableBuildsResult, experimentalBuildsResult };
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
    const [projectData, hangarData] = await Promise.all([getProject(id), getHangarProjects(id).catch(() => null)]);

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
