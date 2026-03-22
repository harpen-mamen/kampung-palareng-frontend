"use client";

import { useEffect, useState, useTransition } from "react";
import { DataTable } from "@/components/shared/data-table";
import {
  createAdminBantuan,
  deleteAdminBantuan,
  getAdminBantuan,
  updateAdminBantuan,
} from "@/lib/api";
import type { Bantuan } from "@/types/portal";

const OTHER_OPTION = "__lainnya__";

const bantuanNameOptions = [
  "BLT Dana Desa",
  "PKH",
  "BPNT",
  "Bantuan Pangan Non Tunai",
  "Bantuan Beras",
  "Bantuan Lansia",
  "Bantuan Disabilitas",
  "Bantuan Pendidikan",
  "Bantuan Nelayan",
  "Bantuan Perbaikan Rumah",
  "Bantuan UMKM",
];

const kategoriOptions = [
  "Bantuan Tunai",
  "Bantuan Pangan",
  "Bantuan Pendidikan",
  "Bantuan Kesehatan",
  "Bantuan Perumahan",
  "Bantuan Sosial",
  "Bantuan Nelayan",
  "Bantuan UMKM",
];

const sumberOptions = [
  "Dana Desa",
  "APBD Kabupaten",
  "APBD Provinsi",
  "APBN",
  "Kementerian Sosial",
  "Dinas Sosial",
  "Dinas Perikanan",
  "Kerja Sama / CSR",
];

const periodeOptions = [
  "Januari 2026",
  "Februari 2026",
  "Maret 2026",
  "April 2026",
  "Mei 2026",
  "Juni 2026",
  "Semester I 2026",
  "Semester II 2026",
  "Tahap I 2026",
  "Tahap II 2026",
  "Tahap III 2026",
  "Tahunan 2026",
];

const emptyForm: Omit<Bantuan, "id"> = {
  nama_bantuan: "",
  kategori: "",
  sumber: "",
  periode: "",
  status: "aktif",
  is_open_for_submission: false,
  kuota: null,
  total_pengajuan: 0,
  remaining_quota: null,
  deskripsi: "",
  created_at: "",
};

function resolveSelectValue(options: string[], value?: string | null) {
  if (!value) return "";
  return options.includes(value) ? value : OTHER_OPTION;
}

