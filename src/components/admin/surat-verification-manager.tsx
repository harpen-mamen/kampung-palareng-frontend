"use client";

import { useEffect, useState, useTransition } from "react";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  downloadAdminPengajuanSuratDocument,
  getAdminPengajuanSurat,
  updateAdminPengajuanSuratStatus,
} from "@/lib/api";
import { buildSuratWhatsappUrl } from "@/lib/whatsapp";
import type { PengajuanSurat } from "@/types/portal";

export function SuratVerificationManager() {
  const [rows, setRows] = useState<PengajuanSurat[]>([]);
  const [selected, setSelected] = useState<PengajuanSurat | null>(null);
  const [status, setStatus] = useState("diperiksa");
  const [catatan, setCatatan] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function refreshData() {
    const suratResponse = await getAdminPengajuanSurat({ per_page: 20 });
    setRows(suratResponse.data);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      void refreshData();
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="space-y-6">
      <div className="card-panel rounded-[1.75rem] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
            Verifikasi Surat
          </p>
          <h3 className="mt-3 text-xl font-bold text-slate-950">Proses pengajuan layanan surat</h3>
          {selected ? (
            <div className="mt-4 grid gap-4 xl:grid-cols-[0.8fr_0.8fr_1.2fr]">
              <div className="rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                <p className="font-semibold text-slate-900">{selected.nama_pemohon}</p>
                <p>Jenis surat: {selected.jenis_surat}</p>
                <p>Keperluan: {selected.keperluan ?? "-"}</p>
                <p>Lindongan: {selected.lindongan}</p>
                <p>Alamat: {selected.alamat}</p>
                <p>WhatsApp: {selected.whatsapp_pemohon ?? "Belum tersimpan"}</p>
                <p className="mt-2">
                  Nomor surat:{" "}
                  <span className="font-semibold text-slate-950">
                    {selected.nomor_surat ?? "Belum dibuat"}
                  </span>
                </p>
              </div>
              <div className="grid gap-3">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="rounded-xl border border-slate-200 px-4 py-3"
                >
                  <option>diajukan</option>
                  <option>diperiksa</option>
                  <option>perlu_perbaikan</option>
                  <option>disetujui</option>
                  <option>selesai</option>
                </select>
                <textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  className="rounded-xl border border-slate-200 px-4 py-3"
                  placeholder="Catatan admin"
                  rows={4}
                />
                {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
                {error ? <p className="text-sm text-rose-700">{error}</p> : null}
                <button
                  onClick={() =>
                    startTransition(async () => {
                      try {
                        const result = await updateAdminPengajuanSuratStatus(selected.id, {
                          status,
                          catatan_admin: catatan,
                        });
                        setSelected(result);
                        setStatus(result.status);
                        setCatatan(result.catatan_admin ?? "");
                        setMessage("Status surat berhasil diperbarui.");
                        setError("");
                        await refreshData();
                      } catch {
                        setError("Pembaruan status surat gagal.");
                      }
                    })
                  }
                  className="rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white"
                >
                  {isPending ? "Menyimpan..." : "Simpan Verifikasi"}
                </button>
                {selected.file_surat ? (
                  <button
                    type="button"
                    onClick={() =>
                      startTransition(async () => {
                        try {
                          await downloadAdminPengajuanSuratDocument(selected.id);
                          setMessage("Dokumen surat berhasil diunduh dari arsip.");
                          setError("");
                        } catch {
                          setError("Dokumen surat gagal diunduh.");
                        }
                      })
                    }
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 font-semibold text-emerald-700"
                  >
                    Unduh Surat PDF
                  </button>
                ) : null}
                {buildSuratWhatsappUrl(selected) ? (
                  <button
                    type="button"
                    onClick={() => {
                      const link = buildSuratWhatsappUrl(selected);

                      if (link) {
                        window.open(link, "_blank", "noopener,noreferrer");
                      }
                    }}
                    className="rounded-xl border border-emerald-200 bg-white px-5 py-3 font-semibold text-emerald-700"
                  >
                    Kirim WhatsApp + Link PDF
                  </button>
                ) : null}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
                  Draft Surat Resmi
                </p>
                {selected.isi_surat ? (
                  <>
                    <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
                      <p>Nomor: {selected.nomor_surat}</p>
                      <p>Tanggal: {selected.tanggal_surat ?? "-"}</p>
                      <p>Arsip: {selected.arsip_surat_at ? "Sudah tersimpan" : "Belum diarsipkan"}</p>
                    </div>
                    <pre className="mt-3 max-h-[22rem] overflow-auto whitespace-pre-wrap rounded-xl bg-slate-950 px-4 py-4 text-sm leading-7 text-slate-100">
                      {selected.isi_surat}
                    </pre>
                  </>
                ) : (
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Draft surat resmi akan dibuat otomatis saat status pengajuan diubah menjadi
                    <span className="font-semibold text-slate-900"> disetujui</span>.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-600">
              Pilih salah satu pengajuan surat dari tabel di bawah untuk diverifikasi.
            </p>
          )}
      </div>

      <div className="card-panel rounded-[1.75rem] p-6">
        <h3 className="text-lg font-bold text-slate-950">Daftar pengajuan surat masuk</h3>
        <p className="mt-2 text-sm text-slate-600">
          Setiap pengajuan dari warga approved akan otomatis muncul di tabel ini untuk ditinjau.
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
              {
                key: "arsip_surat_at",
                label: "Arsip",
                render: (row) => (row.arsip_surat_at ? "Tersimpan" : "Belum"),
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
                        setStatus(row.status);
                        setCatatan(row.catatan_admin ?? "");
                        setMessage("");
                        setError("");
                      }}
                      className="rounded-lg bg-slate-100 px-3 py-1 font-semibold"
                    >
                      Verifikasi
                    </button>
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
    </div>
  );
}
