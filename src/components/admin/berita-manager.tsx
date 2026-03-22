"use client";

import { useEffect, useState, useTransition } from "react";
import { DataTable } from "@/components/shared/data-table";
import {
  createAdminBerita,
  deleteAdminBerita,
  getAdminBerita,
  updateAdminBerita,
} from "@/lib/api";
import type { Berita } from "@/types/portal";

type BeritaForm = {
  judul: string;
  kategori: string;
  ringkasan: string;
  isi: string;
  status_publish: "draft" | "publish";
};

const emptyForm: BeritaForm = {
  judul: "",
  kategori: "",
  ringkasan: "",
  isi: "",
  status_publish: "draft" as const,
};

export function BeritaManager() {
  const [rows, setRows] = useState<Berita[]>([]);
  const [editing, setEditing] = useState<Berita | null>(null);
  const [form, setForm] = useState<BeritaForm>(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function refreshData() {
    const response = await getAdminBerita({ per_page: 20 });
    setRows(response.data);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      void refreshData().catch(() => {
        setError("Data berita gagal dimuat. Pastikan login admin masih aktif.");
      });
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  function resetForm() {
    setEditing(null);
    setForm(emptyForm);
    setFile(null);
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
              const payload = new FormData();
              payload.append("judul", form.judul);
              payload.append("kategori", form.kategori);
              payload.append("ringkasan", form.ringkasan);
              payload.append("isi", form.isi);
              payload.append("status_publish", form.status_publish);
              if (file) payload.append("gambar", file);

              if (editing) {
                await updateAdminBerita(editing.id, payload);
                setMessage("Berita berhasil diperbarui.");
              } else {
                await createAdminBerita(payload);
                setMessage("Berita berhasil ditambahkan.");
              }

              resetForm();
              await refreshData();
            } catch {
              setError("Penyimpanan berita gagal.");
            }
          });
        }}
      >
        <input value={form.judul} onChange={(e) => setForm((prev) => ({ ...prev, judul: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Judul berita" />
        <input value={form.kategori} onChange={(e) => setForm((prev) => ({ ...prev, kategori: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Kategori" />
        <select value={form.status_publish} onChange={(e) => setForm((prev) => ({ ...prev, status_publish: e.target.value as "draft" | "publish" }))} className="rounded-xl border border-slate-200 px-4 py-3">
          <option value="draft">draft</option>
          <option value="publish">publish</option>
        </select>
        <textarea value={form.ringkasan} onChange={(e) => setForm((prev) => ({ ...prev, ringkasan: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Ringkasan" rows={3} />
        <textarea value={form.isi} onChange={(e) => setForm((prev) => ({ ...prev, isi: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Isi berita" rows={6} />
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" />
        {message ? <p className="text-sm text-emerald-700 md:col-span-2">{message}</p> : null}
        {error ? <p className="text-sm text-rose-700 md:col-span-2">{error}</p> : null}
        <div className="flex gap-3 md:col-span-2">
          <button className="rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white">{isPending ? "Menyimpan..." : editing ? "Perbarui Berita" : "Tambah Berita"}</button>
          {editing ? <button type="button" onClick={resetForm} className="rounded-xl border border-slate-200 px-5 py-3 font-semibold">Batal</button> : null}
        </div>
      </form>

      <DataTable
        rows={rows}
        columns={[
          { key: "judul", label: "Judul" },
          { key: "kategori", label: "Kategori" },
          { key: "status_publish", label: "Status" },
          {
            key: "actions",
            label: "Aksi",
            render: (row) => (
              <div className="flex gap-2">
                <button onClick={() => { setEditing(row); setForm({ judul: row.judul, kategori: row.kategori, ringkasan: row.ringkasan, isi: row.isi, status_publish: row.status_publish }); }} className="rounded-lg bg-slate-100 px-3 py-1 font-semibold">Edit</button>
                <button
                  type="button"
                  onClick={() =>
                    startTransition(async () => {
                      setMessage("");
                      setError("");

                      if (!window.confirm(`Hapus berita "${row.judul}"?`)) {
                        return;
                      }

                      try {
                        await deleteAdminBerita(row.id);
                        setMessage("Berita berhasil dihapus.");

                        if (editing?.id === row.id) {
                          resetForm();
                        }

                        await refreshData();
                      } catch (caughtError) {
                        const message =
                          caughtError instanceof Error
                            ? caughtError.message
                            : "Penghapusan berita gagal.";
                        setError(message);
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
