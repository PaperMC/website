import { handle } from "@astrojs/cloudflare/handler";
import { DOWNLOAD_PROJECT_IDS, refreshDownloadsPageCache } from "./utils/download";
import { PAPER_PLAYERCOUNT_KEY, fetchPaperBstatsPlayerCount } from "./utils/bstats";
import { DownloadsUpdateCoordinator, DownloadsWebSocketShard } from "./downloads-live";

export { DownloadsUpdateCoordinator, DownloadsWebSocketShard };

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
  for (const project of DOWNLOAD_PROJECT_IDS) {
    await refreshDownloadsPageCache(project, env.WEBSITE_CACHE);
  }
}

async function updateStatsCache(env: Env) {
  const { players, error } = await fetchPaperBstatsPlayerCount();
  if (!error) {
    await env.WEBSITE_CACHE.put(PAPER_PLAYERCOUNT_KEY, JSON.stringify({ players }));
  }
}
