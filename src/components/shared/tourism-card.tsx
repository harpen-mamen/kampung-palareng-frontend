"use client";

import Image from "next/image";
import type { WisataItem } from "@/types/portal";

export function TourismCard({ item }: { item: WisataItem }) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-[#d9c8b3] bg-[#fffaf3] shadow-[0_22px_60px_rgba(120,74,32,0.10)] transition hover:-translate-y-1">
      <div className="relative h-52 border-b border-[#e7d8c7] bg-[linear-gradient(135deg,_#b45309,_#f59e0b_45%,_#fef3c7)]">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.nama}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_45%),linear-gradient(135deg,_rgba(120,53,15,0.82),_rgba(217,119,6,0.78),_rgba(250,204,21,0.70))] text-center">
            <div className="rounded-full border border-white/30 bg-white/14 px-5 py-2 text-sm font-semibold tracking-[0.24em] text-white uppercase">
              Foto Wisata
            </div>
          </div>
        )}
      </div>
      <div className="space-y-2 px-5 py-4">
        <h3 className="text-lg font-bold text-slate-950">{item.nama}</h3>
        <p className="text-sm font-medium text-amber-800">{item.lokasi}</p>
        <p className="text-sm leading-7 text-slate-600">{item.deskripsi}</p>
      </div>
    </article>
  );
}
