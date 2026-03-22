import { AdminPageShell } from "@/components/admin/page-shell";
import { ReportManager } from "@/components/admin/report-manager";

export default function AdminLaporanPage() {
  return (
    <AdminPageShell
      title="Modul Laporan"
      description="Unduh laporan keluarga, rumah, bantuan, surat, dan pengajuan bantuan dalam format Excel atau PDF."
    >
      <ReportManager />
    </AdminPageShell>
  );
}
