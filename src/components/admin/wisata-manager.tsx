"use client";

import { useEffect, useState, useTransition } from "react";
import { DataTable } from "@/components/shared/data-table";
import {
  createAdminWisata,
  deleteAdminWisata,
  getAdminWisata,
  updateAdminWisata,
} from "@/lib/api";
import type { WisataItem } from "@/types/portal";

type WisataForm = {
  nama: string;
  lokasi: string;
  deskripsi: string;
  status_publish: "draft" | "publish";
};

const emptyForm: WisataForm = {
  nama: "",
  lokasi: "",
  deskripsi: "",
  status_publish: "draft",
};

export function WisataManager() {
  const [rows, setRows] = useState<WisataItem[]>([]);
  const [editing, setEditing] = useState<WisataItem | null>(null);
  const [form, setForm] = useState<WisataForm>(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function refreshData() {
    const response = await getAdminWisata({ per_page: 20 });
    setRows(response.data);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      void refreshData().catch(() => {
        setError("Data wisata gagal dimuat. Pastikan login admin masih aktif.");
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
              payload.append("nama", form.nama);
              payload.append("lokasi", form.lokasi);
              payload.append("deskripsi", form.deskripsi);
              payload.append("status_publish", form.status_publish);
              if (file) payload.append("image", file);

              if (editing) {
                await updateAdminWisata(editing.id, payload);
                setMessage("Wisata berhasil diperbarui.");
              } else {
                await createAdminWisata(payload);
                setMessage("Wisata berhasil ditambahkan.");
              }

              resetForm();
              await refreshData();
            } catch {
              setError("Penyimpanan wisata gagal.");
            }
          });
        }}
      >
        <input
          value={form.nama}
          onChange={(e) => setForm((prev) => ({ ...prev, nama: e.target.value }))}
          className="rounded-xl border border-slate-200 px-4 py-3"
          placeholder="Nama wisata"
        />
        <input
          value={form.lokasi}
          onChange={(e) => setForm((prev) => ({ ...prev, lokasi: e.target.value }))}
          className="rounded-xl border border-slate-200 px-4 py-3"
          placeholder="Lokasi"
        />
        <select
          value={form.status_publish}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, status_publish: e.target.value as "draft" | "publish" }))
          }
          className="rounded-xl border border-slate-200 px-4 py-3"
        >
          <option value="draft">draft</option>
          <option value="publish">publish</option>
        </select>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="rounded-xl border border-slate-200 px-4 py-3"
        />
        <textarea
          value={form.deskripsi}
          onChange={(e) => setForm((prev) => ({ ...prev, deskripsi: e.target.value }))}
          className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2"
          placeholder="Deskripsi wisata"
          rows={5}
        />
        {message ? <p className="text-sm text-emerald-700 md:col-span-2">{message}</p> : null}
        {error ? <p className="text-sm text-rose-700 md:col-span-2">{error}</p> : null}
        <div className="flex gap-3 md:col-span-2">
          <button className="rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white">
            {isPending ? "Menyimpan..." : editing ? "Perbarui Wisata" : "Tambah Wisata"}
          </button>
          {editing ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-slate-200 px-5 py-3 font-semibold"
            >
              Batal
            </button>
          ) : null}
        </div>
      </form>

      <DataTable
        rows={rows}
        columns={[
          { key: "nama", label: "Nama" },
          { key: "lokasi", label: "Lokasi" },
          { key: "status_publish", label: "Status" },
          {
            key: "actions",
            label: "Aksi",
            render: (row) => (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(row);
                    setForm({
                      nama: row.nama,
                      lokasi: row.lokasi,
                      deskripsi: row.deskripsi,
                      status_publish: row.status_publish ?? "draft",
                    });
                  }}
                  className="rounded-lg bg-slate-100 px-3 py-1 font-semibold"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() =>
                    startTransition(async () => {
                      setMessage("");
                      setError("");

                      if (!window.confirm(`Hapus wisata "${row.nama}"?`)) {
                        return;
                      }

                      try {
                        await deleteAdminWisata(row.id);
                        setMessage("Wisata berhasil dihapus.");

                        if (editing?.id === row.id) {
                          resetForm();
                        }

                        await refreshData();
                      } catch {
                        setError("Penghapusan wisata gagal.");
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
