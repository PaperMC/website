<script lang="ts">
  import { onMount } from 'svelte';
  import { getBStats } from '@/utils/fill';

  let { ttlMs = 12 * 60 * 1000 } = $props();

  type BStats = { servers: number; players: number };
  const LS_KEY = 'bstats:players:v1';

  let players: number | null = $state(null);
  let loading = $state(true);
  let error: string | null = null;

  function now() {
    return Date.now();
  }

  function readCache(): { data: BStats; ts: number } | null {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function writeCache(data: BStats) {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ data, ts: now() }));
    } catch {}
  }

  async function fetchFresh(): Promise<BStats> {
    const res = await getBStats();
    return res;
  }

  async function swrLoad() {
    const cached = readCache();
    if (cached) {
      players = cached.data.players ?? 0;
    }

    if (cached && now() - cached.ts < ttlMs) {
      loading = false;
      return;
    }

    try {
      const fresh = await fetchFresh();
      if (typeof fresh.players === 'number') {
        players = fresh.players;
        writeCache(fresh);
      }
      error = null;
    } catch (e) {
      error = 'Failed to refresh bStats';
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    swrLoad();
  });

  let display = $derived(players == null ? null : `${Math.round(players / 1000)}k+`);
</script>

{#if loading && players == null}
  <span class="inline-block h-[1em] w-12 animate-pulse rounded bg-blue-500/30 align-middle"></span>
{:else if display}
  <span class="text-blue-500">{display}</span>
{:else}
  <span class="text-blue-500">0k+</span>
{/if}
