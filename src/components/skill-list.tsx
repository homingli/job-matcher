type SkillListProps = {
  title: string;
  items: string[];
  tone: "success" | "warning" | "neutral";
};

const toneClasses = {
  success: "border-green-200 bg-green-50 text-green-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  neutral: "border-slate-200 bg-slate-50 text-slate-700"
};

export function SkillList({ title, items, tone }: SkillListProps) {
  return (
    <section className="rounded-lg border border-[color:var(--line)] bg-[color:var(--panel)] p-4">
      <h2 className="text-sm font-semibold uppercase tracking-normal text-[color:var(--muted)]">{title}</h2>
      {items.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item) => (
            <span key={item} className={`rounded-md border px-2.5 py-1 text-sm ${toneClasses[tone]}`}>
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-[color:var(--muted)]">None reported.</p>
      )}
    </section>
  );
}
