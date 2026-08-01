<script lang="ts">
  import { onMount } from "svelte";

  interface Props {
    repository: string;
    version: string;
    asset: string;
    compact?: boolean;
    eol?: boolean;
    disabled?: boolean;
  }

  let { repository, version, asset, compact = false, eol = false, disabled = false }: Props = $props();

  let url = $derived(`https://github.com/${repository}/releases/download/${version}/${asset}`);

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

  type DownloadEntry = [string, { name: string; checksums: { sha256: string }; size: number; url: string }];

  async function copySha256(evt: MouseEvent, entry: DownloadEntry) {
    evt.preventDefault();
    evt.stopPropagation();
    const [, d] = entry;
    if (!d.checksums.sha256) return;
    try {
      await navigator.clipboard.writeText(d.checksums.sha256);
      copied[d.name] = true;
      copied = { ...copied };
      setTimeout(() => {
        copied[d.name] = false;
        copied = { ...copied };
      }, 2000);
    } catch (error) {
      console.error("Failed to copy SHA256 checksum to clipboard:", error);
    }
  }
</script>

<div class="relative flex w-full flex-row md:w-100" bind:this={rootEl}>
  <div
    class={`btn transition-color flex flex-row rounded-md
      ${!compact ? "w-full md:w-100" : ""}
      ${eol ? "btn-eol" : `btn-stable`}
      ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
  >
    <a
      class={`flex flex-1 flex-row items-center ${compact ? "gap-2 py-1 pl-2 leading-0" : "gap-8 py-3 pl-5"}`}
      href={url}
      target="_blank"
      aria-disabled={disabled}
      onclick={(e) => disabled && (e.preventDefault(), e.stopPropagation())}
    >
      <div class={compact ? "h-4 w-4" : "h-8 w-8"}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>

      <div class="flex-1 pr-2 text-left">
        <span class="text-sm font-medium">Download</span>
      </div>
    </a>
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
