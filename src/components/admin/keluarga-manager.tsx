"use client";

import { useEffect, useState, useTransition } from "react";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  createAdminKeluarga,
  deleteAdminKeluarga,
  getAdminKeluarga,
  updateAdminKeluarga,
} from "@/lib/api";
import type { Keluarga } from "@/types/portal";

const emptyForm: Omit<Keluarga, "id"> = {
  kode_keluarga: "",
  nama_kepala_keluarga: "",
  alamat: "",
  lindongan: "Lindongan 1",
  jumlah_anggota: 1,
  status_ekonomi: "",
  pekerjaan_utama: "",
  kategori_rumah: "",
  status_dtks: false,
  catatan_petugas: "",
};

export function KeluargaManager() {
  const [rows, setRows] = useState<Keluarga[]>([]);
  const [search, setSearch] = useState("");
  const [lindongan, setLindongan] = useState("");
  const [editing, setEditing] = useState<Keluarga | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function refreshData(searchValue = search, lindonganValue = lindongan) {
    const response = await getAdminKeluarga({
      search: searchValue,
      lindongan: lindonganValue,
      per_page: 20,
    });
    setRows(response.data);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      void (async () => {
        const response = await getAdminKeluarga({
          search,
          lindongan,
          per_page: 20,
        });
        setRows(response.data);
      })();
    }, 250);

    return () => clearTimeout(timeout);
  }, [search, lindongan]);

  function resetForm() {
    setEditing(null);
    setForm(emptyForm);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-[1.5rem] border border-sky-100 bg-white p-4 md:grid-cols-3">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari kode keluarga atau nama..."
          className="rounded-xl border border-slate-200 px-4 py-3"
        />
        <select
          value={lindongan}
          onChange={(event) => setLindongan(event.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3"
        >
          <option value="">Semua Lindongan</option>
          <option>Lindongan 1</option>
          <option>Lindongan 2</option>
          <option>Lindongan 3</option>
          <option>Lindongan 4</option>
        </select>
        <div className="flex items-center rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {rows.length} keluarga
        </div>
      </div>

      <form
        className="card-panel grid gap-4 rounded-[1.75rem] p-6 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          startTransition(async () => {
            setMessage("");
            setError("");

            try {
              if (editing) {
                await updateAdminKeluarga(editing.id, form);
                setMessage("Data keluarga berhasil diperbarui.");
              } else {
                await createAdminKeluarga(form);
                setMessage("Data keluarga berhasil ditambahkan.");
              }

              resetForm();
              await refreshData();
            } catch {
              setError("Penyimpanan gagal. Pastikan login admin aktif dan backend berjalan.");
            }
          });
        }}
      >
        <input value={form.kode_keluarga} onChange={(e) => setForm((prev) => ({ ...prev, kode_keluarga: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Kode keluarga" />
        <input value={form.nama_kepala_keluarga} onChange={(e) => setForm((prev) => ({ ...prev, nama_kepala_keluarga: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Nama kepala keluarga" />
        <textarea value={form.alamat} onChange={(e) => setForm((prev) => ({ ...prev, alamat: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Alamat" rows={3} />
        <select value={form.lindongan} onChange={(e) => setForm((prev) => ({ ...prev, lindongan: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3">
          <option>Lindongan 1</option><option>Lindongan 2</option><option>Lindongan 3</option><option>Lindongan 4</option>
        </select>
        <input type="number" value={form.jumlah_anggota} onChange={(e) => setForm((prev) => ({ ...prev, jumlah_anggota: Number(e.target.value) }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Jumlah anggota" />
        <input value={form.status_ekonomi} onChange={(e) => setForm((prev) => ({ ...prev, status_ekonomi: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Status ekonomi" />
        <input value={form.pekerjaan_utama} onChange={(e) => setForm((prev) => ({ ...prev, pekerjaan_utama: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Pekerjaan utama" />
        <input value={form.kategori_rumah} onChange={(e) => setForm((prev) => ({ ...prev, kategori_rumah: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Kategori rumah" />
        <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm">
          <input type="checkbox" checked={form.status_dtks} onChange={(e) => setForm((prev) => ({ ...prev, status_dtks: e.target.checked }))} />
          Status DTKS
        </label>
        <textarea value={form.catatan_petugas ?? ""} onChange={(e) => setForm((prev) => ({ ...prev, catatan_petugas: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Catatan petugas" rows={3} />
        {message ? <p className="text-sm text-emerald-700 md:col-span-2">{message}</p> : null}
        {error ? <p className="text-sm text-rose-700 md:col-span-2">{error}</p> : null}
        <div className="flex gap-3 md:col-span-2">
          <button className="rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white">
            {isPending ? "Menyimpan..." : editing ? "Perbarui Keluarga" : "Tambah Keluarga"}
          </button>
          {editing ? (
            <button type="button" onClick={resetForm} className="rounded-xl border border-slate-200 px-5 py-3 font-semibold">
              Batal Edit
            </button>
          ) : null}
        </div>
      </form>

      <DataTable
        rows={rows}
        columns={[
          { key: "kode_keluarga", label: "Kode Keluarga" },
          { key: "nama_kepala_keluarga", label: "Kepala Keluarga" },
          { key: "lindongan", label: "Lindongan" },
          { key: "jumlah_anggota", label: "Jumlah Anggota" },
          { key: "status_ekonomi", label: "Status Ekonomi" },
          { key: "status_dtks", label: "DTKS", render: (row) => <StatusBadge status={row.status_dtks ? "dtks" : "non_dtks"} /> },
          {
            key: "actions",
            label: "Aksi",
            render: (row) => (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditing(row);
                    setForm({
                      kode_keluarga: row.kode_keluarga,
                      nama_kepala_keluarga: row.nama_kepala_keluarga,
                      alamat: row.alamat,
                      lindongan: row.lindongan,
                      jumlah_anggota: row.jumlah_anggota,
                      status_ekonomi: row.status_ekonomi,
                      pekerjaan_utama: row.pekerjaan_utama,
                      kategori_rumah: row.kategori_rumah,
                      status_dtks: row.status_dtks,
                      catatan_petugas: row.catatan_petugas ?? "",
                    });
                  }}
                  className="rounded-lg bg-slate-100 px-3 py-1 font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    startTransition(async () => {
                      try {
                        await deleteAdminKeluarga(row.id);
                        await refreshData();
                      } catch {
                        setError("Penghapusan gagal.");
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
