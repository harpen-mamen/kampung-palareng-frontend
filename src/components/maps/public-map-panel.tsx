"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { PublicMap } from "@/components/maps/public-map";
import { getPublicMap } from "@/lib/api";
import type { PublicMapResponse, RumahMarker } from "@/types/portal";

type MapQuery = {
  search: string;
  lindongan: string;
  status_ekonomi: string;
  pekerjaan_utama: string;
  penerima_bantuan: string;
  bantuan_id: string;
  status_dtks: string;
};

const emptyQuery: MapQuery = {
  search: "",
  lindongan: "",
  status_ekonomi: "",
  pekerjaan_utama: "",
  penerima_bantuan: "",
  bantuan_id: "",
  status_dtks: "",
};

function countByLindongan(markers: RumahMarker[], lindongan: string) {
  return markers.filter((marker) => marker.lindongan === lindongan).length;
}

export function PublicMapPanel({ initialData }: { initialData: PublicMapResponse }) {
  const [markers, setMarkers] = useState(initialData.markers);
  const [filters, setFilters] = useState(initialData.filters);
  const [query, setQuery] = useState<MapQuery>(emptyQuery);
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(
    initialData.markers[0]?.id ?? null,
  );
  const [filterOpen, setFilterOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const timeout = setTimeout(() => {
      startTransition(async () => {
        const response = await getPublicMap({
          search: query.search,
          lindongan: query.lindongan,
          status_ekonomi: query.status_ekonomi,
          pekerjaan_utama: query.pekerjaan_utama,
          penerima_bantuan: query.penerima_bantuan,
          bantuan_id: query.bantuan_id ? Number(query.bantuan_id) : undefined,
          status_dtks: query.status_dtks,
        });
        setMarkers(response.markers);
        setFilters(response.filters);
      });
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  const recipientCount = markers.filter((marker) => (marker.keluarga?.bantuan?.length ?? 0) > 0).length;
  const nelayanCount = markers.filter((marker) => marker.keluarga?.pekerjaan_utama === "Nelayan").length;
  const dtksCount = markers.filter((marker) => marker.keluarga?.status_dtks).length;
  const activeFilterCount = Object.values(query).filter((value) => value.trim() !== "").length;
  const activeMarker = markers.find((marker) => marker.id === selectedMarkerId) ?? markers[0] ?? null;
  const quickStats = useMemo(
    () => [
      ["Hasil Peta", isPending ? "..." : String(markers.length), "Rumah cocok dengan filter"],
      ["Penerima Bantuan", String(recipientCount), "Marker keluarga penerima"],
      ["Nelayan", String(nelayanCount), "Keluarga dengan pekerjaan utama nelayan"],
      ["DTKS", String(dtksCount), "Keluarga dengan status DTKS"],
    ],
    [dtksCount, isPending, markers.length, nelayanCount, recipientCount],
  );

  return (
    <div className="overflow-hidden rounded-[2rem] border border-sky-100 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 bg-slate-950 px-5 py-4 text-white">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
            Tampilan Peta
          </p>
          <p className="mt-1 text-sm text-white/80">
            Peta dibuat lebih terbuka, dan filter sekarang muncul saat tombol filter diklik.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/75">
          <span className="inline-flex rounded-full border border-white/20 px-3 py-1">
            Mode Publik
          </span>
          <span className="inline-flex rounded-full border border-white/20 px-3 py-1">
            Interaktif
          </span>
        </div>
      </div>

      <div className="grid gap-4 border-b border-sky-100 bg-[linear-gradient(135deg,_rgba(248,250,252,0.95),_rgba(239,246,255,0.95))] px-4 py-4 md:grid-cols-2 md:px-5 xl:grid-cols-4">
        {quickStats.map(([label, value, caption], index) => (
          <div
            key={label}
            className={`rounded-[1.3rem] px-4 py-4 ${
              index === 0 ? "bg-slate-950 text-white" : "border border-slate-200 bg-white"
            }`}
          >
            <p
              className={`text-xs font-semibold uppercase tracking-[0.22em] ${
                index === 0 ? "text-sky-200" : "text-slate-500"
              }`}
            >
              {label}
            </p>
            <p className={`mt-2 text-3xl font-black ${index === 0 ? "text-white" : "text-slate-950"}`}>
              {value}
            </p>
            <p className={`mt-1 text-sm ${index === 0 ? "text-white/70" : "text-slate-500"}`}>
              {caption}
            </p>
          </div>
        ))}
      </div>

      <div className="relative p-4 lg:pt-24">
        <div className="mb-4 flex flex-col gap-3 lg:pointer-events-none lg:absolute lg:left-4 lg:right-4 lg:top-4 lg:z-[600] lg:mb-0 lg:flex-row lg:flex-wrap lg:items-start lg:justify-between sm:gap-4 lg:left-7 lg:right-7 lg:top-7">
          <div className="relative lg:pointer-events-auto">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterOpen((prev) => !prev)}
                className="rounded-full border border-white/70 bg-white/92 px-4 py-3 text-sm font-semibold text-slate-900 shadow-[0_16px_35px_rgba(15,23,42,0.12)] backdrop-blur transition hover:border-sky-200"
              >
                {filterOpen ? "Tutup Filter" : "Filter & Pencarian"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuery(emptyQuery);
                  setFilterOpen(false);
                }}
                className="rounded-full border border-white/70 bg-white/92 px-4 py-3 text-sm font-semibold text-slate-700 shadow-[0_16px_35px_rgba(15,23,42,0.10)] backdrop-blur transition hover:border-sky-200"
              >
                Reset
              </button>
              <span className="rounded-full border border-white/70 bg-slate-950/88 px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(15,23,42,0.18)] backdrop-blur">
                Filter aktif: {activeFilterCount}
              </span>
            </div>

            {filterOpen ? (
              <div className="mt-3 w-full max-w-[680px] rounded-[1.5rem] border border-white/70 bg-white/96 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.18)] backdrop-blur">
                <div className="mb-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                    Filter Pencarian
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Klik tombol ini saat perlu mencari keluarga, penerima bantuan, nelayan, DTKS, atau jenis bantuan.
                  </p>
                </div>

                <div className="grid gap-3">
                  <input
                    value={query.search}
                    onChange={(event) => setQuery((prev) => ({ ...prev, search: event.target.value }))}
                    placeholder="Cari nama kepala keluarga atau kode keluarga..."
                    className="w-full rounded-2xl border border-sky-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-300"
                  />

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    <select
                      value={query.lindongan}
                      onChange={(event) => setQuery((prev) => ({ ...prev, lindongan: event.target.value }))}
                      className="rounded-2xl border border-sky-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-300"
                    >
                      <option value="">Semua Lindongan</option>
                      {filters.lindongan.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <select
                      value={query.pekerjaan_utama}
                      onChange={(event) => setQuery((prev) => ({ ...prev, pekerjaan_utama: event.target.value }))}
                      className="rounded-2xl border border-sky-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-300"
                    >
                      <option value="">Semua Pekerjaan</option>
                      {filters.pekerjaan_utama.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <select
                      value={query.status_ekonomi}
                      onChange={(event) => setQuery((prev) => ({ ...prev, status_ekonomi: event.target.value }))}
                      className="rounded-2xl border border-sky-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-300"
                    >
                      <option value="">Semua Status Ekonomi</option>
                      {filters.status_ekonomi.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <select
                      value={query.penerima_bantuan}
                      onChange={(event) => setQuery((prev) => ({ ...prev, penerima_bantuan: event.target.value }))}
                      className="rounded-2xl border border-sky-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-300"
                    >
                      <option value="">Semua Status Bantuan</option>
                      <option value="1">Penerima Bantuan</option>
                      <option value="0">Bukan Penerima Bantuan</option>
                    </select>
                    <select
                      value={query.bantuan_id}
                      onChange={(event) => setQuery((prev) => ({ ...prev, bantuan_id: event.target.value }))}
                      className="rounded-2xl border border-sky-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-300"
                    >
                      <option value="">Semua Jenis Bantuan</option>
                      {filters.bantuan.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.nama_bantuan}
                        </option>
                      ))}
                    </select>
                    <select
                      value={query.status_dtks}
                      onChange={(event) => setQuery((prev) => ({ ...prev, status_dtks: event.target.value }))}
                      className="rounded-2xl border border-sky-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-300"
                    >
                      <option value="">Semua Status DTKS</option>
                      <option value="1">DTKS</option>
                      <option value="0">Non-DTKS</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2 lg:pointer-events-none lg:justify-end">
            {filters.lindongan.map((item, index) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-[0_14px_24px_rgba(15,23,42,0.10)] backdrop-blur"
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    index % 4 === 0
                      ? "bg-sky-600"
                      : index % 4 === 1
                        ? "bg-emerald-600"
                        : index % 4 === 2
                          ? "bg-blue-700"
                          : "bg-teal-700"
                  }`}
                />
                {item}: {countByLindongan(markers, item)}
              </span>
            ))}
          </div>
        </div>

        <PublicMap markers={markers} onMarkerSelect={(marker) => setSelectedMarkerId(marker.id)} />
      </div>

      <div className="grid gap-4 border-t border-sky-100 bg-slate-50 px-5 py-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                Detail Terpilih
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-950">
                {activeMarker?.keluarga?.nama_kepala_keluarga ??
                  activeMarker?.nama_kepala_keluarga ??
                  "Belum ada marker dipilih"}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {activeMarker?.keluarga?.alamat ??
                  activeMarker?.alamat_singkat ??
                  "Klik marker pada peta untuk melihat ringkasan keluarga di sini."}
              </p>
            </div>
            <span className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              {activeMarker?.keluarga?.lindongan ?? activeMarker?.lindongan ?? "Belum dipilih"}
            </span>
          </div>

          {activeMarker ? (
            <>
              <div className="mt-5 grid gap-3 md:grid-cols-4">
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Penghuni
                  </p>
                  <p className="mt-2 text-2xl font-black text-slate-950">
                    {activeMarker.keluarga?.jumlah_anggota ?? activeMarker.jumlah_penghuni}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Pekerjaan
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-950">
                    {activeMarker.keluarga?.pekerjaan_utama ?? "-"}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Status DTKS
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-950">
                    {activeMarker.keluarga?.status_dtks ? "Masuk DTKS" : "Non-DTKS"}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Kategori Rumah
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-950">
                    {activeMarker.keluarga?.kategori_rumah ?? activeMarker.kategori_rumah ?? "-"}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-[1.35rem] border border-slate-200 bg-[linear-gradient(135deg,_rgba(239,246,255,0.95),_rgba(236,253,245,0.95))] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                    Profil Keluarga
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <div className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2">
                      <span>Status ekonomi</span>
                      <strong className="text-slate-950">
                        {activeMarker.keluarga?.status_ekonomi ?? "-"}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2">
                      <span>Jenis rumah</span>
                      <strong className="text-slate-950">
                        {activeMarker.keluarga?.kategori_rumah ??
                          activeMarker.kategori_rumah ??
                          "-"}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2">
                      <span>Koordinat</span>
                      <strong className="text-slate-950">
                        {activeMarker.latitude.toFixed(4)}, {activeMarker.longitude.toFixed(4)}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.35rem] border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                    Bantuan Tercatat
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(activeMarker.keluarga?.bantuan?.length ?? 0) > 0 ? (
                      activeMarker.keluarga?.bantuan?.map((item, index) => (
                        <div
                          key={`${item.nama_bantuan}-${index}`}
                          className="rounded-2xl border border-sky-100 bg-sky-50 px-3 py-3 text-sm"
                        >
                          <p className="font-bold text-slate-950">
                            {item.nama_bantuan ?? "Bantuan"}
                          </p>
                          <p className="mt-1 text-slate-600">{item.status_penerima}</p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
                        Belum ada bantuan yang tercatat untuk keluarga ini.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-sm text-slate-500">
              Belum ada data keluarga yang bisa ditampilkan dari hasil filter saat ini.
            </div>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-1">
          <div className="rounded-2xl bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
              Informasi Marker
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Klik marker rumah untuk melihat keluarga, jumlah penghuni, dan bantuan yang diterima.
            </p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Privasi Publik
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Data sensitif seperti kode keluarga dan informasi administratif penuh tidak ditampilkan.
            </p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-700">
              Status
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {isPending
                ? "Peta sedang diperbarui berdasarkan filter."
                : "Peta siap digunakan dengan dropdown filter yang lebih ringkas."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
