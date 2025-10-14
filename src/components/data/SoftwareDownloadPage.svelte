<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import SoftwareDownload from "@/components/data/SoftwareDownload.svelte";
  import type { ProjectDescriptor } from "@/utils/types";
  import { getProjectDescriptor } from "@/utils/download";

  interface Props {
    id: string;
    description?: string;
    experimentalWarning?: string;
    eol?: boolean;
    Description?: Snippet;
  }

  let {
    id,
    description = undefined,
    experimentalWarning = undefined,
    eol = false,
    Description = undefined,
  }: Props = $props();

  let project: ProjectDescriptor | null = $state(null);
  let loading = $state(true);
  let error: string | null = $state(null);

  onMount(async () => {
    try {
      project = await getProjectDescriptor(id);
      if (!project) error = `Project '${id}' not found.`;
    } catch (e) {
      error = `Failed to load project '${id}'.`;
      console.error(e);
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <header class="max-w-7xl mx-auto px-4 pt-32 pb-16 lg:pt-48 lg:pb-26">
    <div class="animate-pulse h-8 w-48 rounded bg-gray-800/40"></div>
    <div class="mt-6 space-y-3">
      <div class="h-6 w-3/4 rounded bg-gray-800/30"></div>
      <div class="h-6 w-2/3 rounded bg-gray-800/20"></div>
    </div>
  </header>
{:else if error}
  <header class="max-w-7xl mx-auto px-4 pt-32 pb-16 lg:pt-48 lg:pb-26">
    <div class="text-red-500 font-semibold">{error}</div>
  </header>
{:else if project}
  <SoftwareDownload
    {id}
    {project}
    {eol}
    {experimentalWarning}
    {Description}
    {description}
  />
{/if}
