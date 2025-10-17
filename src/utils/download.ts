import { getProject, getVersionBuilds } from '@/utils/fill';
import { getHangarProjects } from '@/utils/hangar';
import type { ProjectDescriptor } from '@/utils/types';

export async function getProjectDescriptorOrError(id: string): Promise<{ error?: string; value?: ProjectDescriptor }> {
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

export async function getProjectDescriptor(id: string): Promise<ProjectDescriptor | null> {
  try {
    const projectData = await getProject(id);
    const flattenedVersions = Object.values(projectData.versions).flat().reverse();
    let latestStableVersion = flattenedVersions[flattenedVersions.length - 1];

    // Check for stable builds
    for (let i = flattenedVersions.length - 1; i >= 0; i--) {
      try {
        const builds = await getVersionBuilds(id, flattenedVersions[i]);
        if (builds.some((build) => build.channel === 'STABLE')) {
          latestStableVersion = flattenedVersions[i];
          break;
        }
      } catch {
        // Continue to next version if this one fails
      }
    }

    const latestExperimentalVersion =
      latestStableVersion !== flattenedVersions[flattenedVersions.length - 1] ? flattenedVersions[flattenedVersions.length - 1] : null;

    return {
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

    const flattenedVersions = Object.values(projectData.versions).flat().reverse();
    let latestStableVersion = flattenedVersions[flattenedVersions.length - 1];

    // Check for stable builds
    for (let i = flattenedVersions.length - 1; i >= 0; i--) {
      try {
        const builds = await getVersionBuilds(id, flattenedVersions[i]);
        if (builds.some((build) => build.channel === 'STABLE')) {
          latestStableVersion = flattenedVersions[i];
          break;
        }
      } catch {}
    }

    const latestExperimentalVersion =
      latestStableVersion !== flattenedVersions[flattenedVersions.length - 1] ? flattenedVersions[flattenedVersions.length - 1] : null;

    return {
      project: {
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
