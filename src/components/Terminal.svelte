<script lang="ts">
  import { formatISOFullTime } from "@/utils/time";
  import { getProject } from "@/utils/fill";
  import { latestVersionFrom } from "@/utils/versions";

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const getNaturalDelay = () => Math.floor(Math.random() * 80) + 40;

  let cmd = $state("");
  let args = $state("");
  let loading = $state("");
  let lines = $state<string[]>([]);
  let success = $state<string | null>(null);
  let history = $state<{ kind: "cmd" | "info"; text: string }[]>([]);

  let latestStableVersion = $state<string>("1.21.8");

  $effect(() => {
    (async () => {
      const { versions } = await getProject("paper");
      const latest = latestVersionFrom(versions);
      if (latest) {
        latestStableVersion = latest;
      }
    })();
  });

  function handleCommand(
    e: KeyboardEvent & { currentTarget: HTMLInputElement }
  ) {
    if (e.key !== "Enter") return;

    const value = e.currentTarget.value.trim();
    let response: string;

    switch (value) {
      case "help":
        response =
          "Existing commands: help, downloads, plugins, docs, forums, team, contribute";
        break;
      case "downloads":
        window.location.href = "/downloads";
        response = "Redirecting...";
        break;
      case "plugins":
        window.location.href = "https://hangar.papermc.io";
        response = "Redirecting...";
        break;
      case "docs":
        window.location.href = "https://docs.papermc.io";
        response = "Redirecting...";
        break;
      case "forums":
        window.location.href = "https://forums.papermc.io";
        response = "Redirecting...";
        break;
      case "team":
        window.location.href = "/team";
        response = "Redirecting...";
        break;
      case "contribute":
        window.location.href = "/contribute";
        response = "Redirecting...";
        break;
      default:
        response = 'Unknown command. Type "help" for help.';
    }

    history = [
      ...history,
      { kind: "cmd", text: value },
      { kind: "info", text: response },
    ];
    e.currentTarget.value = "";
  }

  $effect(() => {
    cmd = "";
    args = "";
    loading = "";
    lines = [];
    success = null;

    const outputLines = [
      `Starting minecraft server version ${latestStableVersion}`,
      'Preparing level "world"',
      "Preparing start region for dimension minecraft:overworld",
      "Time elapsed: 363 ms",
      "Preparing start region for dimension minecraft:the_nether",
      "Time elapsed: 147 ms",
      "Preparing start region for dimension minecraft:the_end",
      "Time elapsed: 366 ms",
      "Running delayed init tasks",
    ];

    let cancelled = false;

    (async () => {
      let currentCmd = "";
      for (const ch of "java") {
        if (cancelled) return;
        currentCmd += ch;
        cmd = currentCmd;
        await sleep(getNaturalDelay());
      }

      let currentArgs = "";
      for (const ch of " -jar paper.jar") {
        if (cancelled) return;
        currentArgs += ch;
        args = currentArgs;
        await sleep(getNaturalDelay());
      }

      for (let i = 0; i < 3; i++) {
        if (cancelled) return;
        loading = "Loading libraries, please wait" + ".".repeat(i + 1);
        await sleep(500);
      }

      for (const line of outputLines) {
        if (cancelled) return;
        lines = [...lines, line];
        await sleep(getNaturalDelay());
      }

      success = 'Done (2.274s)! For help, type "help"';
    })();

    return () => (cancelled = true);
  });
</script>

{#snippet InfoLog(children: string)}
  <div>
    <span class="text-amber-400">[{formatISOFullTime(new Date())} INFO]</span>: {children}
  </div>
{/snippet}

<div class="max-h-[328px] w-[480px] h-[1132px] rounded-lg bg-gray-800">
  <div class="w-full bg-gray-900 rounded-t-lg flex p-2 gap-2">
    <div class="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
    <div class="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
    <div class="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
  </div>

  <div
    class="max-h-[296px] p-4 font-mono text-xs text-white overflow-y-hidden flex flex-col-reverse"
  >
    <div>
      {#if success}
        {">"}
        <input
          aria-label="terminal input"
          class="w-[420px] bg-transparent border-none focus:outline-none"
          onkeydown={handleCommand}
        />
      {/if}
    </div>

    <div>
      {#each history as item}
        {#if item.kind === "cmd"}
          <div>{">"} {item.text}</div>
        {:else}
          {@render InfoLog(item.text)}
        {/if}
      {/each}
    </div>

    <div>
      {#if success}
        {@render InfoLog(success)}
      {/if}
    </div>

    <div>
      {#each lines as line}
        {@render InfoLog(line)}
      {/each}
    </div>

    <div>
      <span class="text-gray-400">{loading}</span>
    </div>

    <div>
      <span class="text-green-400">$ </span>
      <span class="text-blue-400">{cmd}</span>
      <span>{args}</span>
    </div>
  </div>
</div>
