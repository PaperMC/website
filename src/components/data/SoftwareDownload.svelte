<script lang="ts">
  import { getVersionBuilds } from "@/utils/fill";
  import type { Build, ProjectDescriptor } from "@/utils/types";

  import SoftwareDownloadButton from "@/components/data/SoftwareDownloadButton.svelte";
  import SoftwareBuilds from "@/components/data/SoftwareBuilds.svelte";


  import PaperIconUrl from "@/assets/brand/paper.svg?url";
  import VelocityIconUrl from "@/assets/brand/velocity.svg?url";
  import FoliaIconUrl from "@/assets/brand/folia.svg?url";
  import WaterfallIconUrl from "@/assets/brand/waterfall.svg?url";
  interface Props {
    id: "paper" | "velocity" | "folia" | "waterfall" | (string & {});
    project: ProjectDescriptor;
    description: string | any;
    experimentalWarning: string | undefined;
    eol: boolean | undefined;
  }

  let {
    id,
    project,
    description,
    experimentalWarning,
    eol
  }: Props = $props();

  const ICONS: Record<string, string | undefined> = {
    paper: PaperIconUrl,
    velocity: VelocityIconUrl,
    folia: FoliaIconUrl,
    waterfall: WaterfallIconUrl,
  };

  let isStable = $state(true);

  let version = $derived(isStable
    ? project?.latestStableVersion
    : (project?.latestExperimentalVersion ?? project?.latestStableVersion));

  let builds: Build[] = $state([]);
  let latestBuild: Build | undefined = $state();
  let buildsLoading = $state(false);
  let buildsError: string | null = $state(null);

  async function fetchBuilds() {
    if (!id || !version) {
      builds = [];
      latestBuild = undefined;
      return;
    }
    buildsLoading = true;
    buildsError = null;
    try {
      const res = await getVersionBuilds(id, version);
      builds = Array.isArray(res) ? res : [];
      latestBuild = builds[0] || undefined;
    } catch (e) {
      console.error(e);
      buildsError = `Failed to load builds for ${id} ${version}`;
      builds = [];
      latestBuild = undefined;
    } finally {
      buildsLoading = false;
    }
  }

  $effect(() => {
    fetchBuilds();
  });

  function toggleStable() {
    isStable = !isStable;
  }

  function channelClass(channel?: string) {
    if (eol) return "text-channel-eol-primary";
    const c = (channel ?? "").toLowerCase();
    return `text-channel-${c}-primary`;
  }
</script>

<header
  class="max-w-7xl flex flex-row flex-wrap mx-auto px-4 pt-32 pb-16 lg:pt-48 lg:pb-26 gap-16"
>
  {#if eol}
    <div
      class="text-center px-4 py-8 -mt-16 font-bold bg-red-400 dark:bg-red-500 shadow-md rounded-lg w-full"
    >
      {project.name} has reached end of life! It is no longer maintained or supported.
    </div>
  {/if}

  <div class="flex-1">
    <div class="flex flex-row mb-6 gap-4 items-center">
      <div
        class="w-12 h-12 rounded-lg bg-gray-800 p-3 flex items-center justify-center"
      >
        {#if ICONS[id]}
          <img
            src={ICONS[id]!}
            alt={`${project.name} logo`}
            class="w-full h-full object-contain"
          />
        {/if}
      </div>
      <h1 class="font-medium text-xl">Downloads</h1>
    </div>

    <h2
      class="font-medium leading-normal lg:text-5xl lg:leading-normal text-4xl"
    >
      Get {project.name}
      <span class={channelClass(latestBuild?.channel)}>{version}</span>
    </h2>

    <p class="text-xl mt-4">
      {#if isStable}
        {#if typeof description === "string"}{description}{:else}{@html String(
            description
          )}{/if}
      {:else}
        {experimentalWarning ??
          (typeof description === "string" ? description : String(description))}
      {/if}
    </p>

    <div class="flex flex-col gap-4 mt-8">
      <SoftwareDownloadButton
        projectId={id}
        {project}
        build={latestBuild}
        {version}
        eol={!!eol}
        disabled={buildsLoading || !latestBuild}
      />

      {#if project.latestExperimentalVersion}
        <button
          class="rounded-lg flex flex-row w-full md:w-100 border transition-border pl-5 py-3
                 {isStable
            ? 'dark:border-red-500 dark:text-red-400 border-red-900 text-red-700'
            : 'dark:border-blue-600 dark:text-blue-400 border-blue-900 text-blue-700'}"
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

    {#if buildsLoading}
      <div class="mt-6 text-sm text-gray-400">Loading builds…</div>
    {:else if buildsError}
      <div class="mt-6 text-sm text-red-500">{buildsError}</div>
    {:else if builds.length > 0}
      <div class="mt-6">
        <SoftwareBuilds project={id} {version} {builds} eol={!!eol} />
      </div>
    {/if}
  </div>

  <div class="hidden"></div>
</header>
