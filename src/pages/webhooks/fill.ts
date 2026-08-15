import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { isDownloadProjectId, refreshDownloadsPageCache } from "@/utils/download";

export const prerender = false;

/** Receives Fill webhooks and refreshes the affected downloads cache. */

const SUPPORTED_TYPES = new Set(["build.published", "build.promoted", "version.created", "version.updated"]);
const TIMESTAMP_TOLERANCE_SECONDS = 300;

const encoder = new TextEncoder();

function acknowledge(): Response {
  return new Response(null, { status: 202 });
}

export const POST: APIRoute = async ({ request, locals }) => {
  const secret = env.FILL_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json({ error: "Fill webhooks are not configured on this deployment" }, { status: 503 });
  }

  const deliveryId = request.headers.get("webhook-id");
  const timestamp = request.headers.get("webhook-timestamp");
  const signature = request.headers.get("webhook-signature");

  if (!deliveryId || !timestamp || !signature) {
    return Response.json({ error: "Missing Standard Webhooks headers" }, { status: 400 });
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const timestampSeconds = Number(timestamp);
  if (!Number.isInteger(timestampSeconds) || Math.abs(nowSeconds - timestampSeconds) > TIMESTAMP_TOLERANCE_SECONDS) {
    return Response.json({ error: "Webhook timestamp outside tolerance" }, { status: 401 });
  }

  const body = await request.text();

  let signatureMatches: boolean;
  try {
    signatureMatches = await verifySignature(secret, `${deliveryId}.${timestamp}.${body}`, signature);
  } catch {
    return Response.json({ error: "Fill webhooks are not configured with a valid secret" }, { status: 503 });
  }

  if (!signatureMatches) {
    return Response.json({ error: "Invalid webhook signature" }, { status: 401 });
  }

  let payload: { type?: unknown; data?: { project?: { key?: unknown } } };
  try {
    payload = JSON.parse(body);
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof payload.type !== "string" || !SUPPORTED_TYPES.has(payload.type)) {
    // Unknown event type: acknowledge and ignore.
    return acknowledge();
  }

  const project = payload.data?.project?.key;
  if (!isDownloadProjectId(project)) {
    // Project not in the cached set: acknowledge and ignore.
    return acknowledge();
  }

  const refresh = refreshDownloadsPageCache(project, env.WEBSITE_CACHE);
  if (locals.cfContext) {
    locals.cfContext.waitUntil(refresh);
  } else {
    await refresh;
  }

  return acknowledge();
};

async function verifySignature(secret: string, content: string, signatureHeader: string): Promise<boolean> {
  if (!secret.startsWith("whsec_")) {
    throw new Error("Invalid webhook secret prefix");
  }

  const keyBytes = base64ToBytes(secret.slice("whsec_".length));
  const key = await crypto.subtle.importKey("raw", keyBytes, { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  const contentBytes = encoder.encode(content);

  for (const candidate of signatureHeader.split(/\s+/)) {
    const [version, encodedSignature] = candidate.split(",", 2);
    if (version !== "v1" || !encodedSignature) continue;

    try {
      const valid = await crypto.subtle.verify("HMAC", key, base64ToBytes(encodedSignature), contentBytes);
      if (valid) return true;
    } catch {
      // Ignore malformed candidate signatures and try the remaining signatures.
    }
  }

  return false;
}

function base64ToBytes(value: string): Uint8Array<ArrayBuffer> {
  const decoded = atob(value);
  const bytes = new Uint8Array(decoded.length);
  for (let index = 0; index < decoded.length; index++) {
    bytes[index] = decoded.charCodeAt(index);
  }
  return bytes;
}
