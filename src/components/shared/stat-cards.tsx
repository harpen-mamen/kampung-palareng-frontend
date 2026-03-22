type StatItem = {
  label: string;
  value: number | string;
  accent?: string;
  helper?: string;
};

export function StatCards({ items }: { items: StatItem[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <div
          key={item.label}
          className={`rounded-[1.65rem] border p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)] ${
            index % 4 === 0
              ? "border-sky-100 bg-[linear-gradient(180deg,_#f8fbff,_#eef6ff)]"
              : index % 4 === 1
                ? "border-emerald-100 bg-[linear-gradient(180deg,_#f5fcf8,_#effcf5)]"
                : index % 4 === 2
                  ? "border-amber-100 bg-[linear-gradient(180deg,_#fffaf2,_#fff3df)]"
                  : "border-rose-100 bg-[linear-gradient(180deg,_#fff7f8,_#fff0f3)]"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
          <p className={`mt-3 text-3xl font-black ${item.accent ?? "text-slate-950"}`}>{item.value}</p>
          {item.helper ? <p className="mt-3 text-sm leading-7 text-slate-600">{item.helper}</p> : null}
        </div>
      ))}
    </div>
  );
}
