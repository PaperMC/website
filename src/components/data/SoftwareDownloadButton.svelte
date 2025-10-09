<script lang="ts">
  import type { Build, ProjectDescriptor } from "@/utils/types";
  import { onMount } from "svelte";

  export let projectId: string;
  export let project: ProjectDescriptor | undefined;
  export let build: Build | undefined;
  export let version!: string;
  export let stable!: boolean;
  export let compact: boolean = false;
  export let eol: boolean = false;
  export let disabled: boolean = false;

  let open = false;
  let rootEl: HTMLDivElement | null = null;
  let copied: Record<string, boolean> = {};

  function close() { open = false; }
  function toggle() { if (!disabled) open = !open; }
  function onDocumentClick(ev: MouseEvent) {
    const t = ev.target as HTMLElement | null;
    if (!rootEl) return;
    if (t && rootEl.contains(t)) return;
    close();
  }
  onMount(() => {
    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  });

  type DownloadEntry = [string, { name: string; checksums: { sha256: string }; size: number; url: string }];
  $: downloadEntries = build ? (Object.entries(build.downloads) as DownloadEntry[]) : [];

  function primaryEntry(): DownloadEntry | undefined {
    if (!build) return undefined;
    const preferred = downloadEntries.find(([k]) => k === "server:default");
    return preferred ?? downloadEntries[0];
  }

  function hrefFor(entry?: DownloadEntry) {
    if (!entry) return undefined;
    const [, d] = entry;
    return d.url;
  }

  async function copyUrl(evt: MouseEvent, entry: DownloadEntry) {
    evt.preventDefault();
    evt.stopPropagation();
    const [, d] = entry;
    if (!d.url) return;
    await navigator.clipboard.writeText(d.url);
    copied[d.name] = true; copied = { ...copied };
    setTimeout(() => { copied[d.name] = false; copied = { ...copied }; }, 2000);
  }

  function buttonToneClass() {
    return (stable && !eol) ? "bg-blue-600 hover:bg-blue-500" : "bg-red-500 hover:bg-red-400";
  }
</script>

<div class="relative w-max" bind:this={rootEl}>
  <div
    class={`rounded-lg flex flex-row transition-shadow text-white hover:shadow-lg ${buttonToneClass()} ${!compact ? "w-full md:w-100" : ""} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
  >
    <a
      class={`flex flex-row flex-1 items-center ${compact ? "gap-2 pl-2 leading-0 py-1" : "gap-8 pl-5 py-3"}`}
      href={build?.downloads["server:default"]?.url}
      target="_blank"
      aria-disabled={disabled}
      on:click={(e) => disabled && (e.preventDefault(), e.stopPropagation())}
    >
      <div aria-hidden="true">
        <svg
          class={compact ? "size-4" : "size-8"}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M14.25 10.5v-6.75a.75.75 0 0 0-.75-.75h-6a.75.75 0 0 0-.75.75v15a.75.75 0 0 0 .75.75h9a.75.75 0 0 0 .75-.75v-9h-3z" />
          <path d="M14.25 3.75 18 7.5" />
          <path d="M12 12v5.25" />
          <path d="M9.75 15.75 12 18l2.25-2.25" />
        </svg>
      </div>

      <div class="text-left flex-1 border-r border-gray-300/50 pr-3">
        {#if compact}
          <span class="font-medium text-sm">Download</span>
        {:else if projectId && build}
          <span class="font-medium text-lg">
            {project?.name ?? projectId} {version}
          </span>
          <p class="text-gray-100">{build ? `Build #${build.id}` : ""}</p>
        {:else}
          <div class="w-40 mb-2 h-6 rounded bg-gray-200/40 dark:bg-gray-700/40 animate-pulse"></div>
          <div class="w-20 h-5 rounded bg-gray-200/30 dark:bg-gray-700/30 animate-pulse"></div>
        {/if}
      </div>
    </a>

    <button
      class="leading-0 flex items-center justify-center cursor-pointer px-3 md:px-5"
      aria-haspopup="menu"
      aria-expanded={open}
      on:click={toggle}
      disabled={disabled || !build}
      title="More downloads"
    >
      <svg
        class={`text-gray-200 transition-transform ${compact ? "size-4" : "size-6"} ${open ? "rotate-180" : ""}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
      <span class="sr-only">Toggle downloads menu</span>
    </button>

    <div
      class={`absolute mt-2 rounded-md bg-background-light-10 shadow-lg divide-y divide-gray-200 border border-gray-200 dark:bg-background-dark-80 dark:divide-gray-800 dark:border-gray-800 z-40
              ${compact ? "origin-top-right right-0" : "origin-top-left left-0 w-full md:w-auto"}
              ${open ? "block opacity-100" : "hidden opacity-0"}`}
      role="menu"
      aria-expanded={open}
    >
      {#if build}
        {#each downloadEntries as entry}
          <a
            class="block hover:bg-blue-100 dark:hover:bg-gray-800 transition-colors"
            href={build?.downloads["server:default"]?.url}
            target="_blank"
            role="menuitem"
            on:click={() => (open = false)}
          >
            <div class="px-4 py-3">
              <div class="font-medium flex items-center gap-2 flex-wrap">
                <span>{entry[1].name}</span>
                {#if entry[0] === "application"}
                  <span class="text-xs rounded-full py-0.5 px-2 bg-yellow-200/80 text-yellow-800">Recommended</span>
                {/if}
                {#if copied[entry[1].name]}
                  <span class="text-xs rounded-full py-0.5 px-2 bg-green-200/80 text-green-800">Copied</span>
                {/if}
              </div>

              <div class="text-gray-700 dark:text-gray-300 text-xs inline-flex items-center w-full mt-1">
                <span class="truncate">{entry[1].checksums}</span>
                <button
                  class="ml-2 size-6 inline-flex items-center justify-center rounded hover:bg-black/5 dark:hover:bg-white/5"
                  on:click={(e) => copyUrl(e, entry[1].url)}
                  title="Copy URL"
                >
                  <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M9 9h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z" />
                    <path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
              </div>
            </div>
          </a>
        {/each}
      {/if}
    </div>
  </div>
</div>

<style>
  .size-4 { width: 1rem; height: 1rem; }
  .size-6 { width: 1.5rem; height: 1.5rem; }
  .size-8 { width: 2rem; height: 2rem; }

  [role="menu"] {
    top: 100%;
    transition: opacity 0.25s ease;
  }
</style>
