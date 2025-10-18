<script lang="ts">
  import type { Build } from "@/utils/types";
  import { formatISODateTime, formatRelativeDate } from "@/utils/time";
  import SoftwareBuildChanges from "@/components/data/SoftwareBuildChanges.svelte";

  interface Props {
    project: string;
    version: string;
    builds: Build[];
    eol?: boolean;
  }

  let { project, version, builds, eol = false }: Props = $props();

  function channelBgClass(ch?: Build["channel"]): string {
    if (eol) return "bg-channel-eol-primary";
    const c = (ch ?? "").toLowerCase();
    return `bg-channel-${c}-primary`;
  }
  function channelTextClass(ch?: Build["channel"]): string {
    if (eol) return "text-channel-eol-secondary";
    const c = (ch ?? "").toLowerCase();
    return `text-channel-${c}-secondary`;
  }
</script>

<div class="flex flex-col">
  {#if builds}
    {#each builds.slice(0, 10) as build, idx (build.id)}
      {@const date = new Date(build.time)}
      <div>
        <div class="flex flex-row items-start px-4 py-2 transition-colors hover:bg-blue-100 dark:hover:bg-gray-900">
          <a
            role="button"
            href={build.downloads?.["server:default"]?.url}
            target="_blank"
            class={`mr-4 inline-flex min-w-16 items-center gap-1 rounded-full p-2 text-center text-sm font-medium ${channelBgClass(build.channel)} ${channelTextClass(build.channel)}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            #{build.id}
          </a>

          <div class="flex min-w-0 flex-1 flex-col text-gray-900 dark:text-gray-200">
            <SoftwareBuildChanges {project} {build} {version} />
          </div>

          <div class="mt-1 ml-2 hidden text-gray-500 md:block dark:text-gray-300" title={formatISODateTime(date)}>
            {formatRelativeDate(date)}
          </div>
        </div>

        {#if idx < Math.min(builds.length, 10) - 1}
          <hr class="m-0 border border-gray-300 dark:border-gray-700" />
        {/if}
      </div>
    {/each}
  {:else}
    {#each Array(5) as i (i)}
      <div class="flex w-full flex-row items-start">
        <div class="mr-4 min-w-16 rounded-full bg-gray-800 p-2">
          <div class="h-5 w-8 animate-pulse rounded bg-gray-500/30"></div>
        </div>
        <div class="mt-1 h-6 grow animate-pulse rounded bg-gray-500/20"></div>
      </div>
    {/each}
  {/if}
</div>
