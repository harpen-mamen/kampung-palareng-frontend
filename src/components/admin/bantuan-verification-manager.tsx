"use client";

import { useEffect, useState, useTransition } from "react";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { buildBantuanWhatsappUrl } from "@/lib/whatsapp";
import { getAdminPengajuanBantuan, getAdminKeluarga, updateAdminPengajuanBantuanStatus } from "@/lib/api";
import type { Keluarga, PengajuanBantuan } from "@/types/portal";

function getPemohonWhatsapp(row: PengajuanBantuan) {
  return row.whatsapp_pemohon ?? row.user?.whatsapp ?? row.user?.phone ?? null;
}

export function BantuanVerificationManager() {
  const [rows, setRows] = useState<PengajuanBantuan[]>([]);
  const [keluargaOptions, setKeluargaOptions] = useState<Keluarga[]>([]);
  const [selected, setSelected] = useState<PengajuanBantuan | null>(null);
  const [status, setStatus] = useState("diverifikasi");
  const [catatan, setCatatan] = useState("");
  const [keluargaId, setKeluargaId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function refreshData() {
    const [pengajuan, keluarga] = await Promise.all([
      getAdminPengajuanBantuan({ per_page: 20 }),
      getAdminKeluarga({ per_page: 100 }),
    ]);
    setRows(pengajuan.data);
    setKeluargaOptions(keluarga.data);
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
        <h3 className="text-xl font-bold">Verifikasi Pengajuan Bantuan</h3>
        {selected ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
              <p className="font-semibold text-slate-900">{selected.nama_pemohon}</p>
              <p>Jenis bantuan: {selected.jenis_bantuan}</p>
              <p>Program bantuan: {selected.bantuan?.nama_bantuan ?? "-"}</p>
              <p>Lindongan: {selected.lindongan}</p>
              <p>Alamat: {selected.alamat}</p>
              <p>WhatsApp: {getPemohonWhatsapp(selected) ?? "Belum tersimpan"}</p>
              <p>Keterangan: {selected.keterangan ?? "-"}</p>
            </div>
            <div className="grid gap-3">
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-slate-200 px-4 py-3">
                <option>diajukan</option>
                <option>diverifikasi</option>
                <option>diproses</option>
                <option>disetujui</option>
                <option>ditolak</option>
                <option>selesai</option>
              </select>
              <select value={keluargaId} onChange={(e) => setKeluargaId(e.target.value)} className="rounded-xl border border-slate-200 px-4 py-3">
                <option value="">Hubungkan ke keluarga (opsional)</option>
                {keluargaOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.kode_keluarga} - {item.nama_kepala_keluarga}
                  </option>
                ))}
              </select>
              <textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Catatan admin" rows={4} />
              {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
              {error ? <p className="text-sm text-rose-700">{error}</p> : null}
              <button
                onClick={() =>
                  startTransition(async () => {
                    try {
                      const result = await updateAdminPengajuanBantuanStatus(selected.id, {
                        status_pengajuan: status,
                        catatan_admin: catatan,
                        keluarga_id: keluargaId ? Number(keluargaId) : null,
                      });
                      setSelected(result);
                      setStatus(result.status_pengajuan);
                      setCatatan(result.catatan_admin ?? "");
                      setKeluargaId(result.keluarga_id ? String(result.keluarga_id) : "");
                      setMessage("Status bantuan berhasil diperbarui. Silakan kirim notifikasi WhatsApp ke pemohon bila diperlukan.");
                      setError("");
                      await refreshData();
                    } catch {
                      setError("Pembaruan status bantuan gagal.");
                    }
                  })
                }
                className="rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white"
              >
                {isPending ? "Menyimpan..." : "Simpan Verifikasi"}
              </button>
              {buildBantuanWhatsappUrl({
                ...selected,
                status_pengajuan: status,
                catatan_admin: catatan,
              }) ? (
                <button
                  type="button"
                  onClick={() => {
                    const link = buildBantuanWhatsappUrl({
                      ...selected,
                      status_pengajuan: status,
                      catatan_admin: catatan,
                    });

                    if (link) {
                      window.open(link, "_blank", "noopener,noreferrer");
                    }
                  }}
                  className="rounded-xl border border-emerald-200 bg-white px-5 py-3 font-semibold text-emerald-700"
                >
                  Kirim WhatsApp Pemohon
                </button>
              ) : null}
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-600">Pilih salah satu pengajuan bantuan dari tabel di bawah untuk diverifikasi.</p>
        )}
      </div>

      <DataTable
        rows={rows}
        columns={[
          { key: "nama_pemohon", label: "Pemohon" },
          { key: "jenis_bantuan", label: "Jenis Bantuan" },
          { key: "lindongan", label: "Lindongan" },
          { key: "status_pengajuan", label: "Status", render: (row) => <StatusBadge status={row.status_pengajuan} /> },
          {
            key: "whatsapp",
            label: "WhatsApp",
            render: (row) =>
              buildBantuanWhatsappUrl({
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
              ) : (
                <span className="text-sm text-slate-400">Belum ada nomor</span>
              ),
          },
          {
            key: "actions",
            label: "Aksi",
            render: (row) => (
              <button
                onClick={() => {
                  setSelected(row);
                  setStatus(row.status_pengajuan);
                  setCatatan(row.catatan_admin ?? "");
                  setKeluargaId(row.keluarga_id ? String(row.keluarga_id) : "");
                  setMessage("");
                  setError("");
                }}
                className="rounded-lg bg-slate-100 px-3 py-1 font-semibold"
              >
                Verifikasi
              </button>
            ),
          },
        ]}
      />
    </div>
  );
}
