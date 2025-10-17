export function stringToSemver(version: string): string {
  return version.match(/(\d+\.\d+\.\d+)/)?.[0] ?? version;
}

export function cmpVersion(a: string, b: string) {
  const A = stringToSemver(a).split(".").map(Number);
  const B = stringToSemver(b).split(".").map(Number);
  const len = Math.max(A.length, B.length);
  for (let i = 0; i < len; i++) {
    const da = A[i] ?? 0;
    const db = B[i] ?? 0;
    if (da !== db) return da - db;
  }
  return 0;
}

export function latestVersionFrom(
  versionsObj: Record<string, string[]>,
  includePreReleases = false
): string {
  const all = Object.values(versionsObj).flat();
  if (all.length === 0) return "";

  if (includePreReleases) {
    return all.sort(cmpVersion).at(-1) ?? "";
  }

  const stable = all.filter((v) => !v.includes("-"));
  if (stable.length === 0) {
    return all.sort(cmpVersion).at(-1) ?? "";
  }

  const latestStable = stable.sort(cmpVersion).at(-1) ?? "";
  const latestOverall = all.sort(cmpVersion).at(-1) ?? "";

  if (!latestOverall.includes("-")) return latestOverall;

  return cmpVersion(latestOverall, latestStable) > 0
    ? latestOverall
    : latestStable;
}
