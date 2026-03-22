import Link from "next/link";
import type { Berita } from "@/types/portal";

export function NewsCard({ item }: { item: Berita }) {
  return (
    <article className="card-panel rounded-[1.5rem] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
        {item.kategori}
      </p>
      <h3 className="mt-3 text-xl font-bold text-slate-950">{item.judul}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{item.ringkasan}</p>
      <Link href={`/berita/${item.slug}`} className="mt-5 inline-flex text-sm font-semibold text-emerald-700">
        Baca selengkapnya
      </Link>
    </article>
  );
}
