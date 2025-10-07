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
      next: { revalidate: 3600, tags: ["github:contributors"] },
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

export const getProjectRepository = (project: string, version: string): string => {
  if (project !== "paper") return `https://github.com/PaperMC/${project}`;
  if (project === "paper" && version === "1.7.10") return "https://github.com/PaperMC/Paper-1.7";

  const baseVersion = [21, 4]; // 1.21.4 is after the hardfork
  const isBelowBaseVersion = version
    .replace(/^1\./, "")
    .split(".")
    .map(Number)
    .some((v, i) => v < (baseVersion[i] || 0));

  return isBelowBaseVersion ? "https://github.com/PaperMC/Paper-Archive" : "https://github.com/PaperMC/Paper";
};
