<script lang="ts">
  import type { Build } from "@/utils/types";
  import { formatISODateTime, formatRelativeDate } from "@/utils/time";
  import SoftwareBuildChanges from "@/components/data/SoftwareBuildChanges.svelte";

  export let project: string;
  export let version: string;
  export let builds: Build[] | undefined;
  export let eol: boolean = false;

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
      <div>
        <div
          class="flex flex-row items-start hover:bg-blue-100 dark:hover:bg-gray-900 px-4 py-2 transition-colors"
        >
          <a
            role="button"
            href={build.downloads?.["server:default"]?.url}
            target="_blank"
            class={`text-sm text-center font-medium rounded-full p-2 min-w-16 mr-4 inline-flex items-center gap-1 ${channelBgClass(build.channel)} ${channelTextClass(build.channel)}`}
          >
            <svg
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 3v12" />
              <path d="M8.5 11.5 12 15l3.5-3.5" />
              <path d="M5 18h14" />
            </svg>
            #{build.id}
          </a>

          <div
            class="flex-1 flex flex-col text-gray-900 dark:text-gray-200 min-w-0"
          >
            <SoftwareBuildChanges {project} {build} {version} />
          </div>

          <div
            class="hidden md:block text-gray-500 dark:text-gray-300 mt-1 ml-2"
            title={formatISODateTime(new Date(build.time))}
          >
            {formatRelativeDate(new Date(build.time))}
          </div>
        </div>

        {#if idx < Math.min(builds.length, 10) - 1}
          <hr class="border border-gray-300 dark:border-gray-700 m-0" />
        {/if}
      </div>
    {/each}
  {:else}
    {#each Array(5) as _, k}
      <div class="flex flex-row items-start w-full" {k}>
        <div class="bg-gray-800 rounded-full p-2 min-w-16 mr-4">
          <div class="h-5 w-8 rounded bg-gray-500/30 animate-pulse"></div>
        </div>
        <div class="mt-1 grow h-6 rounded bg-gray-500/20 animate-pulse"></div>
      </div>
    {/each}
  {/if}
</div>
