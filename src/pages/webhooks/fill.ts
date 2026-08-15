import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { refreshDownloadsPageCache } from "@/utils/download";

/** Receives Fill webhooks and refreshes the affected downloads cache. */

const SUPPORTED_PROJECTS = new Set(["paper", "velocity", "waterfall", "folia"]);
const SUPPORTED_TYPES = new Set(["build.published", "build.promoted", "version.created", "version.updated"]);
const TIMESTAMP_TOLERANCE_SECONDS = 300;

const encoder = new TextEncoder();

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ request, locals }) => {
  const secret = env.FILL_WEBHOOK_SECRET;
  if (!secret) {
    return jsonResponse({ error: "Fill webhooks are not configured on this deployment" }, 503);
  }

  const deliveryId = request.headers.get("webhook-id");
  const timestamp = request.headers.get("webhook-timestamp");
  const signature = request.headers.get("webhook-signature");

  if (!deliveryId || !timestamp || !signature) {
    return jsonResponse({ error: "Missing Standard Webhooks headers" }, 400);
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const timestampSeconds = Number(timestamp);
  if (!Number.isFinite(timestampSeconds) || Math.abs(nowSeconds - timestampSeconds) > TIMESTAMP_TOLERANCE_SECONDS) {
    return jsonResponse({ error: "Webhook timestamp outside tolerance" }, 401);
  }

  const body = await request.text();

  let expectedSignature: string;
  try {
    expectedSignature = await hmacBase64(secret, `${deliveryId}.${timestamp}.${body}`);
  } catch {
    return jsonResponse({ error: "Fill webhooks are not configured with a valid secret" }, 503);
  }

  const signatureMatches = signature
    .split(/\s+/)
    .filter((candidate) => candidate.startsWith("v1,"))
    .some((candidate) => timingSafeEqual(expectedSignature, candidate.slice(3)));
  if (!signatureMatches) {
    return jsonResponse({ error: "Invalid webhook signature" }, 401);
  }

  let payload: { type?: unknown; data?: { project?: { key?: unknown } } };
  try {
    payload = JSON.parse(body);
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  if (typeof payload.type !== "string" || !SUPPORTED_TYPES.has(payload.type)) {
    // Unknown event type: acknowledge and ignore.
    return new Response(null, { status: 202 });
  }

  const project = payload.data?.project?.key;
  if (typeof project !== "string" || !SUPPORTED_PROJECTS.has(project)) {
    // Project not in the cached set: acknowledge and ignore.
    return new Response(null, { status: 202 });
  }

  const refresh = refreshDownloadsPageCache(project, env.WEBSITE_CACHE);
  if (locals.cfContext) {
    locals.cfContext.waitUntil(refresh);
  } else {
    await refresh;
  }

  return new Response(null, { status: 202 });
};

async function hmacBase64(secret: string, content: string): Promise<string> {
  if (!secret.startsWith("whsec_")) {
    throw new Error("Invalid webhook secret prefix");
  }
  const keyBytes = base64ToBytes(secret.slice("whsec_".length));
  const key = await crypto.subtle.importKey("raw", keyBytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(content));
  return bytesToBase64(new Uint8Array(signature));
}

function base64ToBytes(value: string): Uint8Array<ArrayBuffer> {
  const decoded = atob(value);
  const bytes = new Uint8Array(decoded.length);
  for (let index = 0; index < decoded.length; index++) {
    bytes[index] = decoded.charCodeAt(index);
  }
  return bytes;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let difference = 0;
  for (let i = 0; i < a.length; i++) {
    difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return difference === 0;
}
