import { AdminPageShell } from "@/components/admin/page-shell";
import { PendudukManager } from "@/components/admin/penduduk-manager";

export default function AdminPendudukPage() {
  return (
    <AdminPageShell
      title="Data Penduduk"
      description="Kelola data penduduk hasil registrasi portal dan input manual admin, lalu kaitkan ke keluarga dan lindongan."
    >
      <PendudukManager />
    </AdminPageShell>
  );
}
