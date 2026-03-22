"use client";

import { useEffect, useState, useTransition } from "react";
import { DataTable } from "@/components/shared/data-table";
import {
  createAdminPengumuman,
  deleteAdminPengumuman,
  getAdminPengumuman,
  updateAdminPengumuman,
} from "@/lib/api";
import type { Pengumuman } from "@/types/portal";

type PengumumanForm = {
  judul: string;
  isi: string;
  status_publish: "draft" | "publish";
};

const emptyForm: PengumumanForm = {
  judul: "",
  isi: "",
  status_publish: "draft" as const,
};

export function PengumumanManager() {
  const [rows, setRows] = useState<Pengumuman[]>([]);
  const [editing, setEditing] = useState<Pengumuman | null>(null);
  const [form, setForm] = useState<PengumumanForm>(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function refreshData() {
    const response = await getAdminPengumuman({ per_page: 20 });
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
        className="card-panel grid gap-4 rounded-[1.75rem] p-6"
        onSubmit={(event) => {
          event.preventDefault();
          startTransition(async () => {
            setMessage("");
            setError("");
            try {
              if (editing) {
                await updateAdminPengumuman(editing.id, form);
                setMessage("Pengumuman berhasil diperbarui.");
              } else {
                await createAdminPengumuman(form);
                setMessage("Pengumuman berhasil ditambahkan.");
              }
              resetForm();
              await refreshData();
            } catch {
              setError("Penyimpanan pengumuman gagal.");
            }
          });
        }}
      >
        <input value={form.judul} onChange={(e) => setForm((prev) => ({ ...prev, judul: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Judul pengumuman" />
        <select value={form.status_publish} onChange={(e) => setForm((prev) => ({ ...prev, status_publish: e.target.value as "draft" | "publish" }))} className="rounded-xl border border-slate-200 px-4 py-3">
          <option value="draft">draft</option>
          <option value="publish">publish</option>
        </select>
        <textarea value={form.isi} onChange={(e) => setForm((prev) => ({ ...prev, isi: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Isi pengumuman" rows={5} />
        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        <div className="flex gap-3">
          <button className="rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white">{isPending ? "Menyimpan..." : editing ? "Perbarui Pengumuman" : "Tambah Pengumuman"}</button>
          {editing ? <button type="button" onClick={resetForm} className="rounded-xl border border-slate-200 px-5 py-3 font-semibold">Batal</button> : null}
        </div>
      </form>

      <DataTable
        rows={rows}
        columns={[
          { key: "judul", label: "Judul" },
          { key: "status_publish", label: "Status" },
          { key: "created_at", label: "Tanggal" },
          {
            key: "actions",
            label: "Aksi",
            render: (row) => (
              <div className="flex gap-2">
                <button onClick={() => { setEditing(row); setForm({ judul: row.judul, isi: row.isi, status_publish: row.status_publish }); }} className="rounded-lg bg-slate-100 px-3 py-1 font-semibold">Edit</button>
                <button
                  onClick={() =>
                    startTransition(async () => {
                      try {
                        await deleteAdminPengumuman(row.id);
                        await refreshData();
                      } catch {
                        setError("Penghapusan pengumuman gagal.");
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
