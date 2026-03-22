"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { DataTable } from "@/components/shared/data-table";
import {
  createAdminPengguna,
  deleteAdminPengguna,
  getAdminKeluarga,
  getAdminPengguna,
  updateAdminPengguna,
} from "@/lib/api";
import type { AuthUser, Keluarga } from "@/types/portal";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  nik: "",
  phone: "",
  whatsapp: "",
  alamat: "",
  lindongan: "Lindongan 1",
  keluarga_id: "",
  approval_status: "disetujui",
};

export function PendudukManager() {
  const [rows, setRows] = useState<AuthUser[]>([]);
  const [keluargaOptions, setKeluargaOptions] = useState<Keluarga[]>([]);
  const [editing, setEditing] = useState<AuthUser | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [lindongan, setLindongan] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const refreshData = useCallback(async (nextSearch = search, nextLindongan = lindongan) => {
    const [users, keluarga] = await Promise.all([
      getAdminPengguna({ role: "warga", search: nextSearch, lindongan: nextLindongan, per_page: 100 }),
      getAdminKeluarga({ per_page: 200 }),
    ]);

    setRows(users.data);
    setKeluargaOptions(keluarga.data);
  }, [search, lindongan]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void refreshData("", "");
    }, 0);

    return () => clearTimeout(timeout);
  }, [refreshData]);

  function resetForm() {
    setEditing(null);
    setForm(emptyForm);
  }

  return (
    <div className="space-y-6">
      <div className="card-panel rounded-[1.75rem] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">Data Penduduk</p>
        <h3 className="mt-3 text-xl font-bold text-slate-950">Registrasi warga dan input manual penduduk</h3>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Data penduduk diambil dari registrasi masyarakat portal dan juga bisa ditambahkan manual oleh admin, lalu dikaitkan ke keluarga dan lindongan yang sesuai.
        </p>

        <form
          className="mt-6 grid gap-4 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            startTransition(async () => {
              try {
                const payload = {
                  ...form,
                  role: "warga",
                  keluarga_id: form.keluarga_id ? Number(form.keluarga_id) : null,
                  password: form.password || "warga123",
                };

                if (editing) {
                  await updateAdminPengguna(editing.id, payload);
                  setMessage("Data penduduk berhasil diperbarui.");
                } else {
                  await createAdminPengguna(payload);
                  setMessage("Data penduduk berhasil ditambahkan.");
                }

                setError("");
                resetForm();
                await refreshData();
              } catch (submissionError) {
                setError(submissionError instanceof Error ? submissionError.message : "Penyimpanan data penduduk gagal.");
              }
            });
          }}
        >
          <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Nama lengkap" />
          <input value={form.nik} onChange={(e) => setForm((prev) => ({ ...prev, nik: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="NIK" />
          <input value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Email" />
          <input value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder={editing ? "Password baru (opsional)" : "Password awal"} />
          <input value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Nomor HP" />
          <input required value={form.whatsapp} onChange={(e) => setForm((prev) => ({ ...prev, whatsapp: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Nomor WhatsApp wajib diisi" />
          <select value={form.lindongan} onChange={(e) => setForm((prev) => ({ ...prev, lindongan: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3">
            <option value="Lindongan 1">Lindongan 1</option>
            <option value="Lindongan 2">Lindongan 2</option>
            <option value="Lindongan 3">Lindongan 3</option>
          </select>
          <select value={form.keluarga_id} onChange={(e) => setForm((prev) => ({ ...prev, keluarga_id: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3">
            <option value="">Pilih keluarga terkait</option>
            {keluargaOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.kode_keluarga} - {item.nama_kepala_keluarga}
              </option>
            ))}
          </select>
          <textarea value={form.alamat} onChange={(e) => setForm((prev) => ({ ...prev, alamat: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Alamat penduduk" rows={3} />
          <p className="text-xs leading-6 text-slate-500 md:col-span-2">
            Nomor WhatsApp wajib diisi karena dipakai untuk notifikasi layanan surat dan bantuan.
          </p>
          {message ? <p className="text-sm text-emerald-700 md:col-span-2">{message}</p> : null}
          {error ? <p className="text-sm text-rose-700 md:col-span-2">{error}</p> : null}
          <div className="flex gap-3 md:col-span-2">
            <button className="rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white">{isPending ? "Menyimpan..." : editing ? "Perbarui Penduduk" : "Tambah Penduduk"}</button>
            {editing ? <button type="button" onClick={resetForm} className="rounded-xl border border-slate-200 px-5 py-3 font-semibold">Batal</button> : null}
          </div>
        </form>
      </div>

      <div className="card-panel rounded-[1.75rem] p-6">
        <div className="grid gap-4 md:grid-cols-[1.3fr_0.8fr_auto]">
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Cari nama, NIK, atau email..." />
          <select value={lindongan} onChange={(e) => setLindongan(e.target.value)} className="rounded-xl border border-slate-200 px-4 py-3">
            <option value="">Semua Lindongan</option>
            <option value="Lindongan 1">Lindongan 1</option>
            <option value="Lindongan 2">Lindongan 2</option>
            <option value="Lindongan 3">Lindongan 3</option>
          </select>
          <button
            onClick={() =>
              startTransition(async () => {
                await refreshData(search, lindongan);
              })
            }
            className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white"
          >
            Filter
          </button>
        </div>

        <div className="mt-5">
          <DataTable
            rows={rows}
            columns={[
              { key: "name", label: "Nama" },
              { key: "nik", label: "NIK" },
              { key: "lindongan", label: "Lindongan" },
              {
                key: "keluarga",
                label: "Keluarga",
                render: (row) => row.keluarga?.nama_kepala_keluarga ?? "-",
              },
              {
                key: "approval_status",
                label: "Status",
                render: (row) => row.approval_status ?? "-",
              },
              {
                key: "actions",
                label: "Aksi",
                render: (row) => (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(row);
                        setForm({
                          name: row.name,
                          email: row.email,
                          password: "",
                          nik: row.nik ?? "",
                          phone: row.phone ?? "",
                          whatsapp: row.whatsapp ?? "",
                          alamat: row.alamat ?? "",
                          lindongan: row.lindongan ?? "Lindongan 1",
                          keluarga_id: row.keluarga_id ? String(row.keluarga_id) : "",
                          approval_status: row.approval_status ?? "disetujui",
                        });
                      }}
                      className="rounded-lg bg-slate-100 px-3 py-1 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        startTransition(async () => {
                          await deleteAdminPengguna(row.id);
                          await refreshData();
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
      </div>
    </div>
  );
}