function DropdownField({
  label,
  value,
  options,
  placeholder,
  onSelectChange,
  onCustomChange,
}: {
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  onSelectChange: (next: string) => void;
  onCustomChange: (next: string) => void;
}) {
  const selectValue = resolveSelectValue(options, value);

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-900">{label}</label>
      <select
        value={selectValue}
        onChange={(event) => {
          const nextValue = event.target.value;
          if (nextValue === OTHER_OPTION) {
            onSelectChange("");
            return;
          }
          onSelectChange(nextValue);
        }}
        className="w-full rounded-xl border border-slate-200 px-4 py-3"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
        <option value={OTHER_OPTION}>Lainnya</option>
      </select>
      {selectValue === OTHER_OPTION ? (
        <input
          value={value}
          onChange={(event) => onCustomChange(event.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3"
          placeholder={`${label} lain`}
        />
      ) : null}
    </div>
  );
}

export function BantuanManager() {
  const [rows, setRows] = useState<Bantuan[]>([]);
  const [editing, setEditing] = useState<Bantuan | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function refreshData() {
    const response = await getAdminBantuan({ per_page: 50 });
    setRows(response.data);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      void refreshData();
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  function resetForm() {
    setEditing(null);
    setForm(emptyForm);
  }

  return (
    <div className="space-y-6">
      <form
        className="card-panel grid gap-4 rounded-[1.75rem] p-6 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          startTransition(async () => {
            setMessage("");
            setError("");

            try {
              const payload = {
                nama_bantuan: form.nama_bantuan,
                kategori: form.kategori,
                sumber: form.sumber,
                periode: form.periode,
                status: form.status,
                is_open_for_submission: form.is_open_for_submission,
                kuota: form.kuota ? Number(form.kuota) : null,
                deskripsi: form.deskripsi ?? "",
              };

              if (editing) {
                await updateAdminBantuan(editing.id, payload);
                setMessage("Data bantuan berhasil diperbarui.");
              } else {
                await createAdminBantuan(payload);
                setMessage("Data bantuan berhasil ditambahkan.");
              }

              resetForm();
              await refreshData();
            } catch (submissionError) {
              const messageText =
                submissionError instanceof Error ? submissionError.message : "Penyimpanan bantuan gagal.";
              setError(messageText);
            }
          });
        }}
      >
        <div className="md:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">
            Kontrol Bantuan Masyarakat
          </p>
          <h3 className="mt-2 text-2xl font-bold text-slate-950">
            Buka atau tutup jenis bantuan yang tampil di dashboard masyarakat
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Saat pengajuan dibuka dan kuota diatur, program ini otomatis tampil pada halaman bantuan masyarakat.
          </p>
        </div>

        <DropdownField
          label="Nama bantuan"
          value={form.nama_bantuan}
          options={bantuanNameOptions}
          placeholder="Pilih nama bantuan"
          onSelectChange={(next) => setForm((prev) => ({ ...prev, nama_bantuan: next }))}
          onCustomChange={(next) => setForm((prev) => ({ ...prev, nama_bantuan: next }))}
        />
        <DropdownField
          label="Kategori"
          value={form.kategori}
          options={kategoriOptions}
          placeholder="Pilih kategori bantuan"
          onSelectChange={(next) => setForm((prev) => ({ ...prev, kategori: next }))}
          onCustomChange={(next) => setForm((prev) => ({ ...prev, kategori: next }))}
        />
        <DropdownField
          label="Sumber bantuan"
          value={form.sumber}
          options={sumberOptions}
          placeholder="Pilih sumber bantuan"
          onSelectChange={(next) => setForm((prev) => ({ ...prev, sumber: next }))}
          onCustomChange={(next) => setForm((prev) => ({ ...prev, sumber: next }))}
        />
        <DropdownField
          label="Periode"
          value={form.periode}
          options={periodeOptions}
          placeholder="Pilih periode bantuan"
          onSelectChange={(next) => setForm((prev) => ({ ...prev, periode: next }))}
          onCustomChange={(next) => setForm((prev) => ({ ...prev, periode: next }))}
        />
        <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3">
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
        </select>
        <input
          type="number"
          min={1}
          value={form.kuota ?? ""}
          onChange={(e) => setForm((prev) => ({ ...prev, kuota: e.target.value ? Number(e.target.value) : null }))}
          className="rounded-xl border border-slate-200 px-4 py-3"
          placeholder="Kuota bantuan"
        />
        <label className="md:col-span-2 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={form.is_open_for_submission}
            onChange={(e) => setForm((prev) => ({ ...prev, is_open_for_submission: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300"
          />
          Buka pengajuan ini untuk dashboard masyarakat
        </label>
        <textarea value={form.deskripsi ?? ""} onChange={(e) => setForm((prev) => ({ ...prev, deskripsi: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Deskripsi bantuan" rows={4} />
        {message ? <p className="text-sm text-emerald-700 md:col-span-2">{message}</p> : null}
        {error ? <p className="text-sm text-rose-700 md:col-span-2">{error}</p> : null}
        <div className="flex gap-3 md:col-span-2">
          <button className="rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white">{isPending ? "Menyimpan..." : editing ? "Perbarui Bantuan" : "Tambah Bantuan"}</button>
          {editing ? <button type="button" onClick={resetForm} className="rounded-xl border border-slate-200 px-5 py-3 font-semibold">Batal</button> : null}
        </div>
      </form>

      <DataTable
        rows={rows}
        columns={[
          { key: "nama_bantuan", label: "Nama Bantuan" },
          { key: "kategori", label: "Kategori" },
          {
            key: "is_open_for_submission",
            label: "Tampil ke Warga",
            render: (row) => (
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${row.is_open_for_submission ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                {row.is_open_for_submission ? "Dibuka" : "Ditutup"}
              </span>
            ),
          },
          {
            key: "kuota",
            label: "Kuota",
            render: (row) => (
              <span className="text-sm font-semibold text-slate-900">
                {row.kuota ?? "Tidak dibatasi"}
              </span>
            ),
          },
          {
            key: "remaining_quota",
            label: "Sisa",
            render: (row) => (
              <span className="text-sm font-semibold text-slate-900">
                {row.remaining_quota ?? row.kuota ?? "Tidak dibatasi"}
              </span>
            ),
          },
          { key: "status", label: "Status" },
          {
            key: "actions",
            label: "Aksi",
            render: (row) => (
              <div className="flex gap-2">
                <button onClick={() => { setEditing(row); setForm({ ...emptyForm, ...row, created_at: row.created_at ?? "" }); }} className="rounded-lg bg-slate-100 px-3 py-1 font-semibold">Edit</button>
                <button
                  onClick={() =>
                    startTransition(async () => {
                      try {
                        await deleteAdminBantuan(row.id);
                        await refreshData();
                      } catch (deletionError) {
                        const messageText =
                          deletionError instanceof Error ? deletionError.message : "Penghapusan bantuan gagal.";
                        setError(messageText);
                      }
                    })
                  }
                  className="rounded-lg bg-rose-100 px-3 py-1 font-semibold text-rose-700"
                >
                  Hapus
                </button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
