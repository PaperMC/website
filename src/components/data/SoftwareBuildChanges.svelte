<script lang="ts">
  import type { Build } from "@/utils/types";
  import { getProjectRepository } from "@/utils/github";

  export let project!: string;
  export let build!: Build;
  export let version!: string;

  type Segment =
    | { kind: "text"; text: string }
    | { kind: "link"; url: string; text: string };

  const linkRe =
    /(@?https:\/\/github\.com\/[\w-]+\/[\w-]+\/commit\/([a-f0-9]{7,40}))|([^&])(#[0-9]+)/gim;

  function toSegments(summary: string): Segment[] {
    const trimmed = summary.replace(/[\r\n]+$/g, "");
    const segs: Segment[] = [];
    let last = 0;
    let m: RegExpExecArray | null;

    while ((m = linkRe.exec(trimmed)) !== null) {
      if (m.index > last)
        segs.push({ kind: "text", text: trimmed.slice(last, m.index) });

      if (m[2]) {
        const url = m[1].replace(/^@/, "");
        const shortHash = m[2].slice(0, 7);
        segs.push({ kind: "link", url, text: shortHash });
      } else if (m[4]) {
        segs.push({ kind: "text", text: m[3] });
        const n = m[4].slice(1);
        segs.push({
          kind: "link",
          url: `https://github.com/PaperMC/${project}/issues/${n}`,
          text: `#${n}`,
        });
      }
      last = linkRe.lastIndex;
    }
    if (last < trimmed.length)
      segs.push({ kind: "text", text: trimmed.slice(last) });
    return segs;
  }

  type Row = { sha: string; fullMessage?: string; segments: Segment[] };
  $: rows =
    build?.commits.map<Row>((c) => {
      const [firstLine, ...rest] = c.message.split(/\r?\n/);
      return {
        sha: c.sha,
        fullMessage: rest.length > 0 ? c.message : undefined,
        segments: toSegments(firstLine),
      };
    }) ?? [];
</script>

{#if rows.length > 0}
  {#each rows as row (row.sha)}
    <p class="commitMessage">
      <a
        class="commit"
        href={`${getProjectRepository(project, version)}/commit/${row.sha}`}
        target="_blank"
        rel="noreferrer"
      >
        {row.sha.slice(0, 7)}
      </a>

      <span title={row.fullMessage}>
        {#each row.segments as seg, i}
          {#if seg.kind === "text"}
            {seg.text}
          {:else}
            <a class="issue" href={seg.url} target="_blank" rel="noreferrer"
              >{seg.text}</a
            >
          {/if}
        {/each}
      </span>
    </p>
  {/each}
{:else}
  <i class="text-gray-600">No changes</i>
{/if}

<style>
  .commitMessage {
    display: block;
    line-height: 1.4;
    overflow-wrap: anywhere;
  }
  .commit {
    display: inline-block;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      "Liberation Mono", "Courier New", monospace;
    font-size: 0.9em;
    margin-right: 0.5rem;
    padding: 0.1rem 0.4rem;
    border-radius: 0.375rem;
    background: color-mix(in oklab, currentColor 12%, transparent);
    text-decoration: none;
  }
  .issue {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
</style>
