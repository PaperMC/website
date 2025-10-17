<script lang="ts">
  import type { ProjectDescriptor } from "@/utils/types";

  import SoftwareDownloadButton from "@/components/data/SoftwareDownloadButton.svelte";
  import SoftwareBuilds from "@/components/data/SoftwareBuilds.svelte";

  import PaperIconUrl from "@/assets/brand/paper.svg?url";
  import VelocityIconUrl from "@/assets/brand/velocity.svg?url";
  import FoliaIconUrl from "@/assets/brand/folia.svg?url";
  import WaterfallIconUrl from "@/assets/brand/waterfall.svg?url";
  import type { Snippet } from "svelte";
  import { fetchBuildsOrError, type ProjectBuildsOrError } from "@/utils/download";
  import { watch } from "runed";

  interface Props {
    id: "paper" | "velocity" | "folia" | "waterfall" | (string & {});
    project: ProjectDescriptor;
    builds: ProjectBuildsOrError;
    description?: string;
    Description?: Snippet;
    experimentalWarning?: string;
    eol?: boolean;
  }

  let {
    id,
    project,
    builds,
    description = undefined,
    Description = undefined,
    experimentalWarning = undefined,
    eol = false,
  }: Props = $props();

  const ICONS: Record<string, string | undefined> = {
    paper: PaperIconUrl,
    velocity: VelocityIconUrl,
    folia: FoliaIconUrl,
    waterfall: WaterfallIconUrl,
  };

  let isStable = $state(true);

  let version = $derived(isStable ? project?.latestStableVersion : (project?.latestExperimentalVersion ?? project?.latestStableVersion));

  function toggleStable() {
    isStable = !isStable;
  }

  function channelClass(channel?: string) {
    if (eol) return "text-channel-eol-primary";
    const c = (channel ?? "").toLowerCase();
    return `text-channel-${c}-primary`;
  }

  watch(
    () => version,
    (ver, oldVer) => {
      // Only handle changes, not initial page load where builds are prerendered on server.
      if (oldVer !== undefined && ver !== oldVer) {
        fetchBuildsOrError({ value: project }, !isStable).then((result) => {
          builds = result;
        });
      }
    }
  );
</script>

<header class="mx-auto flex max-w-7xl flex-row flex-wrap gap-16 px-4 pt-32 pb-16 lg:pt-48 lg:pb-26">
  {#if eol}
    <div class="-mt-16 w-full rounded-lg bg-red-400 px-4 py-8 text-center font-bold shadow-md dark:bg-red-500">
      {project.name} has reached end of life! It is no longer maintained or supported.
    </div>
  {/if}

  <div class="flex-1">
    <div class="mb-6 flex flex-row items-center gap-4">
      <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800 p-3">
        {#if ICONS[id]}
          <img src={ICONS[id]!} alt={`${project.name} logo`} class="h-full w-full object-contain" />
        {/if}
      </div>
      <h1 class="text-xl font-medium">Downloads</h1>
    </div>

    <h2 class="text-4xl leading-normal font-medium lg:text-5xl lg:leading-normal">
      Get {project.name}
      <span class={channelClass(builds?.value?.latest?.channel)}>{version}</span>
    </h2>

    <p class="mt-4 text-xl">
      {#if isStable}
        {#if Description}
          {@render Description()}
        {:else if typeof description === "string"}
          {@html description}
        {/if}
      {:else if experimentalWarning}
        {experimentalWarning}
      {:else if Description}
        {@render Description()}
      {:else if typeof description === "string"}
        {@html description}
      {/if}
    </p>

    <div class="mt-8 flex flex-col gap-4">
      <SoftwareDownloadButton
        projectId={id}
        {project}
        build={builds.value?.latest}
        {version}
        eol={!!eol}
        disabled={builds.value?.latest === null || builds.value?.latest === undefined}
      />

      {#if project.latestExperimentalVersion}
        <button
          class={`transition-border flex w-full flex-row rounded-lg border py-3 pl-5 md:w-100 ${
            isStable
              ? "border-red-900 text-red-700 dark:border-red-500 dark:text-red-400"
              : "border-blue-900 text-blue-700 dark:border-blue-600 dark:text-blue-400"
          }`}
          onclick={toggleStable}
        >
          {#if isStable}
            Toggle experimental builds for {project.latestExperimentalVersion}
          {:else}
            Back to stable builds for {project.latestStableVersion}
          {/if}
        </button>
      {/if}
    </div>

    <section id="builds" class="mt-20">
      <h2 class="text-center text-xl font-medium">Older builds</h2>
      <p class="mt-2 mb-8 px-4 text-center text-lg text-gray-800 dark:text-gray-200">
        Looking for older builds - or changelogs? We got you!&nbsp;<br />
        <span class="text-gray-700 dark:text-gray-400">
          Even older builds are available in our&nbsp;
          <a href={`https://fill-ui.papermc.io/projects/${id}`} class="text-gray-700 underline dark:text-gray-400"> build explorer </a>.
        </span>
      </p>

      {#if builds.error}
        <div class="text-center text-sm text-red-500">{builds.error}</div>
      {:else if builds.value && builds.value.builds && builds.value.builds.length > 0}
        <SoftwareBuilds project={id} {version} builds={builds.value.builds} eol={!!eol} />
      {/if}
    </section>

    <div class="hidden"></div>
  </div>
</header>
