<script lang="ts">
  import { onMount } from "svelte";
  import type { DownloadsLiveStatus } from "@/utils/download";

  interface Props {
    id: string;
    status: DownloadsLiveStatus;
  }

  let { id, status }: Props = $props();
  let container: HTMLDivElement;
  let open = $state(false);

  const LABELS: Record<DownloadsLiveStatus, string> = {
    connecting: "Connecting",
    live: "Live",
    reconnecting: "Reconnecting",
    paused: "Paused",
    offline: "Offline",
  };

  const DETAILS: Record<DownloadsLiveStatus, string> = {
    connecting: "Connecting…",
    live: "Watching for new builds.",
    reconnecting: "Reconnecting. The displayed information may be out of date.",
    paused: "Updates pause while this tab is hidden.",
    offline: "You're offline. Updates will resume when you reconnect.",
  };

  const DOT_CLASSES: Record<DownloadsLiveStatus, string> = {
    connecting: "bg-amber-400 animate-pulse",
    live: "bg-green-500",
    reconnecting: "bg-amber-400 animate-pulse",
    paused: "bg-gray-400",
    offline: "bg-red-500",
  };

  const panelId = $derived(`${id}-details`);
  const headingId = $derived(`${id}-heading`);

  onMount(() => {
    function handleOutsidePointer(event: PointerEvent) {
      if (open && event.target instanceof Node && !container.contains(event.target)) open = false;
    }

    document.addEventListener("pointerdown", handleOutsidePointer);
    return () => document.removeEventListener("pointerdown", handleOutsidePointer);
  });

  function handleClick() {
    open = !open;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key !== "Escape") return;
    open = false;
    (event.currentTarget as HTMLButtonElement).blur();
  }
</script>

<div class="relative ml-auto shrink-0" bind:this={container}>
  <button
    type="button"
    class="flex items-center justify-center gap-2 rounded-full border border-gray-300 px-3 py-1 text-xs whitespace-nowrap text-gray-700 transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
    aria-label={`Live download updates: ${LABELS[status]}`}
    aria-live="polite"
    aria-expanded={open}
    aria-controls={panelId}
    onclick={handleClick}
    onkeydown={handleKeydown}
  >
    <span class={`h-2 w-2 shrink-0 rounded-full ${DOT_CLASSES[status]}`}></span>
    <span>{LABELS[status]}</span>
  </button>

  {#if open}
    <div
      id={panelId}
      role="note"
      aria-labelledby={headingId}
      class="absolute top-full right-0 z-50 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-3 text-left text-sm leading-5 text-gray-700 shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
    >
      <p id={headingId} class="font-medium text-gray-900 dark:text-white">Live updates</p>
      <p class="mt-1">This page updates automatically when new builds are available.</p>
      <p class="mt-2"><span class="font-medium">Current status:</span> {DETAILS[status]}</p>
    </div>
  {/if}
</div>
