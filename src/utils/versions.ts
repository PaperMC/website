export function stringToSemver(version: string): string {
  const match = version.match(/(\d+\.\d+)(\.\d+)?(-.*)?/);
  if (!match) return version;
  return `${match[1]}${match[2] ?? ".0"}${match[3] ?? ""}`;
}

export function cmpVersion(a: string, b: string) {
  const A = stringToSemver(a).split("-")[0].split(".").map(Number);
  const B = stringToSemver(b).split("-")[0].split(".").map(Number);
  const len = Math.max(A.length, B.length);
  for (let i = 0; i < len; i++) {
    const da = A[i] ?? 0;
    const db = B[i] ?? 0;
    if (da !== db) return da - db;
  }

  const preA = a.includes("-") ? a.split("-")[1] : "";
  const preB = b.includes("-") ? b.split("-")[1] : "";
  if (preA === "" && preB !== "") return 1;
  if (preA !== "" && preB === "") return -1;
  return preA.localeCompare(preB);
}

export function latestVersionFrom(versionsObj: Record<string, string[]>, includePreReleases = false): string {
  const all = Object.values(versionsObj).flat();
  if (all.length === 0) return "";

  if (includePreReleases) {
    return all.sort(cmpVersion)[all.length - 1] ?? "";
  }

  const stable = all.filter((v) => !v.includes("-"));
  if (stable.length === 0) {
    return all.sort(cmpVersion)[all.length - 1] ?? "";
  }

  return stable.sort(cmpVersion)[stable.length - 1] ?? "";
}
