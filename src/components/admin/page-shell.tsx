import { FilterBar } from "@/components/shared/filter-bar";
import { StatCards } from "@/components/shared/stat-cards";

export function AdminPageShell({
  title,
  description,
  stats,
  children,
  withFilters = false,
}: {
  title: string;
  description: string;
  stats?: { label: string; value: string | number; accent?: string; helper?: string }[];
  children: React.ReactNode;
  withFilters?: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-[1.85rem] border border-slate-200 bg-white px-6 py-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">Modul Admin</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-slate-950">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{description}</p>
      </div>
      {stats ? <StatCards items={stats} /> : null}
      {withFilters ? <FilterBar /> : null}
      {children}
    </div>
  );
}
