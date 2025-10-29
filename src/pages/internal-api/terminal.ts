import type { APIRoute } from "astro";
import { downloadsPageDataKvKey, getProjectDescriptorOrError, type DownloadsPageData } from "@/utils/download";

export const GET: APIRoute = async ({ locals }) => {
  const kv = locals.runtime.env.WEBSITE_CACHE;
  const cached = await kv.get(downloadsPageDataKvKey("paper"));
  let ver: string | null = null;
  if (cached !== null) {
    const pageData: DownloadsPageData = JSON.parse(cached);
    const cachedVer = pageData.projectResult.value?.latestStableVersion;
    if (cachedVer) {
      ver = cachedVer;
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
