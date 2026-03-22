import { AdminPageShell } from "@/components/admin/page-shell";
import { WargaApprovalManager } from "@/components/admin/warga-approval-manager";

export default function AdminVerifikasiMasyarakatPage() {
  return (
    <AdminPageShell
      title="Verifikasi Masyarakat"
      description="Setujui atau tolak akun masyarakat yang registrasi melalui portal sebelum mereka memakai layanan bantuan dan surat."
    >
      <WargaApprovalManager />
    </AdminPageShell>
  );
}
