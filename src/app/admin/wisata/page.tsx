import { AdminPageShell } from "@/components/admin/page-shell";
import { WisataManager } from "@/components/admin/wisata-manager";

export default function AdminWisataPage() {
  return (
    <AdminPageShell
      title="Modul Wisata"
      description="Kelola tempat wisata kampung, lokasi, deskripsi, foto, dan status tayang dari dashboard admin."
    >
      <WisataManager />
    </AdminPageShell>
  );
}
