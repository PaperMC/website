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
  versionsObj: Record<string, string[]>
): string {
  const all = Object.values(versionsObj).flat();

  const stable = all.filter((v) => !v.includes("-"));
  const pool = stable.length ? stable : all;

  return pool.sort(cmpVersion).at(-1) ?? "";
}
