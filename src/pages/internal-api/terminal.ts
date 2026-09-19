import type { APIRoute } from "astro";
import { downloadsPageDataKvKey, getProjectDescriptorOrError, type DownloadsPageData, type DownloadsPageSnapshot } from "@/utils/download";
import { env } from "cloudflare:workers";

export const GET: APIRoute = async () => {
  let ver: string | null = null;

  const kv = env.WEBSITE_CACHE;
  if (kv) {
    const cached = await kv.get(downloadsPageDataKvKey("paper"));
    if (cached !== null) {
      const cachedData = JSON.parse(cached) as DownloadsPageData | DownloadsPageSnapshot;
      const pageData = "data" in cachedData ? cachedData.data : cachedData;
      const cachedVer = pageData.projectResult.value?.latestStableVersion;
      if (cachedVer) {
        ver = cachedVer;
      }
    }
  }
  if (ver === null) {
    const projectDescriptor = await getProjectDescriptorOrError("paper");
    const foundVer = projectDescriptor.value?.latestStableVersion;
    if (foundVer) {
      ver = foundVer;
    }
  }

  if (ver !== null) {
    return new Response(
      JSON.stringify({
        version: ver,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  return new Response(
    JSON.stringify({
      error: "Internal server error",
    }),
    {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
