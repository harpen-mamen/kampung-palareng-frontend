"use client";

import { useEffect, useState, useTransition, useCallback } from "react";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { getAdminPengajuanBantuan } from "@/lib/api";
import { buildBantuanWhatsappUrl } from "@/lib/whatsapp";
import type { PengajuanBantuan } from "@/types/portal";

function getPemohonWhatsapp(row: PengajuanBantuan) {
  return row.whatsapp_pemohon ?? row.user?.whatsapp ?? row.user?.phone ?? null;
}

type Filters = {
  search: string;
  lindongan: string;
  status_pengajuan: string;
};

const initialFilters: Filters = {
  search: "",
  lindongan: "",
  status_pengajuan: "",
};

export function BantuanArchiveManager() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [rows, setRows] = useState<PengajuanBantuan[]>([]);
  const [selected, setSelected] = useState<PengajuanBantuan | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const refreshData = useCallback(async (nextFilters: Filters = filters) => {
    try {
      const response = await getAdminPengajuanBantuan({
        per_page: 100,
        search: nextFilters.search,
        lindongan: nextFilters.lindongan,
        status_pengajuan: nextFilters.status_pengajuan,
        archived_only: true,
      });

      setRows(response.data);

      if (selected) {
        const updatedSelected = response.data.find((item) => item.id === selected.id) ?? null;
        setSelected(updatedSelected);
      }
    } catch {
      setError("Arsip bantuan gagal dimuat.");
    }
  }, [filters, selected]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void refreshData(initialFilters);
    }, 0);

    return () => clearTimeout(timeout);
  }, [refreshData]);

  const totalArsip = rows.length;
  const totalDisetujui = rows.filter((item) => item.status_pengajuan === "disetujui").length;
  const totalSelesai = rows.filter((item) => item.status_pengajuan === "selesai").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card-panel rounded-[1.6rem] border border-sky-100 bg-[linear-gradient(180deg,_#ffffff,_#f2f8ff)] p-6">
          <p className="text-sm text-slate-500">Total Arsip Bantuan</p>
          <p className="mt-3 text-4xl font-black text-slate-950">{totalArsip}</p>
        </div>
        <div className="card-panel rounded-[1.6rem] border border-emerald-100 bg-[linear-gradient(180deg,_#ffffff,_#f2fdf7)] p-6">
          <p className="text-sm text-slate-500">Disetujui</p>
          <p className="mt-3 text-4xl font-black text-slate-950">{totalDisetujui}</p>
        </div>
        <div className="card-panel rounded-[1.6rem] border border-amber-100 bg-[linear-gradient(180deg,_#ffffff,_#fff8eb)] p-6">
          <p className="text-sm text-slate-500">Selesai</p>
          <p className="mt-3 text-4xl font-black text-slate-950">{totalSelesai}</p>
        </div>
      </div>

      <div className="card-panel rounded-[1.75rem] p-6">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr_0.9fr_auto]">
          <input
            value={filters.search}
            onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
            className="rounded-2xl border border-slate-200 px-4 py-3"
            placeholder="Cari nama pemohon, program bantuan, atau nomor WhatsApp..."
          />
          <select
            value={filters.lindongan}
            onChange={(event) => setFilters((prev) => ({ ...prev, lindongan: event.target.value }))}
            className="rounded-2xl border border-slate-200 px-4 py-3"
          >
            <option value="">Semua Lindongan</option>
            <option value="Lindongan 1">Lindongan 1</option>
            <option value="Lindongan 2">Lindongan 2</option>
            <option value="Lindongan 3">Lindongan 3</option>
          </select>
          <select
            value={filters.status_pengajuan}
            onChange={(event) => setFilters((prev) => ({ ...prev, status_pengajuan: event.target.value }))}
            className="rounded-2xl border border-slate-200 px-4 py-3"
          >
            <option value="">Semua Status Arsip</option>
            <option value="disetujui">Disetujui</option>
            <option value="ditolak">Ditolak</option>
            <option value="selesai">Selesai</option>
          </select>
          <div className="flex gap-3">
            <button
              onClick={() =>
                startTransition(async () => {
                  setMessage("");
                  setError("");
                  await refreshData(filters);
                })
              }
              className="rounded-2xl bg-sky-700 px-5 py-3 font-semibold text-white"
            >
              {isPending ? "Memuat..." : "Terapkan"}
            </button>
            <button
              onClick={() =>
                startTransition(async () => {
                  setFilters(initialFilters);
                  setMessage("");
                  setError("");
                  await refreshData(initialFilters);
                })
              }
              className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="card-panel rounded-[1.75rem] p-6">
          <h3 className="text-lg font-bold text-slate-950">Daftar arsip bantuan</h3>
          <p className="mt-2 text-sm text-slate-600">
            Semua pengajuan bantuan yang sudah diputuskan admin tampil di sini.
          </p>

          <div className="mt-5">
            <DataTable
              rows={rows}
              columns={[
                { key: "nama_pemohon", label: "Pemohon" },
                {
                  key: "program",
                  label: "Program Bantuan",
                  render: (row) => row.bantuan?.nama_bantuan ?? row.jenis_bantuan,
                },
                { key: "lindongan", label: "Lindongan" },
                {
                  key: "status_pengajuan",
                  label: "Status",
                  render: (row) => <StatusBadge status={row.status_pengajuan} />,
                },
                {
                  key: "actions",
                  label: "Aksi",
                  render: (row) => (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelected(row);
                          setMessage("");
                          setError("");
                        }}
                        className="rounded-lg bg-slate-100 px-3 py-1 font-semibold"
                      >
                        Detail
                      </button>
                      {buildBantuanWhatsappUrl({
                        ...row,
                        whatsapp_pemohon: getPemohonWhatsapp(row) ?? undefined,
                      }) ? (
                        <button
                          onClick={() => {
                            const link = buildBantuanWhatsappUrl({
                              ...row,
                              whatsapp_pemohon: getPemohonWhatsapp(row) ?? undefined,
                            });

                            if (link) {
                              window.open(link, "_blank", "noopener,noreferrer");
                            }
                          }}
                          className="rounded-lg border border-emerald-200 bg-white px-3 py-1 font-semibold text-emerald-700"
                        >
                          WhatsApp
                        </button>
                      ) : null}
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>

        <div className="card-panel rounded-[1.75rem] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
            Detail Arsip
          </p>
          {selected ? (
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                <p className="font-semibold text-slate-950">{selected.nama_pemohon}</p>
                <p>Program bantuan: {selected.bantuan?.nama_bantuan ?? selected.jenis_bantuan}</p>
                <p>Lindongan: {selected.lindongan}</p>
                <p>Status: {selected.status_pengajuan}</p>
                <p>WhatsApp: {getPemohonWhatsapp(selected) ?? "Belum tersimpan"}</p>
                <p>Catatan admin: {selected.catatan_admin ?? "-"}</p>
              </div>

              {buildBantuanWhatsappUrl({
                ...selected,
                whatsapp_pemohon: getPemohonWhatsapp(selected) ?? undefined,
              }) ? (
                <button
                  onClick={() => {
                    const link = buildBantuanWhatsappUrl({
                      ...selected,
                      whatsapp_pemohon: getPemohonWhatsapp(selected) ?? undefined,
                    });

                    if (link) {
                      window.open(link, "_blank", "noopener,noreferrer");
                    }
                  }}
                  className="w-full rounded-2xl border border-emerald-200 bg-white px-5 py-3 font-semibold text-emerald-700"
                >
                  Kirim WhatsApp Pemohon
                </button>
              ) : null}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Pilih salah satu arsip bantuan dari tabel di samping untuk melihat detail dan menghubungi pemohon.
            </p>
          )}

          {message ? <p className="mt-4 text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="mt-4 text-sm text-rose-700">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
