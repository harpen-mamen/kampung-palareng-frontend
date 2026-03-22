"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  BellRing,
  FileArchive,
  FileBadge2,
  FileText,
  Gift,
  Home,
  LayoutDashboard,
  LineChart,
  MapPinned,
  Megaphone,
  Newspaper,
  TreePalm,
  UserCog,
  Users,
  Warehouse,
} from "lucide-react";

const items = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/keluarga", label: "Data Keluarga", icon: Users },
  { href: "/admin/penduduk", label: "Data Penduduk", icon: Users },
  { href: "/admin/rumah", label: "Data Rumah", icon: Home },
  { href: "/admin/bantuan", label: "Bantuan", icon: Gift },
  { href: "/admin/peta", label: "Peta Admin", icon: MapPinned },
  { href: "/admin/verifikasi-masyarakat", label: "Verifikasi Masyarakat", icon: BellRing },
  { href: "/admin/surat", label: "Layanan Surat", icon: BellRing, withNotification: true },
  { href: "/admin/surat-manual", label: "Surat Manual", icon: FileText },
  { href: "/admin/arsip-surat", label: "Arsip Surat", icon: FileArchive },
  { href: "/admin/pengajuan-bantuan", label: "Pengajuan Bantuan", icon: FileBadge2 },
  { href: "/admin/arsip-bantuan", label: "Arsip Bantuan", icon: FileArchive },
  { href: "/admin/berita", label: "Berita", icon: Newspaper },
  { href: "/admin/wisata", label: "Wisata", icon: TreePalm },
  { href: "/admin/pengumuman", label: "Pengumuman", icon: Megaphone },
  { href: "/admin/statistik", label: "Statistik", icon: LineChart },
  { href: "/admin/laporan", label: "Laporan", icon: FileText },
  { href: "/admin/pengguna", label: "Pengguna", icon: UserCog },
] as const;

export function AdminSidebar({ notificationCount = 0 }: { notificationCount?: number }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-80 flex-col border-r border-slate-200 bg-[linear-gradient(180deg,_#081122,_#0f172a)] px-5 py-6 text-white lg:flex">
      <div className="mb-8 rounded-[1.8rem] border border-white/8 bg-white/5 px-5 py-5 shadow-[0_20px_40px_rgba(0,0,0,0.18)]">
        <p className="text-[11px] uppercase tracking-[0.35em] text-emerald-300">Admin Portal</p>
        <h2 className="mt-2 font-serif text-2xl font-bold">Kampung Palareng</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          Pusat kendali administrasi kampung untuk data warga, surat, bantuan, informasi, dan layanan publik.
        </p>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center justify-between rounded-[1.15rem] px-4 py-3.5 text-sm transition",
                pathname === item.href
                  ? "bg-white text-slate-950 shadow-[0_16px_30px_rgba(255,255,255,0.08)]"
                  : "text-slate-300 hover:bg-white/10 hover:text-white",
              )}
            >
              <span className="flex items-center gap-3">
                <span
                  className={clsx(
                    "rounded-xl p-2",
                    pathname === item.href ? "bg-slate-100 text-slate-900" : "bg-white/8 text-slate-200",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="font-medium">{item.label}</span>
              </span>
              {item.withNotification && notificationCount > 0 ? (
                <span className="inline-flex min-w-7 items-center justify-center rounded-full bg-rose-500 px-2 py-1 text-xs font-bold text-white">
                  {notificationCount}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[1.5rem] border border-white/8 bg-white/5 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-300">
            <Warehouse className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Administrasi Aktif</p>
            <p className="mt-1 text-xs leading-6 text-slate-300">
              Gunakan menu di samping untuk mengelola layanan kampung secara terpusat.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
