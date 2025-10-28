import { getLatestBuild, getProject, getVersionBuilds } from "@/utils/fill";
import { getHangarProjects } from "@/utils/hangar";
import { type ProjectDescriptor, type Build, type Project } from "@/utils/types";

export type ProjectDescriptorOrError = { error?: string; value?: ProjectDescriptor };
export type ProjectBuildsOrError = { error?: string; value?: { latest?: Build; builds: Build[] } };

export async function fetchBuildsOrError(project: ProjectDescriptorOrError, experimental: boolean): Promise<ProjectBuildsOrError> {
  const projectId = project.value?.id;
  if (!projectId) {
    return { error: `Project id not found` };
  }
  let versionId = project.value?.latestStableVersion ?? project.value?.latestExperimentalVersion;
  if (experimental && project.value?.latestExperimentalVersion) {
    versionId = project.value?.latestExperimentalVersion;
  }
  if (!versionId) {
    return { error: `No versions found` };
  }
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
