export interface Contributor {
  login: string;
  id: number;
  avatar_url: string;
  contributions: number;
}

const CONTRIBUTORS_DATA_URL = "https://raw.githubusercontent.com/PaperMC/website/data/contributors.json";

export async function fetchContributors(): Promise<Contributor[]> {
  const response = await fetch(CONTRIBUTORS_DATA_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch contributors: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<Contributor[]>;
}

export const getProjectRepository = (project: string, version: string): string => {
  if (project !== "paper") return `https://github.com/PaperMC/${project}`;
  if (project === "paper" && version === "1.7.10") return "https://github.com/PaperMC/Paper-1.7";

  const baseVersion = "1.21.4"; // after the hardfork

  return isVersionBelow(version, baseVersion) ? "https://github.com/PaperMC/Paper-Archive" : "https://github.com/PaperMC/Paper";
};

function isVersionBelow(version: string, base: string): boolean {
  const v = version.split(".").map(Number);
  const b = base.split(".").map(Number);

  const len = Math.max(v.length, b.length);

  for (let i = 0; i < len; i++) {
    const vi = v[i] ?? 0;
    const bi = b[i] ?? 0;

    if (vi < bi) return true;
    if (vi > bi) return false;
  }

  return false;
}
