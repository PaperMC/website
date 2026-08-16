import { handle } from "@astrojs/cloudflare/handler";
import { WorkerEntrypoint } from "cloudflare:workers";
import {
  DOWNLOAD_PROJECT_IDS,
  downloadsPageCacheTag,
  downloadsPagePath,
  isDownloadProjectId,
  type DownloadProjectId,
} from "./utils/download";
import { PAPER_PLAYERCOUNT_KEY, fetchPaperBstatsPlayerCount } from "./utils/bstats";
import { DOWNLOADS_LIVE_PATH } from "./utils/downloads-live-path";
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
const DOWNLOADS_PAGE_PATHS: ReadonlySet<string> = new Set(DOWNLOAD_PROJECT_IDS.map(downloadsPagePath));

/**
 * The cache-enabled Worker entrypoint for dynamic download pages.
 *
 * Keep the default entrypoint uncached: it also serves assets, whose otherwise
 * free requests become billed when Workers Cache is enabled for that entrypoint.
 */
export class DownloadsPages extends WorkerEntrypoint<Env> {
  override fetch(request: Request): Promise<Response> {
    return handle(request, this.env, this.ctx);
  }

  async invalidate(project: DownloadProjectId): Promise<void> {
    const cache = this.ctx.cache;
    if (!cache) throw new Error("Workers Cache is not enabled for the downloads pages entrypoint");
    const result = await cache.purge({ tags: [downloadsPageCacheTag(project)] });
    if (!result.success) throw new Error(`Failed to purge ${project} downloads page cache`);
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === DOWNLOADS_LIVE_PATH) {
      const project = url.searchParams.get("project");
      if (!isDownloadProjectId(project)) return new Response("Invalid project", { status: 400 });
      const region = downloadRegionForRequest(request);
      url.searchParams.set("region", region);
      return downloadShardStub(env, project, region).fetch(new Request(url, request));
    }
    if (DOWNLOADS_PAGE_PATHS.has(url.pathname)) {
      return ctx.exports.DownloadsPages.fetch(request);
    }
    return handle(request, env, ctx);
  },
  async scheduled(controller, env, ctx) {
    if (controller.cron === PLAYER_COUNT_CRON) {
      await updateStatsCache(env);
    } else if (controller.cron === DOWNLOADS_RECONCILIATION_CRON) {
      await updateDownloadsPageCache(env, ctx);
    }
  },
} satisfies ExportedHandler<Env>;

async function updateDownloadsPageCache(env: Env, ctx: ExecutionContext) {
  for (const project of DOWNLOAD_PROJECT_IDS) {
    try {
      await requestDownloadsRefresh(env, project);
      await ctx.exports.DownloadsPages.invalidate(project);
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
