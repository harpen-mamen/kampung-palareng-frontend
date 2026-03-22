export function FilterBar() {
  return (
    <div className="mb-6 grid gap-3 rounded-[1.5rem] border border-sky-100 bg-white p-4 md:grid-cols-3">
      <input
        placeholder="Cari nama keluarga atau kode..."
        className="rounded-xl border border-slate-200 px-4 py-3 outline-none ring-0"
      />
      <select className="rounded-xl border border-slate-200 px-4 py-3 outline-none ring-0">
        <option>Semua Lindongan</option>
        <option>Lindongan 1</option>
        <option>Lindongan 2</option>
        <option>Lindongan 3</option>
        <option>Lindongan 4</option>
      </select>
      <select className="rounded-xl border border-slate-200 px-4 py-3 outline-none ring-0">
        <option>Semua Status</option>
        <option>Aktif</option>
        <option>Diajukan</option>
        <option>Disetujui</option>
      </select>
    </div>
  );
}
