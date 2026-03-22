import { AdminPageShell } from "@/components/admin/page-shell";
import { SuratArchiveManager } from "@/components/admin/surat-archive-manager";

export default function AdminArsipSuratPage() {
  return (
    <AdminPageShell
      title="Arsip Surat"
      description="Pusat dokumen surat resmi yang sudah disetujui, diberi nomor surat, dibuat PDF, dan disimpan sebagai arsip kampung."
    >
      <SuratArchiveManager />
    </AdminPageShell>
  );
}
