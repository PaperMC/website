import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

type OpenCollectiveContributor = {
  name: string;
  image: string;
  totalAmountDonated: number;
};

type OpenCollectiveData = {
  collective: {
    name: string;
    slug: string;
    stats: {
      balance: {
        valueInCents: number;
      };
      monthlySpending: {
        valueInCents: number;
      };
    };
    contributors: {
      totalCount: number;
      nodes: OpenCollectiveContributor[];
    };
  };
};

type GitHubSponsor = {
  login: string;
  avatarUrl: string;
};

type GitHubSponsorsData = {
  organization: {
    sponsors: {
      totalCount: number;
      nodes: GitHubSponsor[];
    };
  };
};

type GitHubSponsorsPageData = {
  organization: {
    sponsors: {
      totalCount: number;
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
      nodes: GitHubSponsor[];
    };
  };
};

type SponsorData = {
  ocData: OpenCollectiveData;
  ghData: GitHubSponsorsData;
};

type Contributor = {
  login: string;
  id: number;
  avatar_url: string;
  contributions: number;
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

const outputDir = process.argv[2] ?? "work";
const githubToken = process.env.GITHUB_TOKEN?.trim();

if (!githubToken) {
  throw new Error("GITHUB_TOKEN is required");
}

const githubHeaders = {
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${githubToken}`,
  "User-Agent": "papermc-website-data-update",
  "X-GitHub-Api-Version": "2022-11-28",
};

async function graphQL<T>(url: string, query: string, authorization?: string): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(authorization ? { Authorization: authorization } : {}),
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}\n${await response.text()}`);
  }

  const result = (await response.json()) as GraphQLResponse<T>;

  if (result.errors?.length) {
    throw new Error(result.errors.map((error) => error.message).join("\n"));
  }

  if (!result.data) {
    throw new Error("GraphQL response did not include data");
  }

  return result.data;
}

function githubAvatar64(avatarUrl: string): string {
  const url = new URL(avatarUrl);

  url.search = "";
  url.searchParams.set("size", "64");

  return url.toString();
}

async function fetchOpenCollectiveSponsorsPage(offset: number): Promise<OpenCollectiveData> {
  return graphQL<OpenCollectiveData>(
    "https://api.opencollective.com/graphql/v2",
    `{
      collective(slug: "papermc") {
        name
        slug
        stats {
          balance {
            valueInCents
          }
          monthlySpending {
            valueInCents
          }
        }
        contributors(roles: BACKER, limit: 100, offset: ${offset}) {
          totalCount
          nodes {
            name
            image
            totalAmountDonated
          }
        }
      }
    }`
  );
}

async function fetchOpenCollectiveSponsors(): Promise<OpenCollectiveData> {
  const firstPage = await fetchOpenCollectiveSponsorsPage(0);
  const contributors = [...firstPage.collective.contributors.nodes];

  console.log(`Fetched ${firstPage.collective.contributors.nodes.length} OpenCollective sponsors from offset 0`);

  for (let offset = 100; offset < firstPage.collective.contributors.totalCount; offset += 100) {
    const page = await fetchOpenCollectiveSponsorsPage(offset);

    contributors.push(...page.collective.contributors.nodes);

    console.log(`Fetched ${page.collective.contributors.nodes.length} OpenCollective sponsors from offset ${offset}`);

    if (page.collective.contributors.nodes.length < 100) {
      break;
    }
  }

  firstPage.collective.contributors.nodes = contributors
    .filter((node) => node.name !== "GitHub Sponsors")
    .sort((a, b) => b.totalAmountDonated - a.totalAmountDonated);

  return firstPage;
}

async function fetchGitHubSponsorsPage(cursor: string | null): Promise<GitHubSponsorsPageData> {
  const after = cursor ? `, after: ${JSON.stringify(cursor)}` : "";

  return graphQL<GitHubSponsorsPageData>(
    "https://api.github.com/graphql",
    `{
      organization(login: "papermc") {
        sponsors(first: 100${after}) {
          totalCount
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            ... on Actor {
              login
              avatarUrl
            }
          }
        }
      }
    }`,
    `Bearer ${githubToken}`
  );
}

async function fetchGitHubSponsors(openCollectiveNames: Set<string>): Promise<GitHubSponsorsData> {
  const sponsors: GitHubSponsor[] = [];
  let totalCount = 0;
  let cursor: string | null = null;

  for (;;) {
    const page = await fetchGitHubSponsorsPage(cursor);
    const data = page.organization.sponsors;

    totalCount = data.totalCount;

    sponsors.push(
      ...data.nodes
        .filter((node) => !openCollectiveNames.has(node.login))
        .map((node) => ({
          login: node.login,
          avatarUrl: githubAvatar64(node.avatarUrl),
        }))
    );

    console.log(`Fetched ${data.nodes.length} GitHub sponsors`);

    if (!data.pageInfo.hasNextPage) {
      break;
    }

    cursor = data.pageInfo.endCursor;

    if (!cursor) {
      throw new Error("GitHub Sponsors pagination reported another page but did not return an endCursor");
    }
  }

  return {
    organization: {
      sponsors: {
        totalCount,
        nodes: sponsors,
      },
    },
  };
}

async function fetchSponsors(): Promise<SponsorData> {
  const ocData = await fetchOpenCollectiveSponsors();
  const openCollectiveNames = new Set(ocData.collective.contributors.nodes.map((node) => node.name));
  const ghData = await fetchGitHubSponsors(openCollectiveNames);

  return { ocData, ghData };
}

async function fetchContributors(): Promise<Contributor[]> {
  const contributors: Contributor[] = [];

  for (let page = 1; ; page++) {
    const url = new URL("https://api.github.com/repos/PaperMC/Paper/contributors");

    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", String(page));

    const response = await fetch(url, { headers: githubHeaders });

    if (!response.ok) {
      throw new Error(`Failed to fetch contributors page ${page}: ${response.status} ${response.statusText}\n${await response.text()}`);
    }

    const pageContributors = (await response.json()) as Contributor[];

    contributors.push(
      ...pageContributors.map(({ login, id, avatar_url, contributions }) => ({
        login,
        id,
        avatar_url,
        contributions,
      }))
    );

    console.log(`Fetched ${pageContributors.length} contributors from page ${page}`);

    if (pageContributors.length < 100) {
      break;
    }
  }

  return contributors;
}

const [sponsors, contributors] = await Promise.all([fetchSponsors(), fetchContributors()]);

await mkdir(outputDir, { recursive: true });

await writeFile(join(outputDir, "sponsors.json"), `${JSON.stringify(sponsors, null, 2)}\n`);
await writeFile(join(outputDir, "contributors.json"), `${JSON.stringify(contributors, null, 2)}\n`);

console.log(`Wrote ${sponsors.ocData.collective.contributors.nodes.length} OpenCollective sponsors`);
console.log(`Wrote ${sponsors.ghData.organization.sponsors.nodes.length} GitHub sponsors`);
console.log(`Wrote ${contributors.length} contributors`);
