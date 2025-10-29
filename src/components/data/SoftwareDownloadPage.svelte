<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import SoftwareDownload from "@/components/data/SoftwareDownload.svelte";
  import type { DownloadsPageData } from "@/utils/download";

  interface Props {
    id: string;
    description?: string;
    experimentalWarning?: string;
    eol?: boolean;
    Description?: Snippet;
    data: DownloadsPageData;
  }

  let { id, description = undefined, experimentalWarning = undefined, eol = false, Description = undefined, data }: Props = $props();
</script>

{#if data.projectResult.error}
  <header class="mx-auto max-w-7xl px-4 pt-32 pb-16 lg:pt-48 lg:pb-26">
    <div class="font-semibold text-red-500">{data.projectResult.error}</div>
  </header>
{:else if data.projectResult.value}
  <SoftwareDownload
    {id}
    project={data.projectResult.value}
    stableBuilds={data.stableBuildsResult}
    experimentalBuilds={data.experimentalBuildsResult}
    {eol}
    {experimentalWarning}
    {Description}
    {description}
  />
{/if}
