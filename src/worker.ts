import { handle } from "@astrojs/cloudflare/handler";
import { DOWNLOAD_PROJECT_IDS, isDownloadProjectId } from "./utils/download";
import { PAPER_PLAYERCOUNT_KEY, fetchPaperBstatsPlayerCount } from "./utils/bstats";
import {
  DownloadsUpdateCoordinator,
  DownloadsWebSocketShard,
  downloadRegionForRequest,
  downloadShardStub,
  requestDownloadsRefresh,
} from "./downloads-live";

export { DownloadsUpdateCoordinator, DownloadsWebSocketShard };

const PLAYER_COUNT_CRON = "*/10 * * * *";
const DOWNLOADS_RECONCILIATION_CRON = "0 * * * *";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api/downloads/live") {
      const project = url.searchParams.get("project");
      if (!isDownloadProjectId(project)) return new Response("Invalid project", { status: 400 });
      const region = downloadRegionForRequest(request);
      url.searchParams.set("region", region);
      return downloadShardStub(env, project, region).fetch(new Request(url, request));
    }
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
    try {
      await requestDownloadsRefresh(env, project);
    } catch (error) {
      console.error(
        JSON.stringify({
          event: "downloads_reconciliation_failed",
          project,
          error: error instanceof Error ? error.message : String(error),
        })
      );
    }
  }
}

async function updateStatsCache(env: Env) {
  const { players, error } = await fetchPaperBstatsPlayerCount();
  if (!error) {
    await env.WEBSITE_CACHE.put(PAPER_PLAYERCOUNT_KEY, JSON.stringify({ players }));
  }
}
