import { AdminPageShell } from "@/components/admin/page-shell";
import { BantuanManager } from "@/components/admin/bantuan-manager";

export default function AdminBantuanPage() {
  return (
    <AdminPageShell title="Modul Data Bantuan" description="Kelola jenis bantuan, penetapan keluarga penerima, dan riwayat bantuan.">
      <BantuanManager />
    </AdminPageShell>
  );
}
