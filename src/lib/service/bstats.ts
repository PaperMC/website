import useSWR from "swr";

import { swrNoAutoUpdateSettings } from "./api";

const CHARTS_URL =
  "https://bstats.org/api/v1/plugins/580/charts/players/data/?maxElements=1";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useBstatsPlayers = () =>
  useSWR(CHARTS_URL, fetcher, swrNoAutoUpdateSettings);
