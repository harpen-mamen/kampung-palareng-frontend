"use client";

import { useEffect, useState, useTransition } from "react";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  downloadAdminPengajuanSuratDocument,
  getAdminPengajuanSurat,
} from "@/lib/api";
import { buildSuratWhatsappUrl } from "@/lib/whatsapp";
import type { PengajuanSurat } from "@/types/portal";

type Filters = {
  search: string;
  lindongan: string;
  status: string;
};

const initialFilters: Filters = {
  search: "",
  lindongan: "",
  status: "",
};

function formatDate(date?: string | null) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function SuratArchiveManager() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [rows, setRows] = useState<PengajuanSurat[]>([]);
  const [selected, setSelected] = useState<PengajuanSurat | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function refreshData(nextFilters: Filters = filters) {
    try {
      const response = await getAdminPengajuanSurat({
        per_page: 50,
        search: nextFilters.search,
        lindongan: nextFilters.lindongan,
        status: nextFilters.status,
        archived_only: true,
      });

      setRows(response.data);

      if (selected) {
        const updatedSelected = response.data.find((item) => item.id === selected.id) ?? null;
        setSelected(updatedSelected);
      }
    } catch {
      setError("Arsip surat gagal dimuat.");
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      void (async () => {
        try {
          const response = await getAdminPengajuanSurat({
            per_page: 50,
            search: initialFilters.search,
            lindongan: initialFilters.lindongan,
            status: initialFilters.status,
            archived_only: true,
          });

          setRows(response.data);
        } catch {
          setError("Arsip surat gagal dimuat.");
        }
      })();
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  const totalArsip = rows.length;
  const selesai = rows.filter((row) => row.status === "selesai").length;
  const siapCetak = rows.filter((row) => row.file_surat).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card-panel rounded-[1.6rem] border border-sky-100 bg-[linear-gradient(180deg,_#ffffff,_#f2f8ff)] p-6">
          <p className="text-sm text-slate-500">Total Arsip Surat</p>
          <p className="mt-3 text-4xl font-black text-slate-950">{totalArsip}</p>
        </div>
        <div className="card-panel rounded-[1.6rem] border border-emerald-100 bg-[linear-gradient(180deg,_#ffffff,_#f2fdf7)] p-6">
          <p className="text-sm text-slate-500">Status Selesai</p>
          <p className="mt-3 text-4xl font-black text-slate-950">{selesai}</p>
        </div>
        <div className="card-panel rounded-[1.6rem] border border-amber-100 bg-[linear-gradient(180deg,_#ffffff,_#fff8eb)] p-6">
          <p className="text-sm text-slate-500">PDF Tersedia</p>
          <p className="mt-3 text-4xl font-black text-slate-950">{siapCetak}</p>
        </div>
      </div>

      <div className="card-panel rounded-[1.75rem] p-6">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr_0.9fr_auto]">
          <input
            value={filters.search}
            onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
            className="rounded-2xl border border-slate-200 px-4 py-3"
            placeholder="Cari nama pemohon, jenis surat, atau nomor surat..."
          />
          <select
            value={filters.lindongan}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, lindongan: event.target.value }))
            }
            className="rounded-2xl border border-slate-200 px-4 py-3"
          >
            <option value="">Semua Lindongan</option>
            <option value="Lindongan 1">Lindongan 1</option>
            <option value="Lindongan 2">Lindongan 2</option>
            <option value="Lindongan 3">Lindongan 3</option>
          </select>
          <select
            value={filters.status}
            onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
            className="rounded-2xl border border-slate-200 px-4 py-3"
          >
            <option value="">Semua Status</option>
            <option value="disetujui">Disetujui</option>
            <option value="selesai">Selesai</option>
            <option value="diperiksa">Diperiksa</option>
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
          <h3 className="text-lg font-bold text-slate-950">Daftar arsip surat resmi</h3>
          <p className="mt-2 text-sm text-slate-600">
            Semua surat yang sudah dibentuk menjadi PDF dan masuk arsip kampung muncul di sini.
          </p>

          <div className="mt-5">
            <DataTable
              rows={rows}
              columns={[
                { key: "nama_pemohon", label: "Pemohon" },
                { key: "jenis_surat", label: "Jenis Surat" },
                {
                  key: "keperluan",
                  label: "Keperluan",
                  render: (row) => row.keperluan ?? "-",
                },
                {
                  key: "nomor_surat",
                  label: "Nomor Surat",
                  render: (row) => row.nomor_surat ?? "-",
                },
                { key: "lindongan", label: "Lindongan" },
                {
                  key: "status",
                  label: "Status",
                  render: (row) => <StatusBadge status={row.status} />,
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
                      {row.file_surat ? (
                        <button
                          onClick={() =>
                            startTransition(async () => {
                              try {
                                await downloadAdminPengajuanSuratDocument(row.id);
                                setMessage(`Arsip surat ${row.nomor_surat ?? row.id} berhasil diunduh.`);
                                setError("");
                              } catch {
                                setError("Arsip surat gagal diunduh.");
                              }
                            })
                          }
                          className="rounded-lg bg-emerald-600 px-3 py-1 font-semibold text-white"
                        >
                          Unduh PDF
                        </button>
                      ) : null}
                      {buildSuratWhatsappUrl(row) ? (
                        <button
                          onClick={() => {
                            const link = buildSuratWhatsappUrl(row);

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
                <p>Jenis surat: {selected.jenis_surat}</p>
                <p>Keperluan: {selected.keperluan ?? "-"}</p>
                <p>Nomor surat: {selected.nomor_surat ?? "-"}</p>
                <p>Tanggal surat: {formatDate(selected.tanggal_surat)}</p>
                <p>Diarsipkan: {formatDate(selected.arsip_surat_at)}</p>
                <p>WhatsApp: {selected.whatsapp_pemohon ?? "Belum tersimpan"}</p>
                <p>Penandatangan: {selected.nama_penandatangan ?? "-"}</p>
                <p>Jabatan: {selected.jabatan_penandatangan ?? "-"}</p>
              </div>

              {selected.file_surat ? (
                <button
                  onClick={() =>
                    startTransition(async () => {
                      try {
                        await downloadAdminPengajuanSuratDocument(selected.id);
                        setMessage("Arsip surat berhasil diunduh.");
                        setError("");
                      } catch {
                        setError("Arsip surat gagal diunduh.");
                      }
                    })
                  }
                  className="w-full rounded-2xl bg-emerald-700 px-5 py-3 font-semibold text-white"
                >
                  {isPending ? "Menyiapkan..." : "Unduh Arsip PDF"}
                </button>
              ) : null}
              {buildSuratWhatsappUrl(selected) ? (
                <button
                  onClick={() => {
                    const link = buildSuratWhatsappUrl(selected);

                    if (link) {
                      window.open(link, "_blank", "noopener,noreferrer");
                    }
                  }}
                  className="w-full rounded-2xl border border-emerald-200 bg-white px-5 py-3 font-semibold text-emerald-700"
                >
                  Kirim WhatsApp + Link PDF
                </button>
              ) : null}

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
                  Isi Surat
                </p>
                <pre className="mt-3 max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-xl bg-slate-950 px-4 py-4 text-sm leading-7 text-slate-100">
                  {selected.isi_surat ?? "Isi surat belum tersedia."}
                </pre>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Pilih salah satu arsip surat dari tabel di samping untuk melihat detail dokumen dan
              mengunduh PDF resmi.
            </p>
          )}

          {message ? <p className="mt-4 text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="mt-4 text-sm text-rose-700">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
