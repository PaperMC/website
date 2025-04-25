import useSWR from "swr";

import { cachedFetcher, swrNoAutoUpdateSettings } from "./api";

const CHARTS_URL =
  "https://bstats.org/api/v1/plugins/580/charts/players/data/?maxElements=1";

export const useBstatsPlayers = () =>
  useSWR(CHARTS_URL, cachedFetcher, swrNoAutoUpdateSettings);
