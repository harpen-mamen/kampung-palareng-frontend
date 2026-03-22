import { ManualSuratManager } from "@/components/admin/manual-surat-manager";
import { AdminPageShell } from "@/components/admin/page-shell";

export default function AdminSuratManualPage() {
  return (
    <AdminPageShell
      title="Surat Manual"
      description="Buat pengajuan surat manual untuk masyarakat yang datang langsung ke kantor dan belum memakai portal."
    >
      <ManualSuratManager />
    </AdminPageShell>
  );
}
