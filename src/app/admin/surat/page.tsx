import { AdminPageShell } from "@/components/admin/page-shell";
import { SuratTemplateSettings } from "@/components/admin/surat-template-settings";
import { SuratVerificationManager } from "@/components/admin/surat-verification-manager";

export default function AdminSuratPage() {
  return (
    <AdminPageShell title="Modul Layanan Surat" description="Verifikasi dokumen, ubah status, cetak surat, dan arsipkan pengajuan surat.">
      <div className="space-y-6">
        <SuratVerificationManager />
        <SuratTemplateSettings />
      </div>
    </AdminPageShell>
  );
}
