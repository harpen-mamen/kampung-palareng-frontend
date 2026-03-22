import { AdminMapPanel } from "@/components/maps/admin-map-panel";

export default async function AdminPetaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Modul Peta Admin</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600">Peta admin menampilkan data lengkap rumah, keluarga, bantuan, dan catatan petugas.</p>
      </div>
      <AdminMapPanel initialMarkers={[]} />
    </div>
  );
}
