"use client";

import { useEffect, useState } from "react";
import { Expand, X } from "lucide-react";
import { PublicMap } from "@/components/maps/public-map";
import { SimpleVillageMap } from "@/components/maps/simple-village-map";
import type { RumahMarker } from "@/types/portal";

export function HomeMapPreview({ markers }: { markers: RumahMarker[] }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <>
      <div className="relative overflow-hidden rounded-[1.6rem] border border-sky-100 bg-white">
        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,_rgba(15,23,42,0.02)_0%,_rgba(15,23,42,0.14)_100%)]" />
        <div className="pointer-events-none absolute inset-x-4 top-4 z-20 flex flex-wrap items-center justify-between gap-3">
          <div className="rounded-full border border-white/70 bg-white/92 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 shadow-[0_14px_30px_rgba(15,23,42,0.10)]">
            Preview Peta
          </div>
          <div className="rounded-full border border-white/70 bg-slate-950/84 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)]">
            {markers.length} titik rumah
          </div>
        </div>

        <div className="pointer-events-none">
          <SimpleVillageMap markers={markers} />
        </div>

        <div className="absolute inset-x-4 bottom-4 z-20 flex justify-end">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-700 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(11,94,215,0.24)] transition hover:bg-sky-800"
          >
            <Expand className="h-4 w-4" />
            Buka Peta
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-[1200] bg-[rgba(2,6,23,0.82)] p-2 backdrop-blur-sm sm:p-4">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 z-[1250] inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-950 shadow-[0_18px_32px_rgba(0,0,0,0.24)] transition hover:bg-slate-100"
            aria-label="Tutup peta"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="h-full overflow-hidden rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,_#081122,_#0f172a)] p-2 shadow-[0_30px_90px_rgba(0,0,0,0.42)] sm:rounded-[1.8rem] sm:p-3">
            <PublicMap markers={markers} focusMode />
          </div>
        </div>
      ) : null}
    </>
  );
}
