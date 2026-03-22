"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Expand, MapPinned, X } from "lucide-react";
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

        <div className="absolute inset-x-4 bottom-4 z-20 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl rounded-[1.35rem] border border-white/70 bg-white/92 px-4 py-3 text-sm text-slate-700 shadow-[0_18px_40px_rgba(15,23,42,0.10)] backdrop-blur">
            Peta di beranda dibuat sebagai preview statis. Klik tombol di samping untuk membuka peta interaktif penuh layar.
          </div>
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
        <div className="fixed inset-0 z-[1200] bg-[rgba(2,6,23,0.78)] p-3 backdrop-blur-sm sm:p-5">
          <div className="flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,_#081122,_#0f172a)] shadow-[0_30px_90px_rgba(0,0,0,0.42)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-4 text-white sm:px-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-300">
                  Peta Interaktif
                </p>
                <h3 className="mt-1 text-lg font-bold text-white sm:text-xl">
                  Sebaran rumah warga Kampung Palareng
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/peta"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/12"
                >
                  <MapPinned className="h-4 w-4" />
                  Halaman Peta
                </Link>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                  Tutup
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 p-3 sm:p-5">
              <div className="h-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/4 p-2 sm:p-3">
                <PublicMap markers={markers} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
