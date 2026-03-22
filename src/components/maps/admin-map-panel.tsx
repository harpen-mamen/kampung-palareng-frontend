"use client";

import { useEffect, useState, useTransition } from "react";
import { AdminMap } from "@/components/maps/admin-map";
import { getStoredToken } from "@/lib/auth";
import { getAdminMap } from "@/lib/api";
import type { RumahMarker } from "@/types/portal";

export function AdminMapPanel({ initialMarkers }: { initialMarkers: RumahMarker[] }) {
  const [markers, setMarkers] = useState(initialMarkers);
  const [search, setSearch] = useState("");
  const [lindongan, setLindongan] = useState("");
  const [statusEkonomi, setStatusEkonomi] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!getStoredToken()) return;

    const timeout = setTimeout(() => {
      startTransition(async () => {
        const response = await getAdminMap({
          search,
          lindongan,
          status_ekonomi: statusEkonomi,
        });
        setMarkers(response.markers);
      });
    }, 250);

    return () => clearTimeout(timeout);
  }, [search, lindongan, statusEkonomi]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-[1.5rem] border border-sky-100 bg-white p-4 md:grid-cols-4">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari nama keluarga atau kode..."
          className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
        />
        <select
          value={lindongan}
          onChange={(event) => setLindongan(event.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
        >
          <option value="">Semua Lindongan</option>
          <option>Lindongan 1</option>
          <option>Lindongan 2</option>
          <option>Lindongan 3</option>
          <option>Lindongan 4</option>
        </select>
        <input
          value={statusEkonomi}
          onChange={(event) => setStatusEkonomi(event.target.value)}
          placeholder="Status ekonomi..."
          className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
        />
        <div className="flex items-center rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {isPending ? "Memuat data..." : `${markers.length} marker aktif`}
        </div>
      </div>
      <div className="card-panel rounded-[1.75rem] p-3">
        <AdminMap markers={markers} />
      </div>
    </div>
  );
}
