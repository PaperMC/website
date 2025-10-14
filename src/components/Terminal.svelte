<script lang="ts">
  import { onMount, tick } from "svelte";
  import { getProject, getVersionBuilds } from "@/utils/fill";

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const getNaturalDelay = () => Math.floor(Math.random() * 80) + 40;
  const formatISOFullTime = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  type Tone = "green" | "amber" | "gray";
  type Line =
    | { kind: "cmd-echo"; text: string; id: number }
    | { kind: "info"; text: string; ts: Date; tone: Tone; id: number }
    | { kind: "plain"; text: string; id: number };

  let cmd = $state("")
  let args = $state("");
  let loading = $state("");
  let logs: Line[] = $state([]);
  let inputValue = $state("");
  let inputEl: HTMLInputElement | null = $state(null);

  const MAX_LOG_LINES = 500;
  let _id = 0;
  const nextId = () => ++_id;

  function pushLine(line: any) {
    logs = [...logs, { ...line, id: nextId() }];
    if (logs.length > MAX_LOG_LINES) logs.splice(0, logs.length - MAX_LOG_LINES);
  }
  function info(text: string, tone: Tone = "amber") {
    pushLine({ kind: "info", text, ts: new Date(), tone });
  }
  function echo(text: string) {
    pushLine({ kind: "cmd-echo", text: `> ${text}` });
  }

  const nav = (href: string) => location.assign(href);

  const commands: Record<string, () => void> = {
    help: () =>
      info(
        "Existing commands: help, downloads, plugins, docs, forums, team, contribute",
        "gray"
      ),
    downloads: () => {
      info("Redirecting...", "gray");
      nav("/downloads");
    },
    plugins: () => {
      info("Redirecting...", "gray");
      nav("https://hangar.papermc.io");
    },
    docs: () => {
      info("Redirecting...", "gray");
      nav("https://docs.papermc.io");
    },
    forums: () => {
      info("Redirecting...", "gray");
      nav("https://forums.papermc.io");
    },
    team: () => {
      info("Redirecting...", "gray");
      nav("/team");
    },
    contribute: () => {
      info("Redirecting...", "gray");
      nav("/contribute");
    }
  };

  const isVersionStable = async (project: string, version: string): Promise<boolean> => {
    try {
      const builds = await getVersionBuilds(project, version);
      for (let i = builds.length - 1; i >= 0; i--) {
        if (builds[i].channel === "STABLE") return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  function handleKeydown(e: KeyboardEvent) {
    if (e.key !== "Enter") return;
    const value = inputValue.trim();
    if (!value) return;

    echo(value);
    (commands[value] ?? (() => info('Unknown command. Type "help" for help.', "gray")))();
    inputValue = "";
  }

  onMount(async () => {
    if (!prefersReducedMotion) {
      for (const ch of "java") {
        cmd += ch;
        await sleep(getNaturalDelay());
      }
      for (const ch of " -jar paper.jar") {
        args += ch;
        await sleep(getNaturalDelay());
      }
      for (let i = 0; i < 3; i++) {
        loading = "Loading libraries, please wait" + ".".repeat(i + 1);
        await sleep(500);
      }
    } else {
      cmd = "java";
      args = " -jar paper.jar";
    }
    loading = "";

    const projectData = await getProject("paper");
    const flattenedVersions = Object.values(projectData.versions).flat().reverse();
    let latestStableVersion = flattenedVersions[flattenedVersions.length - 1] || "1.21.4";

    // Check versions from newest to oldest to find the latest stable one
    for (let i = flattenedVersions.length - 1; i >= 0; i--) {
      if (await isVersionStable("paper", flattenedVersions[i])) {
        latestStableVersion = flattenedVersions[i];
        break;
      }
    }

    const outputLines = [
      `Starting minecraft server version ${latestStableVersion}`,
      'Preparing level "world"',
      "Preparing start region for dimension minecraft:overworld",
      "Time elapsed: 363 ms",
      "Preparing start region for dimension minecraft:the_nether",
      "Time elapsed: 147 ms",
      "Preparing start region for dimension minecraft:the_end",
      "Time elapsed: 366 ms",
      "Running delayed init tasks"
    ];

    if (!prefersReducedMotion) {
      for (const line of outputLines) {
        info(line, "amber");
        await sleep(getNaturalDelay());
      }
    } else {
      for (const line of outputLines) info(line, "amber");
    }

    info('Done (2.274s)! For help, type "help"', "green");
  });
</script>

<div class="w-[min(100%,480px)] rounded-lg bg-gray-800 shadow-lg ring-1 ring-black/10">
  <div class="w-full bg-gray-900 rounded-t-lg flex items-center p-2 gap-2">
    <div class="size-2.5 bg-red-500 rounded-full"></div>
    <div class="size-2.5 bg-yellow-500 rounded-full"></div>
    <div class="size-2.5 bg-green-500 rounded-full"></div>
  </div>

  <div
    class="max-h-[296px] h-[296px] p-4 font-mono text-xs text-white overflow-y-hidden flex flex-col"
    role="log"
    aria-live="polite"
    aria-relevant="additions text"
  >
    <div class="space-y-0.5">
      {#each logs as line (line.id)}
        {#if line.kind === "info"}
          <div>
            <span class="text-amber-400">[{formatISOFullTime(line.ts)} INFO]</span>:
            {#if line.tone === "green"}
              <span class="text-green-400">{line.text}</span>
            {:else if line.tone === "gray"}
              <span class="text-gray-300">{line.text}</span>
            {:else}
              {line.text}
            {/if}
          </div>
        {:else if line.kind === "cmd-echo"}
          <div>{line.text}</div>
        {:else}
          <div>{line.text}</div>
        {/if}
      {/each}
    </div>

    <div class="text-gray-400">{loading}</div>
    <div>
      <span class="text-green-400">$ </span>
      <span class="text-blue-400">{cmd}</span><span>{args}</span>
    </div>
    <div>
      <span>{">"} </span>
      <input
        bind:this={inputEl}
        bind:value={inputValue}
        onkeydown={handleKeydown}
        class="w-[420px] max-w-full bg-transparent border-none outline-none focus:outline-none caret-white"
        aria-label="Terminal input"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
      />
    </div>
  </div>
</div>