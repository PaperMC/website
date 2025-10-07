export function Changelog({ items }: { items: string[] }) {
  return (
    <section className="my-8">
      <h3 className="text-xl font-bold">Changelog</h3>
      <ul className="mt-3 list-disc pl-6 marker:text-emerald-500">
        {items.map((i, k) => (
          <li key={k}>{i}</li>
        ))}
      </ul>
    </section>
  );
}
