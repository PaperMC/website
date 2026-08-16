import { DurableObject } from "cloudflare:workers";
import {
  type DownloadProjectId,
  type DownloadRegion,
  type DownloadsPageSnapshot,
  DOWNLOAD_REGIONS,
  downloadRegionForContinent,
  downloadsPageDataKvKey,
  downloadsPageDataRevision,
  fetchDownloadsPageData,
  isDownloadProjectId,
  isValidDownloadsPageData,
} from "./utils/download";
import { DOWNLOADS_LIVE_PATH } from "./utils/downloads-live-path";

type CoordinatorState = DownloadsPageSnapshot & { project: DownloadProjectId };
type PublishRequest = CoordinatorState & { region: DownloadRegion };
type ClientMessage = { type: "hello" | "resync"; streamId: string; generation: number; revision: string };

const COMMITTED_KEY = "committed";
const PENDING_KEY = "pending";

export function downloadRegionForRequest(request: Request): DownloadRegion {
  const continent = request.cf?.continent;
  return downloadRegionForContinent(typeof continent === "string" ? continent : undefined);
}

export function coordinatorStub(env: Env, project: DownloadProjectId): DurableObjectStub {
  return env.DOWNLOAD_UPDATES.getByName(`updates:${project}`);
}

export function downloadShardStub(env: Env, project: DownloadProjectId, region: DownloadRegion): DurableObjectStub {
  return env.DOWNLOAD_CLIENTS.getByName(`downloads:${project}:${region}`, { locationHint: region });
}

export async function requestDownloadsRefresh(env: Env, project: DownloadProjectId, deliveryId?: string): Promise<void> {
  const response = await coordinatorStub(env, project).fetch("https://downloads.internal/refresh", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ project, deliveryId }),
  });
  if (!response.ok) throw new Error(`Downloads refresh failed for ${project}: ${response.status} ${await response.text()}`);
}

export class DownloadsUpdateCoordinator extends DurableObject<Env> {
  private refreshQueue: Promise<void> = Promise.resolve();

