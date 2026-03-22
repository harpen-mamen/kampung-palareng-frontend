import { BantuanArchiveManager } from "@/components/admin/bantuan-archive-manager";
import { AdminPageShell } from "@/components/admin/page-shell";

export default function AdminArsipBantuanPage() {
  return (
    <AdminPageShell
      title="Arsip Bantuan"
      description="Lihat riwayat pengajuan bantuan yang sudah selesai diverifikasi atau sudah diputuskan admin."
    >
      <BantuanArchiveManager />
    </AdminPageShell>
  );
}
