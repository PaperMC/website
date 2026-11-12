import { handle } from "@astrojs/cloudflare/handler";
import { DOWNLOAD_PROJECT_IDS, refreshDownloadsPageCache } from "./utils/download";
import { PAPER_PLAYERCOUNT_KEY, fetchPaperBstatsPlayerCount } from "./utils/bstats";

const PLAYER_COUNT_CRON = "*/10 * * * *";
const DOWNLOADS_RECONCILIATION_CRON = "0 * * * *";

export default {
  async fetch(request, env, ctx) {
    return handle(request, env, ctx);
  },
  async scheduled(controller, env, _ctx) {
    if (controller.cron === PLAYER_COUNT_CRON) {
      try {
        await updateStatsCache(env);
      } catch (error) {
        console.error("Scheduled player count cache update failed:", error);
        throw error;
      }
    } else if (controller.cron === DOWNLOADS_RECONCILIATION_CRON) {
      await updateDownloadsPageCache(env);
    }
  },
} satisfies ExportedHandler<Env>;

async function updateDownloadsPageCache(env: Env) {
  for (const project of DOWNLOAD_PROJECT_IDS) {
    try {
      await refreshDownloadsPageCache({ projectId: project, kv: env.WEBSITE_CACHE });
    } catch (error) {
      console.error(`Failed to refresh downloads page cache for ${project}:`, error);
    }
  }
}

async function updateStatsCache(env: Env) {
  const { players, error } = await fetchPaperBstatsPlayerCount();
  if (error) {
    console.warn(`Not updating player count cache: ${error}`);
    return;
  }

  await env.WEBSITE_CACHE.put(PAPER_PLAYERCOUNT_KEY, JSON.stringify({ players }));
}
