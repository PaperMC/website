<script lang="ts">
  import type { Build, ProjectDescriptor } from "@/utils/types";
  import { onMount } from "svelte";

  interface Props {
    projectId: string;
    project: ProjectDescriptor | undefined;
    build: Build | undefined;
    version: string;
    compact?: boolean;
    eol?: boolean;
    disabled?: boolean;
  }

  let {
    projectId,
    project,
    build,
    version,
    compact = false,
    eol = false,
    disabled = false,
  }: Props = $props();

  let open = $state(false);
  let rootEl: HTMLDivElement | null = $state(null);
  let copied: Record<string, boolean> = $state({});

  function close() {
    open = false;
  }
  function toggle() {
    if (!disabled) open = !open;
  }
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

  type DownloadEntry = [
    string,
    { name: string; checksums: { sha256: string }; size: number; url: string },
  ];
  let downloadEntries = $derived(
    build ? (Object.entries(build.downloads) as DownloadEntry[]) : []
  );

  async function copyUrl(evt: MouseEvent, entry: DownloadEntry) {
    evt.preventDefault();
    evt.stopPropagation();
    const [, d] = entry;
    if (!d.url) return;
    try {
      await navigator.clipboard.writeText(d.url);
      copied[d.name] = true;
      copied = { ...copied };
      setTimeout(() => {
        copied[d.name] = false;
        copied = { ...copied };
      }, 2000);
    } catch (error) {
      console.error("Failed to copy URL to clipboard:", error);
    }
  }
</script>

<div class="relative w-max" bind:this={rootEl}>
  <div
    class={`rounded-lg flex flex-row transition-shadow transition-color hover:shadow-lg
      ${!compact ? "w-full md:w-100" : ""}
      ${eol ? "bg-channel-eol-primary" : `bg-channel-${build?.channel?.toLowerCase()}-primary`}
      ${eol ? "text-channel-eol-secondary" : `text-channel-${build?.channel?.toLowerCase()}-secondary`}
      ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
  >
    <a
      class={`flex flex-row flex-1 items-center ${compact ? "gap-2 pl-2 leading-0 py-1" : "gap-8 pl-5 py-3"}`}
      href={build?.downloads["server:default"]?.url}
      target="_blank"
      aria-disabled={disabled}
      onclick={(e) => disabled && (e.preventDefault(), e.stopPropagation())}
    >
      <div class={compact ? "w-4 h-4" : "w-8 h-8"}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>

      <div class="text-left flex-1 pr-2">
        {#if compact}
          <span class="font-medium text-sm">Download</span>
        {:else if projectId && build}
          <span class="font-medium text-lg">
            {project?.name ?? projectId}
            {version}
          </span>
          <p class="text-gray-100">{build ? `Build #${build.id}` : ""}</p>
        {:else}
          <div
            class="w-40 mb-2 h-6 rounded bg-gray-200/40 dark:bg-gray-700/40 animate-pulse"
          ></div>
          <div
            class="w-20 h-5 rounded bg-gray-200/30 dark:bg-gray-700/30 animate-pulse"
          ></div>
        {/if}
      </div>
    </a>

    <button
      class="leading-0 shrink-0 grid place-items-center cursor-pointer
             w-8 md:w-16 h-auto rounded-r-lg
             border-l border-white/20 dark:border-white/15
             hover:bg-white/10"
      aria-haspopup="menu"
      aria-expanded={open}
      onclick={toggle}
      disabled={disabled || !build}
      title="More downloads"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class={`text-gray-200 ${compact ? "w-4 h-4" : "w-5 h-5"}`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
      <span class="sr-only">Toggle downloads menu</span>
    </button>

    <div
      class={`absolute mt-2 rounded-md bg-background-light-10 shadow-lg divide-y divide-gray-200 border border-gray-200 dark:bg-background-dark-80 dark:divide-gray-800 dark:border-gray-800 z-40
              ${compact ? "origin-top-right right-0" : "origin-top-left left-0 w-full md:w-auto"}
              ${open ? "block opacity-100" : "hidden opacity-0"}`}
      role="menu"
    >
      {#if build}
        {#each downloadEntries as entry}
          <a
            class="block hover:bg-blue-100 dark:hover:bg-gray-800 transition-colors"
            href={build?.downloads["server:default"]?.url}
            target="_blank"
            role="menuitem"
            onclick={() => (open = false)}
          >
            <div class="px-4 py-3">
              <div class="font-medium flex items-center gap-2 flex-wrap">
                <span>{entry[1].name}</span>
                {#if entry[0] === "application"}
                  <span
                    class="text-xs rounded-full py-0.5 px-2 bg-yellow-200/80 text-yellow-800"
                    >Recommended</span
                  >
                {/if}
                {#if copied[entry[1].name]}
                  <span
                    class="text-xs rounded-full py-0.5 px-2 bg-green-200/80 text-green-800"
                    >Copied</span
                  >
                {/if}
              </div>

              <div
                class="text-gray-700 dark:text-gray-300 text-xs inline-flex items-center w-full mt-1"
              >
                <span class="truncate">{entry[1].checksums.sha256}</span>
                <button
                  class="ml-2 size-6 inline-flex items-center justify-center rounded hover:bg-black/5 dark:hover:bg-white/5"
                  onclick={(e) => copyUrl(e, entry)}
                  title="Copy URL"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 512 512"
                    class="size-4"
                  >
                    <path
                      d="M64 464H288c8.8 0 16-7.2 16-16V384h48v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h64v48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16zM224 304H448c8.8 0 16-7.2 16-16V64c0-8.8-7.2-16-16-16H224c-8.8 0-16 7.2-16 16V288c0 8.8 7.2 16 16 16zm-64-16V64c0-35.3 28.7-64 64-64H448c35.3 0 64 28.7 64 64V288c0 35.3-28.7 64-64 64H224c-35.3 0-64-28.7-64-64z"
                    />
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
  .size-4 {
    width: 1rem;
    height: 1rem;
  }
  .size-6 {
    width: 1.5rem;
    height: 1.5rem;
  }
  .size-8 {
    width: 2rem;
    height: 2rem;
  }

  [role="menu"] {
    top: 100%;
    transition: opacity 0.25s ease;
  }
</style>
