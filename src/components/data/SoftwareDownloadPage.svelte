<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import SoftwareDownload from '@/components/data/SoftwareDownload.svelte';
  import type { ProjectDescriptor } from '@/utils/types';

  interface Props {
    id: string;
    description?: string;
    experimentalWarning?: string;
    eol?: boolean;
    Description?: Snippet;
    project: { error?: string; value?: ProjectDescriptor };
  }

  let { id, description = undefined, experimentalWarning = undefined, eol = false, Description = undefined, project }: Props = $props();
</script>

{#if project.error}
  <header class="mx-auto max-w-7xl px-4 pt-32 pb-16 lg:pt-48 lg:pb-26">
    <div class="font-semibold text-red-500">{project.error}</div>
  </header>
{:else if project.value}
  <SoftwareDownload {id} project={project.value} {eol} {experimentalWarning} {Description} {description} />
{/if}
