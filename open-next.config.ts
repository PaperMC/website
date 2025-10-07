import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/dist/api/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
    incrementalCache: r2IncrementalCache,
    enableCacheInterception: true,
});
