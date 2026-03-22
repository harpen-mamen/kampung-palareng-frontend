"use client";

import { useMemo, useState } from "react";
import type { RumahMarker } from "@/types/portal";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function createBounds(markers: RumahMarker[]) {
  const latitudes = markers.map((marker) => marker.latitude);
  const longitudes = markers.map((marker) => marker.longitude);

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  return {
    minLat,
    maxLat,
    minLng,
    maxLng,
    latSpan: Math.max(maxLat - minLat, 0.0008),
    lngSpan: Math.max(maxLng - minLng, 0.0008),
  };
}

function normalizeMarker(marker: RumahMarker, bounds: ReturnType<typeof createBounds>) {
  const x = ((marker.longitude - bounds.minLng) / bounds.lngSpan) * 100;
  const y = ((bounds.maxLat - marker.latitude) / bounds.latSpan) * 100;

  return {
    x: clamp(x, 8, 92),
    y: clamp(y, 10, 90),
  };
}

function createLindonganPanels(markers: RumahMarker[], bounds: ReturnType<typeof createBounds>) {
  const lindonganMap = new Map<
    string,
    { left: number; top: number; right: number; bottom: number; total: number }
  >();

  markers.forEach((marker) => {
    const lindongan = marker.keluarga?.lindongan ?? marker.lindongan ?? "Tanpa Lindongan";
    const position = normalizeMarker(marker, bounds);
    const current = lindonganMap.get(lindongan);

    if (!current) {
      lindonganMap.set(lindongan, {
        left: position.x,
        top: position.y,
        right: position.x,
        bottom: position.y,
        total: 1,
      });
      return;
    }

    current.left = Math.min(current.left, position.x);
    current.top = Math.min(current.top, position.y);
    current.right = Math.max(current.right, position.x);
    current.bottom = Math.max(current.bottom, position.y);
    current.total += 1;
  });

  return Array.from(lindonganMap.entries())
    .slice(0, 3)
    .map(([label, box], index) => ({
      label,
      total: box.total,
      left: clamp(box.left - 8, 4, 78),
      top: clamp(box.top - 10, 4, 72),
      width: clamp(box.right - box.left + 16, 24, 48),
      height: clamp(box.bottom - box.top + 18, 20, 46),
      tone:
        index === 0
          ? "sky"
          : index === 1
            ? "emerald"
            : "blue",
    }));
}

export function SimpleVillageMap({
  markers,
  admin = false,
}: {
  markers: RumahMarker[];
  admin?: boolean;
}) {
  const [activeId, setActiveId] = useState<number | null>(markers[0]?.id ?? null);

  const computed = useMemo(() => {
    if (markers.length === 0) {
      return { bounds: null, positionedMarkers: [], lindonganPanels: [] };
    }

    const bounds = createBounds(markers);
    return {
      bounds,
      positionedMarkers: markers.map((marker) => ({
        marker,
        position: normalizeMarker(marker, bounds),
      })),
      lindonganPanels: createLindonganPanels(markers, bounds),
    };
  }, [markers]);

  const activeMarker =
    computed.positionedMarkers.find((item) => item.marker.id === activeId) ??
    computed.positionedMarkers[0] ??
    null;

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,_#dbeafe_0%,_#eff6ff_30%,_#f0fdf4_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
        <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(148,163,184,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.16)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="absolute left-[16%] top-[24%] h-1 w-[66%] -rotate-[14deg] rounded-full bg-slate-500/65 shadow-[0_0_0_6px_rgba(255,255,255,0.25)]" />
        <div className="absolute left-[30%] top-[34%] h-1 w-[42%] rotate-[30deg] rounded-full bg-slate-400/70 shadow-[0_0_0_5px_rgba(255,255,255,0.22)]" />

        {computed.lindonganPanels.map((panel) => (
          <div
            key={panel.label}
            className={`absolute rounded-[2rem] border ${
              panel.tone === "sky"
                ? "border-sky-300/70 bg-sky-400/10"
                : panel.tone === "emerald"
                  ? "border-emerald-300/70 bg-emerald-400/10"
                  : "border-blue-400/70 bg-blue-500/10"
            }`}
            style={{
              left: `${panel.left}%`,
              top: `${panel.top}%`,
              width: `${panel.width}%`,
              height: `${panel.height}%`,
            }}
          >
            <div
              className={`absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold shadow-sm ${
                panel.tone === "sky"
                  ? "text-sky-700"
                  : panel.tone === "emerald"
                    ? "text-emerald-700"
                    : "text-blue-700"
              }`}
            >
              {panel.label}
            </div>
          </div>
        ))}

        <div className="absolute left-1/2 top-[48%] -translate-x-1/2 rounded-full bg-slate-950/85 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-lg">
          Kampung Palareng
        </div>

        <div className="relative h-[520px] w-full">
          {computed.positionedMarkers.map(({ marker, position }, index) => (
            <button
              key={marker.id}
              type="button"
              onClick={() => setActiveId(marker.id)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition ${
                activeId === marker.id ? "scale-110" : "hover:scale-105"
              }`}
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
            >
              <span className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-sky-700 text-[10px] font-bold text-white shadow-[0_12px_24px_rgba(11,94,215,0.30)]">
                {index + 1}
                <span className="absolute -bottom-5 whitespace-nowrap rounded-full bg-slate-950/82 px-2 py-0.5 text-[9px] font-semibold text-white">
                  {marker.keluarga?.nama_kepala_keluarga ?? marker.nama_kepala_keluarga ?? "Rumah"}
                </span>
                {activeId === marker.id ? (
                  <span className="absolute inset-0 animate-ping rounded-full bg-sky-500/40" />
                ) : null}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
            Detail Rumah
          </p>
          {activeMarker ? (
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-lg font-bold text-slate-950">
                  {activeMarker.marker.keluarga?.nama_kepala_keluarga ??
                    activeMarker.marker.nama_kepala_keluarga ??
                    "-"}
                </p>
                <p className="text-sm text-slate-500">
                  {activeMarker.marker.keluarga?.lindongan ?? activeMarker.marker.lindongan}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <p>Penghuni: {activeMarker.marker.jumlah_penghuni}</p>
                {admin && activeMarker.marker.keluarga ? (
                  <>
                    <p className="mt-1">Kode keluarga: {activeMarker.marker.keluarga.kode_keluarga}</p>
                    <p className="mt-1">
                      Status ekonomi: {activeMarker.marker.keluarga.status_ekonomi}
                    </p>
                  </>
                ) : null}
              </div>
              <p className="text-sm leading-6 text-slate-500">
                Tampilan cadangan ini memakai koordinat rumah dari database. Saat peta browser aktif,
                titik rumah akan tampil langsung di peta OpenStreetMap biasa, tanpa drone.
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">Belum ada marker rumah untuk ditampilkan.</p>
          )}
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
            Ringkasan Lindongan
          </p>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            {computed.lindonganPanels.length > 0 ? (
              computed.lindonganPanels.map((panel) => (
                <div
                  key={panel.label}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"
                >
                  <span>{panel.label}</span>
                  <strong className="text-slate-950">{panel.total} rumah</strong>
                </div>
              ))
            ) : (
              <div className="rounded-xl bg-slate-50 px-3 py-2">Belum ada lindongan terpetakan.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
