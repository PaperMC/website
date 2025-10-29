import type { SSRManifest } from "astro";
import { App } from "astro/app";
import { handle } from "@astrojs/cloudflare/handler";
import { fetchDownloadsPageData } from "./utils/download";

export function createExports(manifest: SSRManifest) {
  const app = new App(manifest);
  return {
    default: {
      async fetch(request, env, ctx) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return handle(manifest, app, request as any, env as any, ctx);
      },
      async scheduled(_controller, env, _ctx) {
        await updateDownloadsPageCache(env);
      },
    } satisfies ExportedHandler<Env>,
  };
}

async function updateDownloadsPageCache(env: Env) {
  const projects = ["paper", "velocity", "waterfall", "folia"];

  for (const project of projects) {
    const data = await fetchDownloadsPageData(project);
    if (data.buildsResult.error === undefined && data.projectResult.error === undefined) {
      await env.DOWNLOADS_PAGE_CACHE.put(project, JSON.stringify(data));
    }
  }
}
