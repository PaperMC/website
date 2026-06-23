export type OpenCollectiveContributor = {
  name: string;
  image: string;
  totalAmountDonated: number;
};

export type OpenCollectiveData = {
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

export type GitHubSponsor = {
  login: string;
  avatarUrl: string;
};

export type GitHubSponsorsData = {
  organization: {
    sponsors: {
      totalCount: number;
      nodes: GitHubSponsor[];
    };
  };
};

export type SponsorData = {
  ocData: OpenCollectiveData;
  ghData: GitHubSponsorsData;
};

const SPONSORS_DATA_URL = "https://raw.githubusercontent.com/PaperMC/website/data/sponsors.json";

export async function fetchAllSponsors(): Promise<SponsorData> {
  const response = await fetch(SPONSORS_DATA_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch sponsors: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<SponsorData>;
}
