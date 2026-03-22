"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BellRing, LogOut, RefreshCw, ShieldCheck } from "lucide-react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { clearAuthSession, getStoredToken, getStoredUser } from "@/lib/auth";
import { getAdminPendingWarga, getAdminPengajuanSurat, setApiToken } from "@/lib/api";

function subscribeToClientReady() {
  return () => {};
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";
  const isReady = useSyncExternalStore(subscribeToClientReady, () => true, () => false);
  const token = isReady ? getStoredToken("admin") : null;
  const user = isReady ? getStoredUser("admin") : null;
  const [notificationCount, setNotificationCount] = useState(0);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!isReady) return;

    if (!isLoginPage && !token) {
      router.replace("/admin/login");
      return;
    }

    if (!isLoginPage && user?.role === "warga") {
      clearAuthSession("admin");
      router.replace("/admin/login");
      return;
    }

    if (token) {
      setApiToken(token);
    }
  }, [isLoginPage, isReady, router, token, user?.role]);

  useEffect(() => {
    if (!token || isLoginPage) return;

    let mounted = true;

    const loadNotifications = async () => {
      setIsPolling(true);
      try {
        const [suratResponse, wargaResponse] = await Promise.all([
          getAdminPengajuanSurat({ status: "diajukan", per_page: 1 }),
          getAdminPendingWarga({ per_page: 1 }),
        ]);

        if (!mounted) return;
        setNotificationCount((suratResponse.total ?? 0) + (wargaResponse.total ?? 0));
      } finally {
        if (mounted) {
          setIsPolling(false);
        }
      }
    };

    void loadNotifications();
    const interval = window.setInterval(() => {
      void loadNotifications();
    }, 30000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [isLoginPage, token]);

  const headerCopy = useMemo(() => {
    if (pathname === "/admin/dashboard") {
      return {
        title: "Ruang Kendali Administrasi",
        subtitle: "Pantau ringkasan layanan, data warga, dan aktivitas kampung dari satu dashboard.",
      };
    }

    if (pathname.startsWith("/admin/surat")) {
      return {
        title: "Modul Layanan Surat",
        subtitle: "Kelola pengajuan surat warga, persetujuan akun, verifikasi, dan arsip dokumen.",
      };
    }

    return {
      title: "Dashboard Admin Kampung",
      subtitle: "Kelola data, layanan, dan informasi kampung dengan tampilan kerja yang lebih rapi.",
    };
  }, [pathname]);

  if (isLoginPage) return <>{children}</>;
  if (!isReady || !token || user?.role === "warga") return null;

  return (
    <div className="flex min-h-screen bg-[linear-gradient(180deg,_#f3f7fb,_#eef4f9)]">
      <AdminSidebar notificationCount={notificationCount} />
      <div className="flex-1">
        <div className="border-b border-slate-200/80 bg-white/90 px-6 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                Dashboard Admin
              </div>
              <h1 className="mt-3 font-serif text-3xl font-bold text-slate-950">{headerCopy.title}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{headerCopy.subtitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <div className="relative rounded-xl bg-slate-100 p-2 text-slate-700">
                  <BellRing className="h-4 w-4" />
                  {notificationCount > 0 ? (
                    <>
                      <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-rose-500" />
                      <span className="absolute -right-0.5 -top-0.5 h-3 w-3 animate-ping rounded-full bg-rose-400 opacity-75" />
                    </>
                  ) : null}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Notifikasi Surat</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">
                    {notificationCount > 0 ? `${notificationCount} perlu ditinjau` : "Tidak ada antrean baru"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/admin/surat")}
                  className="rounded-full bg-sky-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-800"
                >
                  Buka Surat
                </button>
              </div>

              <div className="rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Petugas Aktif</p>
                <p className="mt-1 text-sm font-semibold text-slate-950">{user?.name}</p>
              </div>

              <button
                type="button"
                disabled={isPolling}
                onClick={() => router.refresh()}
                className="inline-flex items-center gap-2 rounded-[1.15rem] border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
              >
                <RefreshCw className={`h-4 w-4 ${isPolling ? "animate-spin" : ""}`} />
                Refresh
              </button>

              <button
                onClick={() => {
                  clearAuthSession("admin");
                  router.replace("/admin/login");
                }}
                className="inline-flex items-center gap-2 rounded-[1.15rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
