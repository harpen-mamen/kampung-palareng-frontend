"use client";

import { useState, useTransition } from "react";
import { BarChart3, FileSpreadsheet, FileText, House, Inbox, Users2 } from "lucide-react";
import { downloadAdminReport } from "@/lib/api";

const reportOptions = [
  {
    dataset: "keluarga",
    title: "Data Keluarga",
    description: "Rekap keluarga kampung lengkap dengan lindongan, status ekonomi, dan kepala keluarga.",
    icon: Users2,
    tone: "sky",
  },
  {
    dataset: "rumah",
    title: "Data Rumah",
    description: "Daftar rumah, titik lokasi, jumlah penghuni, dan kategori rumah warga.",
    icon: House,
    tone: "emerald",
  },
  {
    dataset: "bantuan",
    title: "Program Bantuan",
    description: "Daftar bantuan aktif, sumber, kategori, periode, dan kuota program.",
    icon: Inbox,
    tone: "amber",
  },
  {
    dataset: "surat",
    title: "Pengajuan Surat",
    description: "Rekap layanan surat masyarakat berikut status verifikasi dan nomor surat.",
    icon: FileText,
    tone: "violet",
  },
  {
    dataset: "pengajuan_bantuan",
    title: "Pengajuan Bantuan",
    description: "Rekap pemohon bantuan, jenis bantuan, lindongan, dan status pengajuan.",
    icon: BarChart3,
    tone: "rose",
  },
] as const;

type DatasetKey = (typeof reportOptions)[number]["dataset"];
type FormatKey = "excel" | "pdf";

const toneClasses = {
  sky: "border-sky-100 bg-[linear-gradient(180deg,_#ffffff,_#f2f8ff)] text-sky-700",
  emerald: "border-emerald-100 bg-[linear-gradient(180deg,_#ffffff,_#f2fdf7)] text-emerald-700",
  amber: "border-amber-100 bg-[linear-gradient(180deg,_#ffffff,_#fff8eb)] text-amber-700",
  violet: "border-violet-100 bg-[linear-gradient(180deg,_#ffffff,_#f6f2ff)] text-violet-700",
  rose: "border-rose-100 bg-[linear-gradient(180deg,_#ffffff,_#fff1f2)] text-rose-700",
} as const;

export function ReportManager() {
  const [lindongan, setLindongan] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleDownload(dataset: DatasetKey, format: FormatKey) {
    startTransition(async () => {
      try {
        setMessage("");
        setError("");
        await downloadAdminReport({
          dataset,
          format,
          lindongan: lindongan || undefined,
        });
        setMessage(`Laporan ${dataset.replaceAll("_", " ")} berhasil diunduh.`);
      } catch (downloadError) {
        setError(
          downloadError instanceof Error
            ? downloadError.message
            : "Laporan gagal diunduh.",
        );
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="card-panel rounded-[1.75rem] p-6">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">Export Laporan</p>
            <h3 className="mt-3 text-2xl font-bold text-slate-950">Unduh laporan administrasi kampung</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Pilih dataset yang ingin diunduh, lalu tentukan format PDF atau Excel. Filter lindongan dipakai untuk laporan yang berbasis wilayah warga.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
            <label className="text-sm font-semibold text-slate-900">Filter lindongan</label>
            <select
              value={lindongan}
              onChange={(event) => setLindongan(event.target.value)}
              className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
            >
              <option value="">Semua Lindongan</option>
              <option value="Lindongan 1">Lindongan 1</option>
              <option value="Lindongan 2">Lindongan 2</option>
              <option value="Lindongan 3">Lindongan 3</option>
            </select>
          </div>
        </div>

        {message ? <p className="mt-4 text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="mt-4 text-sm text-rose-700">{error}</p> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reportOptions.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.dataset} className="card-panel rounded-[1.5rem] p-6">
              <div className={`inline-flex rounded-[1rem] border p-3 ${toneClasses[item.tone]}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Dataset Laporan</p>
              <h3 className="mt-2 text-xl font-bold text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => handleDownload(item.dataset, "excel")}
                  disabled={isPending}
                  className="inline-flex items-center rounded-xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Excel
                </button>
                <button
                  onClick={() => handleDownload(item.dataset, "pdf")}
                  disabled={isPending}
                  className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-60"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  PDF
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
