import { AdminPageShell } from "@/components/admin/page-shell";
import { BeritaManager } from "@/components/admin/berita-manager";

export default function AdminBeritaPage() {
  return (
    <AdminPageShell title="Modul Berita & Pengumuman" description="Kelola berita, kategori, gambar, dan status publish/draft konten kampung.">
      <BeritaManager />
    </AdminPageShell>
  );
}
