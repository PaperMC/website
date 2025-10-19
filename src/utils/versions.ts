interface VersionParts {
  major: number;
  minor: number;
  patch?: number;
  pre?: string;
}

function parseVersion(version: string): VersionParts {
  const base = version.split("-")[0];
  const pre = version.split("-")[1];
  const parts = base.split(".");
  const major = parseInt(parts[0] ?? "0", 10);
  const minor = parseInt(parts[1] ?? "0", 10);
  const patch = parts[2] ? parseInt(parts[2], 10) : undefined;
  return { major, minor, patch, pre };
}

function compareVersions(a: string, b: string): number {
  const pa = parseVersion(a);
  const pb = parseVersion(b);
  if (pa.major !== pb.major) return pa.major - pb.major;
  if (pa.minor !== pb.minor) return pa.minor - pb.minor;
  if (pa.patch !== pb.patch) {
    if (pa.patch === undefined) return pb.patch === undefined ? 0 : -1;
    if (pb.patch === undefined) return 1;
    return pa.patch - pb.patch;
  }
  if (!pa.pre && !pb.pre) return 0;
  if (!pa.pre) return 1;
  if (!pb.pre) return -1;
  return (pa.pre ?? "").localeCompare(pb.pre ?? "");
}

export function getLatestVersion(data: Record<string, string[]>): string {
  const allVersions = Object.values(data).flat();
  if (allVersions.length === 0) return "";
  let latest = allVersions[0];
  for (const v of allVersions) {
    if (compareVersions(v, latest) > 0) {
      latest = v;
    }
  }
  const parts = parseVersion(latest);
  const baseVersion = parts.patch !== undefined ? `${parts.major}.${parts.minor}.${parts.patch}` : `${parts.major}.${parts.minor}`;
  return baseVersion;
}
