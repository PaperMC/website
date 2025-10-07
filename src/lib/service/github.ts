export interface Contributor {
  login: string;
  id: number;
  avatar_url: string;
  contributions: number;
}

const CONTRIBUTORS_BASE_URL = "https://api.github.com/repos/PaperMC/Paper/contributors?per_page=100";

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
