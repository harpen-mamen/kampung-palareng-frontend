import { AdminPageShell } from "@/components/admin/page-shell";
import { BantuanVerificationManager } from "@/components/admin/bantuan-verification-manager";

export default function AdminPengajuanBantuanPage() {
  return (
    <AdminPageShell title="Modul Pengajuan Bantuan" description="Verifikasi pengajuan bantuan masyarakat dan hubungkan hasil verifikasi ke data keluarga jika disetujui.">
      <BantuanVerificationManager />
    </AdminPageShell>
  );
}
