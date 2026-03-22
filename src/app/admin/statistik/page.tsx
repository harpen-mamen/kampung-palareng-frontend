import { AdminPageShell } from "@/components/admin/page-shell";
import { mockStats } from "@/lib/mock-data";

export default function AdminStatistikPage() {
  return (
    <AdminPageShell title="Modul Statistik Internal" description="Ringkasan internal keluarga per lindongan, rumah per kategori, DTKS, bantuan, dan sebaran pengajuan.">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card-panel rounded-[1.5rem] p-6">
          <h3 className="text-xl font-bold">Keluarga per Lindongan</h3>
          <div className="mt-4 space-y-3">
            {mockStats.per_lindongan.map((item) => (
              <div key={item.lindongan} className="flex justify-between rounded-2xl bg-white px-4 py-3">
                <span>{item.lindongan}</span>
                <span>{item.total_keluarga}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card-panel rounded-[1.5rem] p-6">
          <h3 className="text-xl font-bold">Komposisi Pekerjaan</h3>
          <div className="mt-4 space-y-3">
            {mockStats.komposisi_pekerjaan.map((item) => (
              <div key={item.label} className="flex justify-between rounded-2xl bg-white px-4 py-3">
                <span>{item.label}</span>
                <span>{item.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
}
