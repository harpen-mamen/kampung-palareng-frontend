"use client";

import { useEffect, useState, useTransition } from "react";
import { DataTable } from "@/components/shared/data-table";
import { getAdminPendingWarga, updateAdminWargaApproval } from "@/lib/api";
import type { WargaApprovalRow } from "@/types/portal";

export function WargaApprovalManager() {
  const [rows, setRows] = useState<WargaApprovalRow[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function refreshData() {
    const response = await getAdminPendingWarga({ per_page: 50 });
    setRows(response.data);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      void refreshData();
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card-panel rounded-[1.6rem] border border-amber-100 bg-[linear-gradient(180deg,_#ffffff,_#fff8eb)] p-6">
          <p className="text-sm text-slate-500">Menunggu Persetujuan</p>
          <p className="mt-3 text-4xl font-black text-slate-950">{rows.length}</p>
        </div>
      </div>

      <div className="card-panel rounded-[1.75rem] p-6">
        <h3 className="text-lg font-bold text-slate-950">Daftar registrasi masyarakat</h3>
        <p className="mt-2 text-sm text-slate-600">
          Data masyarakat yang mendaftar melalui portal akan muncul di sini untuk diverifikasi admin.
        </p>

        {message ? <p className="mt-4 text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="mt-4 text-sm text-rose-700">{error}</p> : null}

        <div className="mt-5">
          <DataTable
            rows={rows}
            columns={[
              { key: "name", label: "Nama Lengkap" },
              {
                key: "keluarga",
                label: "Kepala Keluarga",
                render: (row) => row.keluarga?.nama_kepala_keluarga ?? "-",
              },
              { key: "nik", label: "NIK" },
              { key: "lindongan", label: "Lindongan" },
              {
                key: "whatsapp",
                label: "WhatsApp",
                render: (row) => row.whatsapp ?? row.phone ?? "-",
              },
              {
                key: "actions",
                label: "Aksi",
                render: (row) => (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        startTransition(async () => {
                          try {
                            await updateAdminWargaApproval(row.id, {
                              approval_status: "disetujui",
                            });
                            setMessage(`Akun warga ${row.name} berhasil disetujui.`);
                            setError("");
                            await refreshData();
                          } catch {
                            setError("Persetujuan warga gagal diproses.");
                          }
                        })
                      }
                      className="rounded-lg bg-emerald-600 px-3 py-1 font-semibold text-white"
                    >
                      {isPending ? "Memproses..." : "Setujui"}
                    </button>
                    <button
                      onClick={() =>
                        startTransition(async () => {
                          try {
                            await updateAdminWargaApproval(row.id, {
                              approval_status: "ditolak",
                            });
                            setMessage(`Akun warga ${row.name} ditolak.`);
                            setError("");
                            await refreshData();
                          } catch {
                            setError("Penolakan warga gagal diproses.");
                          }
                        })
                      }
                      className="rounded-lg bg-rose-600 px-3 py-1 font-semibold text-white"
                    >
                      Tolak
                    </button>
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
