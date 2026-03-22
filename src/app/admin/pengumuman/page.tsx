import { AdminPageShell } from "@/components/admin/page-shell";
import { PengumumanManager } from "@/components/admin/pengumuman-manager";

export default function AdminPengumumanPage() {
  return (
    <AdminPageShell title="Modul Pengumuman" description="Kelola pengumuman kampung yang ditampilkan kepada masyarakat.">
      <PengumumanManager />
    </AdminPageShell>
  );
}
