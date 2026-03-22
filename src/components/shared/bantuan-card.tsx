export function BantuanCard({
  title,
  source,
  description,
  category,
  period,
  kuota,
  remaining,
  isOpen,
}: {
  title: string;
  source: string;
  description: string;
  category?: string;
  period?: string;
  kuota?: number | null;
  remaining?: number | null;
  isOpen?: boolean;
}) {
  return (
    <article className="card-panel rounded-[1.7rem] border border-white/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(244,250,255,0.96))] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
        {source}
        </p>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isOpen ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
          {isOpen ? "Dibuka" : "Ditutup"}
        </span>
      </div>
      <h3 className="mt-3 text-xl font-bold text-slate-950">{title}</h3>
      {category ? <p className="mt-2 text-sm font-medium text-sky-700">{category}</p> : null}
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">Periode</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{period ?? "-"}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50/60 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700">Kuota Tersisa</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {remaining ?? kuota ?? "Tidak dibatasi"}
          </p>
        </div>
      </div>
    </article>
  );
}
