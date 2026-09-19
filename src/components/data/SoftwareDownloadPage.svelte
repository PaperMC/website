<script lang="ts">
  import { onMount, untrack, type Snippet } from "svelte";
  import SoftwareDownload from "@/components/data/SoftwareDownload.svelte";
  import type { DownloadProjectId, DownloadsLiveStatus, DownloadsPageSnapshot } from "@/utils/download";
  import { DOWNLOADS_LIVE_PATH } from "@/utils/downloads-live-path";

  interface Props {
    id: DownloadProjectId;
    description?: string;
    experimentalWarning?: string;
    eol?: boolean;
    Description?: Snippet;
    snapshot: DownloadsPageSnapshot;
  }

  let { id, description = undefined, experimentalWarning = undefined, eol = false, Description = undefined, snapshot }: Props = $props();
  let current = $state.raw(untrack(() => snapshot));
  let liveStatus = $state<DownloadsLiveStatus>("connecting");
  let updateNotification = $state(0);

  onMount(() => {
    let socket: WebSocket | undefined;
    let hiddenTimer: ReturnType<typeof setTimeout> | undefined;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    let reconnectAttempt = 0;
    let destroyed = false;
    let paused = false;
    let hasConnected = false;

    function sendHello() {
      socket?.send(
        JSON.stringify({ type: "hello", streamId: current.streamId, generation: current.generation, revision: current.revision })
      );
    }

    function connect() {
      if (destroyed || paused || socket || reconnectTimer) return;
      if (!navigator.onLine) {
        liveStatus = "offline";
        return;
      }
      if (document.visibilityState !== "visible") return;
      liveStatus = hasConnected ? "reconnecting" : "connecting";
      const protocol = location.protocol === "https:" ? "wss:" : "ws:";
      const connection = new WebSocket(`${protocol}//${location.host}${DOWNLOADS_LIVE_PATH}?project=${encodeURIComponent(id)}`);
      socket = connection;
      connection.addEventListener("open", () => {
        if (socket !== connection) return;
        hasConnected = true;
        reconnectAttempt = 0;
        liveStatus = "live";
        sendHello();
      });
      connection.addEventListener("message", (event) => {
        if (socket !== connection) return;
        if (typeof event.data !== "string") return;
        let message: unknown;
        try {
          message = JSON.parse(event.data);
        } catch {
          return;
        }
        if (!isSnapshotMessage(message) || message.project !== id) return;

        const streamChanged = message.streamId !== current.streamId;
        if (
          streamChanged ||
          message.generation > current.generation ||
          (message.authoritative === true && message.generation === current.generation)
        ) {
          const dataChanged = streamChanged || message.generation > current.generation || message.revision !== current.revision;
          current = { streamId: message.streamId, generation: message.generation, revision: message.revision, data: message.data };
          if (dataChanged) {
            updateNotification++;
          }
        } else if (message.generation === current.generation && message.revision !== current.revision) {
          console.error("Downloads snapshot revision conflict", {
            project: id,
            generation: current.generation,
            currentRevision: current.revision,
            incomingRevision: message.revision,
          });
          socket?.send(
            JSON.stringify({ type: "resync", streamId: current.streamId, generation: current.generation, revision: current.revision })
          );
        }
      });
      connection.addEventListener("close", () => {
        if (socket !== connection) return;
        socket = undefined;
        scheduleReconnect();
      });
      connection.addEventListener("error", () => connection.close());
    }

    function scheduleReconnect() {
      if (destroyed || paused || reconnectTimer) return;
      if (!navigator.onLine) {
        liveStatus = "offline";
        return;
      }
      if (document.visibilityState !== "visible") return;
      liveStatus = "reconnecting";
      const delay = Math.min(30_000, 1_000 * 2 ** reconnectAttempt) * (0.75 + Math.random() * 0.5);
      reconnectAttempt++;
      reconnectTimer = setTimeout(() => {
        reconnectTimer = undefined;
        connect();
      }, delay);
    }

    function closeSocket(status: "paused" | "offline") {
      paused = true;
      liveStatus = status;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      reconnectTimer = undefined;
      socket?.close(1000, "Page inactive");
      socket = undefined;
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        if (hiddenTimer) clearTimeout(hiddenTimer);
        hiddenTimer = setTimeout(() => {
          hiddenTimer = undefined;
          if (document.visibilityState === "hidden") closeSocket("paused");
        }, 30_000);
      } else {
        if (hiddenTimer) clearTimeout(hiddenTimer);
        hiddenTimer = undefined;
        paused = false;
        connect();
      }
    }

    function handlePageHide() {
      closeSocket("paused");
    }

    function handlePageShow() {
      paused = false;
      connect();
    }

    function handleOnline() {
      paused = false;
      connect();
    }

    function handleOffline() {
      closeSocket("offline");
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    connect();

    return () => {
      destroyed = true;
      if (hiddenTimer) clearTimeout(hiddenTimer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      closeSocket("paused");
    };
  });

  function isSnapshotMessage(value: unknown): value is DownloadsPageSnapshot & {
    type: "snapshot";
    project: DownloadProjectId;
    authoritative?: boolean;
  } {
    if (typeof value !== "object" || value === null) return false;
    const message = value as Record<string, unknown>;
    return (
      message.type === "snapshot" &&
      typeof message.project === "string" &&
      typeof message.streamId === "string" &&
      Number.isSafeInteger(message.generation) &&
      typeof message.revision === "string" &&
      typeof message.data === "object" &&
      message.data !== null
    );
  }
</script>

{#if current.data.projectResult.error}
  <header class="mx-auto max-w-7xl px-4 pt-32 pb-16 lg:pt-48 lg:pb-26">
    <div class="font-semibold text-red-500">{current.data.projectResult.error}</div>
  </header>
{:else if current.data.projectResult.value}
  <SoftwareDownload
    {id}
    project={current.data.projectResult.value}
    stableBuilds={current.data.stableBuildsResult}
    experimentalBuilds={current.data.experimentalBuildsResult}
    {eol}
    {experimentalWarning}
    {Description}
    {description}
    {liveStatus}
    {updateNotification}
  />
{/if}
