import type { APIRoute } from "astro";
import { fetchPaperBstatsPlayerCount, PAPER_PLAYERCOUNT_KEY } from "@/utils/bstats";

export const GET: APIRoute = async ({ locals }) => {
  const kv = locals.runtime.env.WEBSITE_CACHE;
  if (kv) {
    const cached = await kv.get(PAPER_PLAYERCOUNT_KEY);
    if (cached !== null) {
      const { players } = JSON.parse(cached);
      return new Response(JSON.stringify({ players }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=300",
        },
      });
    }
  }

  const { players, error } = await fetchPaperBstatsPlayerCount();

  if (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(JSON.stringify({ players }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300",
    },
  });
};
