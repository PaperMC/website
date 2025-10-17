<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import SoftwareDownload from "@/components/data/SoftwareDownload.svelte";
  import type { ProjectBuildsOrError, ProjectDescriptorOrError } from "@/utils/download";

  interface Props {
    id: string;
    description?: string;
    experimentalWarning?: string;
    eol?: boolean;
    Description?: Snippet;
    project: ProjectDescriptorOrError;
    builds: ProjectBuildsOrError;
  }

  let {
    id,
    description = undefined,
    experimentalWarning = undefined,
    eol = false,
    Description = undefined,
    project,
    builds,
  }: Props = $props();
</script>

{#if project.error}
  <header class="mx-auto max-w-7xl px-4 pt-32 pb-16 lg:pt-48 lg:pb-26">
    <div class="font-semibold text-red-500">{project.error}</div>
  </header>
{:else if project.value}
  <SoftwareDownload {id} project={project.value} {builds} {eol} {experimentalWarning} {Description} {description} />
{/if}