  override async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/snapshot") {
      const snapshot = await this.latestState();
      return snapshot ? Response.json(snapshot) : new Response(null, { status: 404 });
    }

    if (request.method !== "POST" || url.pathname !== "/refresh") return new Response("Not found", { status: 404 });

    const body = (await request.json()) as { project?: unknown; deliveryId?: unknown };
    if (!isDownloadProjectId(body.project)) return new Response("Invalid project", { status: 400 });
    const project = body.project;
    const deliveryId = typeof body.deliveryId === "string" ? body.deliveryId : undefined;

    const refresh = this.refreshQueue.then(() => this.refresh(project, deliveryId));
    this.refreshQueue = refresh.catch(() => undefined);
    try {
      await refresh;
      return new Response(null, { status: 204 });
    } catch (error) {
      log("downloads_refresh_failed", { project, deliveryId, error: errorMessage(error) });
      return new Response("Refresh failed", { status: 502 });
    }
  }

  private async refresh(project: DownloadProjectId, deliveryId?: string): Promise<void> {
    const startedAt = Date.now();
    log("downloads_refresh_started", { project, deliveryId });

    await this.recoverPending();
    const committed = await this.ctx.storage.get<CoordinatorState>(COMMITTED_KEY);
    const data = await fetchDownloadsPageData(project);
    if (!isValidDownloadsPageData(data)) throw new Error("Fill returned an incomplete downloads snapshot");

    const revision = await downloadsPageDataRevision(data);
    if (committed?.revision === revision) {
      await this.publishToRegions(committed);
      log("downloads_refresh_unchanged", {
        project,
        deliveryId,
        generation: committed.generation,
        revision,
        durationMs: Date.now() - startedAt,
      });
      return;
    }

    const next: CoordinatorState = {
      project,
      streamId: committed?.streamId ?? crypto.randomUUID(),
      generation: (committed?.generation ?? 0) + 1,
      revision,
      data,
    };
    await this.ctx.storage.put(PENDING_KEY, next);
    await this.env.WEBSITE_CACHE.put(downloadsPageDataKvKey(project), JSON.stringify(snapshotWithoutProject(next)));
    await this.ctx.storage.transaction(async (transaction) => {
      await transaction.put(COMMITTED_KEY, next);
      await transaction.delete(PENDING_KEY);
    });
    await this.publishToRegions(next);
    log("downloads_refresh_succeeded", {
      project,
      deliveryId,
      generation: next.generation,
      revision,
      durationMs: Date.now() - startedAt,
    });
  }

  private async recoverPending(): Promise<void> {
    const pending = await this.ctx.storage.get<CoordinatorState>(PENDING_KEY);
    if (!pending) return;

    await this.env.WEBSITE_CACHE.put(downloadsPageDataKvKey(pending.project), JSON.stringify(snapshotWithoutProject(pending)));
    await this.ctx.storage.transaction(async (transaction) => {
      await transaction.put(COMMITTED_KEY, pending);
      await transaction.delete(PENDING_KEY);
    });
    await this.publishToRegions(pending);
    log("downloads_refresh_recovered", {
      project: pending.project,
      generation: pending.generation,
      revision: pending.revision,
    });
  }

  private async latestState(): Promise<CoordinatorState | undefined> {
    return this.ctx.storage.get<CoordinatorState>(COMMITTED_KEY);
  }

  private async publishToRegions(snapshot: CoordinatorState): Promise<void> {
    await Promise.all(
      DOWNLOAD_REGIONS.map(async (region) => {
        const startedAt = Date.now();
        let lastError: unknown;
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            const response = await downloadShardStub(this.env, snapshot.project, region).fetch("https://downloads.internal/publish", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ ...snapshot, region } satisfies PublishRequest),
            });
            if (!response.ok) throw new Error(`Shard returned ${response.status}`);
            log("downloads_shard_published", {
              project: snapshot.project,
              region,
              generation: snapshot.generation,
              attempt,
              durationMs: Date.now() - startedAt,
            });
            return;
          } catch (error) {
            lastError = error;
          }
        }
        log("downloads_shard_publish_failed", {
          project: snapshot.project,
          region,
          generation: snapshot.generation,
          error: errorMessage(lastError),
        });
      })
    );
  }
}

