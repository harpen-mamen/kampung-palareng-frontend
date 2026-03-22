"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { DataTable } from "@/components/shared/data-table";
import {
  createAdminRumah,
  deleteAdminRumah,
  getAdminKeluarga,
  getAdminRumah,
  updateAdminRumah,
} from "@/lib/api";
import type { Keluarga, Rumah } from "@/types/portal";

const emptyForm = {
  keluarga_id: "",
  alamat_singkat: "",
  lindongan: "Lindongan 1",
  latitude: "",
  longitude: "",
  kategori_rumah: "",
  jumlah_penghuni: "1",
  catatan_petugas: "",
};

export function RumahManager() {
  const [rows, setRows] = useState<Rumah[]>([]);
  const [keluargaOptions, setKeluargaOptions] = useState<Keluarga[]>([]);
  const [search, setSearch] = useState("");
  const [lindongan, setLindongan] = useState("");
  const [editing, setEditing] = useState<Rumah | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const selectedKeluarga = useMemo(
    () => keluargaOptions.find((item) => String(item.id) === form.keluarga_id) ?? null,
    [form.keluarga_id, keluargaOptions],
  );

  const selectedRumah = useMemo(
    () => rows.find((item) => String(item.keluarga_id) === form.keluarga_id) ?? null,
    [form.keluarga_id, rows],
  );

  async function refreshData(searchValue = search, lindonganValue = lindongan) {
    const [rumah, keluarga] = await Promise.all([
      getAdminRumah({ search: searchValue, lindongan: lindonganValue, per_page: 20 }),
      getAdminKeluarga({ per_page: 100 }),
    ]);
    setRows(rumah.data);
    setKeluargaOptions(keluarga.data);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      void (async () => {
        const [rumah, keluarga] = await Promise.all([
          getAdminRumah({ search, lindongan, per_page: 20 }),
          getAdminKeluarga({ per_page: 100 }),
        ]);
        setRows(rumah.data);
        setKeluargaOptions(keluarga.data);
      })();
    }, 250);

    return () => clearTimeout(timeout);
  }, [search, lindongan]);

  function resetForm() {
    setEditing(null);
    setForm(emptyForm);
    setFile(null);
  }

  function handleKeluargaChange(keluargaId: string) {
    const keluarga = keluargaOptions.find((item) => String(item.id) === keluargaId) ?? null;
    const rumahTersimpan =
      rows.find((item) => String(item.keluarga_id) === keluargaId) ?? null;

    setForm((prev) => ({
      ...prev,
      keluarga_id: keluargaId,
      alamat_singkat: rumahTersimpan?.alamat_singkat ?? keluarga?.alamat ?? prev.alamat_singkat,
      lindongan: rumahTersimpan?.lindongan ?? keluarga?.lindongan ?? prev.lindongan,
      latitude:
        rumahTersimpan?.latitude !== undefined && rumahTersimpan?.latitude !== null
          ? String(rumahTersimpan.latitude)
          : prev.latitude,
      longitude:
        rumahTersimpan?.longitude !== undefined && rumahTersimpan?.longitude !== null
          ? String(rumahTersimpan.longitude)
          : prev.longitude,
      kategori_rumah:
        rumahTersimpan?.kategori_rumah ??
        keluarga?.kategori_rumah ??
        prev.kategori_rumah,
      jumlah_penghuni: rumahTersimpan?.jumlah_penghuni
        ? String(rumahTersimpan.jumlah_penghuni)
        : keluarga?.jumlah_anggota
          ? String(keluarga.jumlah_anggota)
          : prev.jumlah_penghuni,
      catatan_petugas:
        rumahTersimpan?.catatan_petugas ?? prev.catatan_petugas,
    }));
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-[1.5rem] border border-sky-100 bg-white p-4 md:grid-cols-3">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari nama keluarga atau kode..."
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
          {rows.length} rumah
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
              const payload = new FormData();
              payload.append("keluarga_id", form.keluarga_id);
              payload.append("alamat_singkat", form.alamat_singkat);
              payload.append("lindongan", form.lindongan);
              payload.append("latitude", form.latitude);
              payload.append("longitude", form.longitude);
              payload.append("kategori_rumah", form.kategori_rumah);
              payload.append("jumlah_penghuni", form.jumlah_penghuni);
              payload.append("catatan_petugas", form.catatan_petugas);

              if (file) {
                payload.append("foto_rumah", file);
              }

              if (editing) {
                await updateAdminRumah(editing.id, payload);
                setMessage("Data rumah berhasil diperbarui.");
              } else {
                await createAdminRumah(payload);
                setMessage("Data rumah berhasil ditambahkan.");
              }

              resetForm();
              await refreshData();
            } catch {
              setError("Penyimpanan rumah gagal.");
            }
          });
        }}
      >
        <select value={form.keluarga_id} onChange={(e) => handleKeluargaChange(e.target.value)} className="rounded-xl border border-slate-200 px-4 py-3">
          <option value="">Pilih keluarga</option>
          {keluargaOptions.map((item) => (
            <option key={item.id} value={item.id}>
              {item.kode_keluarga} - {item.nama_kepala_keluarga}
            </option>
          ))}
        </select>
        <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-slate-700">
          {selectedKeluarga ? (
            <>
              <p className="font-semibold text-slate-900">
                {selectedKeluarga.kode_keluarga} - {selectedKeluarga.nama_kepala_keluarga}
              </p>
              <p className="mt-1">Lindongan: {selectedKeluarga.lindongan}</p>
              <p className="mt-1">Alamat keluarga: {selectedKeluarga.alamat}</p>
              <p className="mt-1">
                {selectedRumah
                  ? "Koordinat terisi dari data rumah yang sudah ada untuk keluarga ini."
                  : "Field rumah terisi dari data keluarga. Koordinat tetap diisi manual jika belum ada data rumah sebelumnya."}
              </p>
            </>
          ) : (
            <p>Pilih keluarga terlebih dahulu agar form rumah terisi otomatis.</p>
          )}
        </div>
        <input value={form.alamat_singkat} onChange={(e) => setForm((prev) => ({ ...prev, alamat_singkat: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Alamat singkat" />
        <select value={form.lindongan} onChange={(e) => setForm((prev) => ({ ...prev, lindongan: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3">
          <option>Lindongan 1</option><option>Lindongan 2</option><option>Lindongan 3</option><option>Lindongan 4</option>
        </select>
        <input value={form.kategori_rumah} onChange={(e) => setForm((prev) => ({ ...prev, kategori_rumah: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Kategori rumah" />
        <input value={form.latitude} onChange={(e) => setForm((prev) => ({ ...prev, latitude: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Latitude" />
        <input value={form.longitude} onChange={(e) => setForm((prev) => ({ ...prev, longitude: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Longitude" />
        <input value={form.jumlah_penghuni} onChange={(e) => setForm((prev) => ({ ...prev, jumlah_penghuni: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Jumlah penghuni" />
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="rounded-xl border border-slate-200 px-4 py-3" />
        <textarea value={form.catatan_petugas} onChange={(e) => setForm((prev) => ({ ...prev, catatan_petugas: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Catatan petugas" rows={3} />
        {message ? <p className="text-sm text-emerald-700 md:col-span-2">{message}</p> : null}
        {error ? <p className="text-sm text-rose-700 md:col-span-2">{error}</p> : null}
        <div className="flex gap-3 md:col-span-2">
          <button className="rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white">
            {isPending ? "Menyimpan..." : editing ? "Perbarui Rumah" : "Tambah Rumah"}
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
          { key: "keluarga", label: "Nama Keluarga", render: (row) => row.keluarga?.nama_kepala_keluarga ?? "-" },
          { key: "lindongan", label: "Lindongan" },
          { key: "jumlah_penghuni", label: "Penghuni" },
          { key: "latitude", label: "Latitude" },
          { key: "longitude", label: "Longitude" },
          {
            key: "actions",
            label: "Aksi",
            render: (row) => (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditing(row);
                    setForm({
                      keluarga_id: String(row.keluarga_id),
                      alamat_singkat: row.alamat_singkat,
                      lindongan: row.lindongan,
                      latitude: String(row.latitude),
                      longitude: String(row.longitude),
                      kategori_rumah: row.kategori_rumah,
                      jumlah_penghuni: String(row.jumlah_penghuni),
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
                        await deleteAdminRumah(row.id);
                        await refreshData();
                      } catch {
                        setError("Penghapusan rumah gagal.");
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
