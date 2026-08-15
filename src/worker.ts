import { handle } from "@astrojs/cloudflare/handler";
import { refreshDownloadsPageCache } from "./utils/download";
import { PAPER_PLAYERCOUNT_KEY, fetchPaperBstatsPlayerCount } from "./utils/bstats";

const PLAYER_COUNT_CRON = "*/10 * * * *";
const DOWNLOADS_RECONCILIATION_CRON = "0 * * * *";

export default {
  async fetch(request, env, ctx) {
    return handle(request, env, ctx);
  },
  async scheduled(controller, env, _ctx) {
    if (controller.cron === PLAYER_COUNT_CRON) {
      await updateStatsCache(env);
    } else if (controller.cron === DOWNLOADS_RECONCILIATION_CRON) {
      await updateDownloadsPageCache(env);
    }
  },
} satisfies ExportedHandler<Env>;

async function updateDownloadsPageCache(env: Env) {
  const projects = ["paper", "velocity", "waterfall", "folia"];

  for (const project of projects) {
    await refreshDownloadsPageCache(project, env.WEBSITE_CACHE);
  }
}

async function updateStatsCache(env: Env) {
  const { players, error } = await fetchPaperBstatsPlayerCount();
  if (!error) {
    await env.WEBSITE_CACHE.put(PAPER_PLAYERCOUNT_KEY, JSON.stringify({ players }));
  }
}