export class DownloadsWebSocketShard extends DurableObject<Env> {
  override async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "POST" && url.pathname === "/publish") {
      const snapshot = (await request.json()) as PublishRequest;
      if (!isDownloadProjectId(snapshot.project) || !DOWNLOAD_REGIONS.includes(snapshot.region)) {
        return new Response("Invalid snapshot", { status: 400 });
      }
      await this.acceptSnapshot(snapshot);
      return new Response(null, { status: 204 });
    }

    if (url.pathname !== DOWNLOADS_LIVE_PATH || request.headers.get("upgrade")?.toLowerCase() !== "websocket") {
      return new Response("Expected WebSocket", { status: 426 });
    }

    const project = url.searchParams.get("project");
    const region = url.searchParams.get("region");
    if (!isDownloadProjectId(project) || !isDownloadRegion(region)) return new Response("Invalid subscription", { status: 400 });

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    server.serializeAttachment({ project, region });
    this.ctx.acceptWebSocket(server);
    log("download_ws_open", { project, region, connections: this.ctx.getWebSockets().length });
    return new Response(null, { status: 101, webSocket: client });
  }

  override async webSocketMessage(webSocket: WebSocket, message: string | ArrayBuffer): Promise<void> {
    if (typeof message !== "string") return;
    let hello: ClientMessage;
    try {
      hello = JSON.parse(message) as ClientMessage;
    } catch {
      return;
    }
    if (
      (hello.type !== "hello" && hello.type !== "resync") ||
      typeof hello.streamId !== "string" ||
      !Number.isSafeInteger(hello.generation) ||
      typeof hello.revision !== "string"
    ) {
      return;
    }

    const attachment = webSocket.deserializeAttachment() as { project: DownloadProjectId; region: DownloadRegion };
    let local = await this.ctx.storage.get<CoordinatorState>(COMMITTED_KEY);
    if (hello.type === "resync" || !local || local.streamId !== hello.streamId || local.generation < hello.generation) {
      const response = await coordinatorStub(this.env, attachment.project).fetch("https://downloads.internal/snapshot");
      if (response.ok) {
        const latest = (await response.json()) as CoordinatorState;
        await this.acceptSnapshot({ ...latest, region: attachment.region });
        local = latest;
      }
    }

    if (!local) return;
    if (hello.type === "resync") {
      webSocket.send(JSON.stringify({ type: "snapshot", shard: attachment.region, authoritative: true, ...local }));
      return;
    }
    if (
      local.streamId !== hello.streamId ||
      local.generation > hello.generation ||
      (local.generation === hello.generation && local.revision !== hello.revision)
    ) {
      webSocket.send(JSON.stringify({ type: "snapshot", shard: attachment.region, ...local }));
    }
  }

  override webSocketClose(webSocket: WebSocket, code: number, reason: string): void {
    const attachment = webSocket.deserializeAttachment() as { project?: string; region?: string } | null;
    log("download_ws_close", {
      project: attachment?.project,
      region: attachment?.region,
      code,
      reason,
      connections: this.ctx.getWebSockets().length,
    });
    webSocket.close(code, reason);
  }

  override webSocketError(webSocket: WebSocket, error: unknown): void {
    const attachment = webSocket.deserializeAttachment() as { project?: string; region?: string } | null;
    log("download_ws_error", { project: attachment?.project, region: attachment?.region, error: errorMessage(error) });
  }

  private async acceptSnapshot(snapshot: PublishRequest): Promise<void> {
    const current = await this.ctx.storage.get<CoordinatorState>(COMMITTED_KEY);
    if (current?.streamId === snapshot.streamId && current.generation > snapshot.generation) return;
    if (current?.streamId === snapshot.streamId && current.generation === snapshot.generation && current.revision === snapshot.revision)
      return;
    if (current?.streamId === snapshot.streamId && current.generation === snapshot.generation && current.revision !== snapshot.revision) {
      throw new Error(`Conflicting revision for generation ${snapshot.generation}`);
    }

    const stored: CoordinatorState = {
      project: snapshot.project,
      streamId: snapshot.streamId,
      generation: snapshot.generation,
      revision: snapshot.revision,
      data: snapshot.data,
    };
    await this.ctx.storage.put(COMMITTED_KEY, stored);

    const message = JSON.stringify({ type: "snapshot", shard: snapshot.region, ...stored });
    const sockets = this.ctx.getWebSockets();
    const startedAt = Date.now();
    let sent = 0;
    let failed = 0;
    for (const socket of sockets) {
      try {
        socket.send(message);
        sent++;
      } catch {
        failed++;
      }
    }
    log("download_broadcast", {
      project: snapshot.project,
      region: snapshot.region,
      generation: snapshot.generation,
      revision: snapshot.revision,
      payloadBytes: new TextEncoder().encode(message).byteLength,
      recipients: sockets.length,
      sent,
      failed,
      durationMs: Date.now() - startedAt,
    });
  }
}

function isDownloadRegion(value: string | null): value is DownloadRegion {
  return value !== null && DOWNLOAD_REGIONS.some((region) => region === value);
}

function snapshotWithoutProject(snapshot: CoordinatorState): DownloadsPageSnapshot {
  return { streamId: snapshot.streamId, generation: snapshot.generation, revision: snapshot.revision, data: snapshot.data };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function log(event: string, fields: Record<string, unknown>): void {
  console.log(JSON.stringify({ event, ...fields }));
}
