<script lang="ts">
  import { formatISOFullTime } from '@/utils/time';
  import { getProject } from '@/utils/fill';
  import { latestVersionFrom } from '@/utils/versions';

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const getNaturalDelay = () => Math.floor(Math.random() * 80) + 40;

  let cmd = $state('');
  let args = $state('');
  let loading = $state('');
  let lines = $state<string[]>([]);
  let success = $state<string | null>(null);
  let history = $state<{ kind: 'cmd' | 'info'; text: string }[]>([]);

  let latestStableVersion = $state<string>('1.21.8');

  $effect(() => {
    (async () => {
      const { versions } = await getProject('paper');
      const latest = latestVersionFrom(versions);
      if (latest) {
        latestStableVersion = latest;
      }
    })();
  });

  function handleCommand(e: KeyboardEvent & { currentTarget: HTMLInputElement }) {
    if (e.key !== 'Enter') return;

    const value = e.currentTarget.value.trim();
    let response: string;

    switch (value) {
      case 'help':
        response = 'Existing commands: help, downloads, plugins, docs, forums, team, contribute';
        break;
      case 'downloads':
        window.location.href = '/downloads';
        response = 'Redirecting...';
        break;
      case 'plugins':
        window.location.href = 'https://hangar.papermc.io';
        response = 'Redirecting...';
        break;
      case 'docs':
        window.location.href = 'https://docs.papermc.io';
        response = 'Redirecting...';
        break;
      case 'forums':
        window.location.href = 'https://forums.papermc.io';
        response = 'Redirecting...';
        break;
      case 'team':
        window.location.href = '/team';
        response = 'Redirecting...';
        break;
      case 'contribute':
        window.location.href = '/contribute';
        response = 'Redirecting...';
        break;
      default:
        response = 'Unknown command. Type "help" for help.';
    }

    history = [...history, { kind: 'cmd', text: value }, { kind: 'info', text: response }];
    e.currentTarget.value = '';
  }

  $effect(() => {
    cmd = '';
    args = '';
    loading = '';
    lines = [];
    success = null;

    const outputLines = [
      `Starting minecraft server version ${latestStableVersion}`,
      'Preparing level "world"',
      'Preparing start region for dimension minecraft:overworld',
      'Time elapsed: 363 ms',
      'Preparing start region for dimension minecraft:the_nether',
      'Time elapsed: 147 ms',
      'Preparing start region for dimension minecraft:the_end',
      'Time elapsed: 366 ms',
      'Running delayed init tasks',
    ];

    let cancelled = false;

    (async () => {
      let currentCmd = '';
      for (const ch of 'java') {
        if (cancelled) return;
        currentCmd += ch;
        cmd = currentCmd;
        await sleep(getNaturalDelay());
      }

      let currentArgs = '';
      for (const ch of ' -jar paper.jar') {
        if (cancelled) return;
        currentArgs += ch;
        args = currentArgs;
        await sleep(getNaturalDelay());
      }

      for (let i = 0; i < 3; i++) {
        if (cancelled) return;
        loading = 'Loading libraries, please wait' + '.'.repeat(i + 1);
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

<div class="h-[1132px] max-h-[328px] w-[480px] rounded-lg bg-gray-800">
  <div class="flex w-full gap-2 rounded-t-lg bg-gray-900 p-2">
    <div class="h-2.5 w-2.5 rounded-full bg-red-500"></div>
    <div class="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
    <div class="h-2.5 w-2.5 rounded-full bg-green-500"></div>
  </div>

  <div class="flex max-h-[296px] flex-col-reverse overflow-y-hidden p-4 font-mono text-xs text-white">
    <div>
      {#if success}
        &gt;
        <input aria-label="terminal input" class="w-[420px] border-none bg-transparent focus:outline-none" onkeydown={handleCommand} />
      {/if}
    </div>

    <div>
      {#each history as item, index (index)}
        {#if item.kind === 'cmd'}
          <div>&gt; {item.text}</div>
        {:else}
          {@render InfoLog(item.text)}
        {/if}
      {/each}
    </div>

    <div>
      {#if success}
        <div>
          <span class="text-amber-400">[{formatISOFullTime(new Date())} INFO]</span>: <span class="text-green-400">{success}</span>
        </div>
      {/if}
    </div>

    <div>
      {#each lines as line, index (index)}
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
