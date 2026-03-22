import { AdminPageShell } from "@/components/admin/page-shell";
import { DataTable } from "@/components/shared/data-table";

const rows = [
  { id: 1, name: "Super Admin Palareng", email: "admin@palareng.id", role: "super_admin" },
  { id: 2, name: "Operator Kampung", email: "operator@palareng.id", role: "operator" },
];

export default function AdminPenggunaPage() {
  return (
    <AdminPageShell title="Modul Pengguna" description="Kelola akun admin dan role-based access untuk super_admin, operator, verifikator, dan pimpinan.">
      <DataTable
        rows={rows}
        columns={[
          { key: "name", label: "Nama" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role" },
        ]}
      />
    </AdminPageShell>
  );
}
