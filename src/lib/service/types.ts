export interface Project {
  project: {
    id: string;
  };
  versions: {
    [key: string]: string[];
  };
}

export interface ProjectVersion {
  project_id: string;
  project_name: string;
  version: string;
  builds: number[];
}

export interface VersionBuilds {
  project_id: string;
  project_name: string;
  version: string;
  builds: Build[];
}

export interface VersionFamilyBuilds {
  project_id: string;
  project_name: string;
  version_group: string;
  versions: string[];
  builds: VersionFamilyBuild[];
}

export interface VersionFamilyBuild extends Build {
  project_id: string;
  project_name: string;
  version: string;
}

export interface Build {
  id: number;
  time: string;
  channel: "ALPHA" | "BETA" | "STABLE" | "RECOMMENDED";
  commits: BuildChange[];
  downloads: {
    [key: string]: BuildDownload;
  };
}

export interface BuildChange {
  sha: string;
  message: string;
  time: string;
}

export interface BuildDownload {
  name: string;
  checksums: {
    sha256: string;
  };
  size: number;
  url: string;
}

export interface ProjectsResponse {
  projects: Project[];
}
