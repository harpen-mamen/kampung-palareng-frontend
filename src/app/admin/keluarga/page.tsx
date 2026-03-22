import { AdminPageShell } from "@/components/admin/page-shell";
import { KeluargaManager } from "@/components/admin/keluarga-manager";

export default function AdminKeluargaPage() {
  return (
    <AdminPageShell
      title="Modul Data Keluarga"
      description="Kelola data keluarga dengan identitas utama kode_keluarga dan filter berbasis Lindongan."
    >
      <KeluargaManager />
    </AdminPageShell>
  );
}
