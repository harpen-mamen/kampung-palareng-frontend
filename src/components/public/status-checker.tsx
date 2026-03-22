"use client";

import { useState, useTransition } from "react";
import { getPengajuanBantuanStatus, getPengajuanSuratStatus } from "@/lib/api";
import { StatusBadge } from "@/components/shared/status-badge";

export function StatusChecker({ type }: { type: "surat" | "bantuan" }) {
  const [id, setId] = useState("");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="card-panel rounded-[1.75rem] p-8">
      <h1 className="font-serif text-3xl font-bold">
        Cek Status Pengajuan {type === "surat" ? "Surat" : "Bantuan"}
      </h1>
      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
        <input
          value={id}
          onChange={(event) => setId(event.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3"
          placeholder={`Masukkan ID pengajuan ${type}`}
        />
        <button
          onClick={() =>
            startTransition(async () => {
              setError("");
              setResult(null);

              try {
                const data =
                  type === "surat"
                    ? await getPengajuanSuratStatus(id)
                    : await getPengajuanBantuanStatus(id);
                setResult(data as unknown as Record<string, unknown>);
              } catch {
                setError("Data pengajuan tidak ditemukan atau API belum aktif.");
              }
            })
          }
          className="rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white"
        >
          {isPending ? "Memeriksa..." : "Cek Status"}
        </button>
      </div>
      {error ? <p className="mt-4 text-sm text-rose-700">{error}</p> : null}
      {result ? (
        <div className="mt-6 rounded-2xl border border-sky-100 bg-white p-5 text-sm">
          <div className="flex items-center justify-between gap-4">
            <p className="font-semibold text-slate-900">
              {String(result.nama_pemohon ?? "-")}
            </p>
            <StatusBadge
              status={String(
                result.status ?? result.status_pengajuan ?? "diajukan",
              )}
            />
          </div>
          <p className="mt-3 text-slate-600">
            {type === "surat"
              ? `Jenis surat: ${String(result.jenis_surat ?? "-")}`
              : `Jenis bantuan: ${String(result.jenis_bantuan ?? "-")}`}
          </p>
          <p className="mt-2 text-slate-600">
            Lindongan: {String(result.lindongan ?? "-")}
          </p>
          <p className="mt-2 text-slate-600">
            Catatan admin: {String(result.catatan_admin ?? "-")}
          </p>
        </div>
      ) : null}
    </div>
  );
}
