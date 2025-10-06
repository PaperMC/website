export function ReleaseBanner({ version }: { version: string }) {
  return (
    <div className="mb-6 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm">
      <span className="font-semibold">Release:</span>{" "}
      <span className="inline-flex items-center gap-2">
        <span className="rounded bg-emerald-600/90 px-2 py-0.5 text-white">{version}</span>
        <a className="underline decoration-dotted underline-offset-4 hover:opacity-90" href="/downloads/paper">
          Get Paper
        </a>
      </span>
    </div>
  );
}
