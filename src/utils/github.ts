export interface Contributor {
  login: string;
  id: number;
  avatar_url: string;
  contributions: number;
}

const CONTRIBUTORS_BASE_URL = "https://api.github.com/repos/PaperMC/Paper/contributors?per_page=100";

/**
 * Fetches a list of contributors from the GitHub API, paginating through results up to a specified maximum number of pages.
 *
 * The function accumulates contributors from each page until one of the following conditions is met:
 * - The maximum number of pages (`maxPages`) is reached.
 * - The response status is 403 (forbidden).
 * - The response is not OK.
 * - The returned data is not an array or is empty.
 * - The number of contributors in the current page is less than 100 (indicating the last page).
 *
 * @param maxPages - The maximum number of pages to fetch. Defaults to 15.
 * @returns A promise that resolves to an array of `Contributor` objects.
 */
export async function fetchContributors(maxPages = 15): Promise<Contributor[]> {
  const all: Contributor[] = [];

  for (let page = 1; page <= maxPages; page++) {
    const res = await fetch(`${CONTRIBUTORS_BASE_URL}&page=${page}`, {
      headers: {
        Accept: "application/vnd.github+json",
      },
    });

    if (res.status === 403) {
      break;
    }

    if (!res.ok) {
      break;
    }

    const data = (await res.json()) as Contributor[];
    if (!Array.isArray(data) || data.length === 0) break;

    all.push(...data);

    if (data.length < 100) break;
  }
  return all;
}

const parseMinecraftVersion = (version: string): number[] => {
  return version
    .replace(/^1\./, "")
    .split(".")
    .map((part) => Number.parseInt(part, 10))
    .filter((part) => Number.isFinite(part));
};

const compareVersions = (a: string, b: string): number => {
  const aParts = parseMinecraftVersion(a);
  const bParts = parseMinecraftVersion(b);
  const maxLength = Math.max(aParts.length, bParts.length);

  for (let i = 0; i < maxLength; i++) {
    const aPart = aParts[i] ?? 0;
    const bPart = bParts[i] ?? 0;

    if (aPart > bPart) return 1;
    if (aPart < bPart) return -1;
  }

  return 0;
};

export const getProjectRepository = (project: string, version: string): string => {
  if (project !== "paper") return `https://github.com/PaperMC/${project}`;
  if (version === "1.7.10") return "https://github.com/PaperMC/Paper-1.7";

  const baseVersion = "1.21.4";
  const isBelowBaseVersion = compareVersions(version, baseVersion) < 0;

  return isBelowBaseVersion ? "https://github.com/PaperMC/Paper-Archive" : "https://github.com/PaperMC/Paper";
};
