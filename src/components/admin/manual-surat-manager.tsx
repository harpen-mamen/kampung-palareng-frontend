"use client";

import { useState, useTransition } from "react";
import { createAdminManualPengajuanSurat } from "@/lib/api";

const initialState = {
  nama_pemohon: "",
  jenis_surat: "",
  keperluan: "",
  alamat: "",
  lindongan: "Lindongan 1",
  whatsapp_pemohon: "",
  catatan_admin: "",
};

const suratOptions = [
  "Surat Keterangan Domisili",
  "Surat Keterangan Usaha",
  "Surat Keterangan Tidak Mampu",
  "Surat Pengantar SKCK",
  "Surat Keterangan Penghasilan Orang Tua",
  "Surat Keterangan Belum Menikah",
  "Surat Keterangan Kelahiran",
  "Surat Keterangan Kematian",
  "Surat Keterangan Ahli Waris",
  "Surat Keterangan Janda/Duda",
  "Surat Keterangan Beda Nama",
  "Surat Pengantar KTP",
  "Surat Pengantar Kartu Keluarga",
  "Surat Pengantar Nikah",
  "Surat Pengantar Pindah",
  "Surat Pengantar",
];

export function ManualSuratManager() {
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="card-panel rounded-[1.75rem] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">Surat Manual</p>
      <h3 className="mt-3 text-xl font-bold text-slate-950">Buat pengajuan surat manual dari kantor</h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">
        Gunakan form ini saat masyarakat datang langsung ke kantor dan belum bisa mengakses website sendiri.
      </p>

      <form
        className="mt-6 grid gap-4 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          startTransition(async () => {
            try {
              const result = await createAdminManualPengajuanSurat(form);
              setMessage(`Pengajuan surat manual berhasil dibuat. ID pengajuan: ${result.id}.`);
              setError("");
              setForm(initialState);
            } catch (submissionError) {
              setError(submissionError instanceof Error ? submissionError.message : "Pembuatan surat manual gagal.");
            }
          });
        }}
      >
        <input value={form.nama_pemohon} onChange={(e) => setForm((prev) => ({ ...prev, nama_pemohon: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Nama pemohon" />
        <select value={form.jenis_surat} onChange={(e) => setForm((prev) => ({ ...prev, jenis_surat: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3">
          <option value="">Pilih jenis surat</option>
          {suratOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <input value={form.keperluan} onChange={(e) => setForm((prev) => ({ ...prev, keperluan: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Keperluan surat" />
        <select value={form.lindongan} onChange={(e) => setForm((prev) => ({ ...prev, lindongan: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3">
          <option value="Lindongan 1">Lindongan 1</option>
          <option value="Lindongan 2">Lindongan 2</option>
          <option value="Lindongan 3">Lindongan 3</option>
        </select>
        <input required value={form.whatsapp_pemohon} onChange={(e) => setForm((prev) => ({ ...prev, whatsapp_pemohon: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Nomor WhatsApp pemohon wajib diisi" />
        <textarea value={form.alamat} onChange={(e) => setForm((prev) => ({ ...prev, alamat: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Alamat pemohon" rows={3} />
        <textarea value={form.catatan_admin} onChange={(e) => setForm((prev) => ({ ...prev, catatan_admin: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Catatan admin" rows={3} />
        {message ? <p className="text-sm text-emerald-700 md:col-span-2">{message}</p> : null}
        {error ? <p className="text-sm text-rose-700 md:col-span-2">{error}</p> : null}
        <button className="rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white md:col-span-2">
          {isPending ? "Menyimpan..." : "Buat Surat Manual"}
        </button>
      </form>
    </div>
  );
}
