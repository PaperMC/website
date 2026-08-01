<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import SoftwareGitHubDownloadButton from "@/components/data/SoftwareGitHubDownloadButton.svelte";

  interface Project {
    name: string;
    icon?: string;
  }

  const projects: Record<string, Project> = {
    "paperclip-rs": { name: "Paperclip-rs" },
  };

  interface Props {
    id: string;
    description?: string;
    experimentalWarning?: string;
    eol?: boolean;
    Description?: Snippet;
    repository: string;
  }

  let {
    id,
    description = undefined,
    experimentalWarning = undefined,
    eol = false,
    Description = undefined,
    repository,
  }: Props = $props();

  let project = $derived(projects[id])

  let version = "vUnknown"
</script>

<header class="mx-auto flex max-w-7xl flex-row flex-wrap gap-16 px-4 pt-32 pb-16 lg:pt-48 lg:pb-26">
  <div class="flex-1">
    <div class="mb-6 flex flex-row items-center gap-4">
      <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800 p-3">
        {#if project.icon}
          <img src={project.icon!} alt={`${project.name} logo`} class="h-full w-full object-contain" />
        {/if}
      </div>
      <h1 class="text-xl font-medium">Downloads</h1>
    </div>

    <h2 class="text-4xl leading-normal font-medium lg:text-5xl lg:leading-normal">
      Get {project.name}
      <span class="stable">{version}</span>
    </h2>

    <p class="mt-4 text-xl">
      {#if Description}
        {@render Description()}
      {:else if typeof description === "string"}
        {@html description}
      {/if}
    </p>

    <div class="mt-8 flex flex-col gap-4">
      <SoftwareGitHubDownloadButton
        repository={repository}
        version={version}
        asset="none"
        eol={!!eol}
        disabled={false}
      />
    </div>

    <section id="builds" class="mt-20">
<!--      <SoftwareBuilds project={id} {version} builds={builds.value.builds} eol={!!eol} />-->
    </section>

    <div class="hidden"></div>
  </div>
</header>

