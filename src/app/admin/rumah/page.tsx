import { AdminPageShell } from "@/components/admin/page-shell";
import { RumahManager } from "@/components/admin/rumah-manager";

export default function AdminRumahPage() {
  return (
    <AdminPageShell
      title="Modul Data Rumah & Koordinat"
      description="Admin dapat memasukkan titik koordinat, foto rumah, dan catatan petugas untuk setiap rumah."
    >
      <RumahManager />
    </AdminPageShell>
  );
}
