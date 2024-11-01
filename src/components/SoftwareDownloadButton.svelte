<script lang="ts">
  import { generateVersionBuildDownloadURL } from "@/utils/api.ts";
  import { clsx } from "clsx";
  import Skeleton from "@/components/Skeleton.svelte";
  import type { Build, ProjectDescriptor } from "@/types/project.ts";
  import { writable } from "svelte/store";

  interface Props {
    projectId: string;
    project?: ProjectDescriptor;
    build?: Build;
    version: string;
    stable: boolean;
    compact?: boolean;
    eol?: boolean;
  }

  const { projectId, project, build, version, stable, compact, eol }: Props = $props();
  let dropdownOpen = $state(false);
  let copied = $state<null | string>(null);

  function toggleDropdown() {
    dropdownOpen = !dropdownOpen;
  }
</script>

<div class="relative w-max">
  <div
    class={clsx(
      "rounded-lg flex flex-row transition-shadow text-white transition-color hover:shadow-lg",
      !compact && "w-full md:w-100",
      stable && !eol ? "bg-blue-600 hover:bg-blue-500" : "bg-red-500 hover:bg-red-400"
    )}
  >
    <a
      class={clsx("flex flex-row flex-1 items-center", compact ? "gap-2 pl-2 leading-0 py-1" : "gap-8 pl-5 py-3")}
      href={projectId && build && generateVersionBuildDownloadURL(projectId, version, build.build, build.downloads["application"].name)}
      target="_blank"
    >
      <div>
        <!--        <Icon name="icons/heroicons/document-download" class={clsx(compact ? "size-4" : "size-8")} />-->
      </div>
      <div class="text-left flex-1 border-r border-gray-300/50 pr-3">
        {#if compact }
          <span class="font-medium text-sm">Download</span>
        {:else if (projectId && build)}
              <span class="font-medium text-lg">
                {project?.name ?? projectId} {version}
              </span>
          <p class="text-gray-100">{build && `Build #${build.build}`}</p>
        {:else}
          <Skeleton className="w-40 mb-2" />
          <Skeleton className="w-20 h-5" />
        {/if}
      </div>
    </a>
    <div class="leading-0 flex items-center justify-center cursor-pointer" id="dropdown-arrow" role="button" tabindex="0" onclick={toggleDropdown} onkeydown={(e) => {e.preventDefault(); toggleDropdown()}}>
      <!--      <Icon name="icons/heroicons/chevron-down" class={clsx("text-gray-200", compact ? "size-4 mx-3" : "size-6 mx-5")} />-->
      AAA
    </div>
    {#if dropdownOpen}
      <div
        id="dropdown-content"
        class={clsx(
        "absolute mt-2 rounded-md bg-background-light-10 shadow-lg divide-y divide-gray-200 border border-gray-200 dark:(bg-background-dark-80 divide-gray-800 border-gray-800) z-40",
        compact ? "origin-top-right right-0" : "origin-top-left left-0 w-full md:w-auto",
      )}
        style="top: 100%;"
      >
        {#if build}
          {#each Object.entries(build.downloads) as [item, download]}
            <div>
              <div class="hover:bg-blue-100 dark:hover:bg-gray-800 transition-colors">
                <a href={projectId && build && generateVersionBuildDownloadURL(projectId, version, build.build, download.name)} target="_blank">
                  <div class="px-4 py-3">
                    <div class="font-medium">
                      {download.name}
                      {#if download.name === "application"}
                        <span class="ml-2 text-xs rounded-full py-0.5 px-2 bg-yellow-200/80 text-yellow-800">Recommended</span>
                      {/if}
                      {#if copied === download.sha256}
                        <span class="ml-2 text-xs rounded-full py-0.5 px-2 bg-green-200/80 text-green-800">Copied</span>
                      {/if}
                    </div>
                    <div class="text-gray-700 dark:text-gray-300 text-xs inline-flex items-center w-full">
                      <span class="truncate">{download.sha256}</span>
                      <button class="ml-2 size-6">
                        <!--                    <Icon name="icons/fontawesome/clone-icon" class="size-4" />-->
                      </button>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    {/if}
  </div>
</div>
