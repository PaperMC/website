export function Callout({
  title,
  children,
  tone = "info",
}: {
  title?: string;
  children?: React.ReactNode;
  tone?: "info" | "success" | "warning" | "danger";
}) {
  const colors: Record<string, string> = {
    info: "border-sky-500/60 bg-sky-500/5",
    success: "border-emerald-500/60 bg-emerald-500/5",
    warning: "border-amber-500/60 bg-amber-500/5",
    danger: "border-rose-500/60 bg-rose-500/5",
  };
  return (
    <div className={`my-6 rounded-lg border p-4 ${colors[tone]}`}>
      {title && <div className="mb-1 font-semibold tracking-tight">{title}</div>}
      <div className="[&_p]:my-2">{children}</div>
    </div>
  );
}
