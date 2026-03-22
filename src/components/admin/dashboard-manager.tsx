"use client";

import { useEffect, useState } from "react";
import { AdminPageShell } from "@/components/admin/page-shell";
import { HeroSettingsManager } from "@/components/admin/hero-settings-manager";
import { getStoredToken } from "@/lib/auth";
import { getAdminDashboard, getAdminHeroSetting } from "@/lib/api";
import type { DashboardStats, HeroSetting } from "@/types/portal";

const emptyStats: DashboardStats = {
  jumlah_keluarga: 0,
  jumlah_rumah: 0,
  jumlah_pengajuan_surat: 0,
  jumlah_pengajuan_bantuan: 0,
  jumlah_penerima_bantuan: 0,
  statistik_per_lindongan: [],
};

const emptyHero: HeroSetting = {
  id: 0,
  hero_badge: "",
  hero_title: "",
  hero_description: "",
  hero_primary_label: "",
  hero_primary_url: "",
  hero_secondary_label: "",
  hero_secondary_url: "",
  hero_panel_title: "",
  hero_panel_description: "",
  official_name: "",
  official_position: "",
  official_message: "",
  hero_image: null,
  hero_images: [],
  official_photo: null,
  profile_title: "",
  profile_description: "",
  profile_history: "",
  profile_vision_mission: "",
  profile_potential: "",
  profile_image: null,
  government_structure: [],
};

export function DashboardManager() {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [hero, setHero] = useState<HeroSetting>(emptyHero);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getStoredToken("admin")) {
      setLoading(false);
      return;
    }

    void (async () => {
      try {
        const [statsResponse, heroResponse] = await Promise.all([
          getAdminDashboard(),
          getAdminHeroSetting(),
        ]);

        setStats(statsResponse);
        setHero(heroResponse);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AdminPageShell
      title="Dashboard Ringkasan"
      description="Ringkasan operasional harian untuk memantau kondisi data kampung, layanan surat, bantuan, dan sebaran keluarga per lindongan."
      stats={[
        {
          label: "Jumlah Keluarga",
          value: loading ? "..." : stats.jumlah_keluarga,
          helper: "Data keluarga aktif yang sudah tercatat pada sistem kampung.",
        },
        {
          label: "Jumlah Rumah",
          value: loading ? "..." : stats.jumlah_rumah,
          helper: "Rumah warga yang telah dipetakan dan terhubung dengan data keluarga.",
        },
        {
          label: "Pengajuan Surat",
          value: loading ? "..." : stats.jumlah_pengajuan_surat,
          helper: "Total pengajuan surat warga yang masuk melalui layanan administrasi.",
        },
        {
          label: "Pengajuan Bantuan",
          value: loading ? "..." : stats.jumlah_pengajuan_bantuan,
          helper: "Permohonan bantuan yang sedang dipantau dan diverifikasi admin.",
        },
      ]}
    >
      <div className="rounded-[1.7rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
        <h2 className="font-serif text-2xl font-bold text-slate-950">Statistik per Lindongan</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Gunakan ringkasan ini untuk melihat distribusi keluarga yang tercatat pada tiap wilayah lindongan.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {loading ? (
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
              Memuat statistik...
            </div>
          ) : (
            stats.statistik_per_lindongan.map((item) => (
              <div key={item.lindongan} className="rounded-[1.35rem] border border-slate-100 bg-[linear-gradient(180deg,_#ffffff,_#f8fbff)] p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">{item.lindongan}</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{item.total} keluarga</p>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-950">Pengaturan Beranda dan Profil</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
            Hero section, selayang pandang, profil kampung, serta struktur pemerintahan dapat dikelola dari sini, termasuk judul utama, foto, nama pejabat, jabatan, dan narasi profil kampung.
          </p>
        </div>
        <HeroSettingsManager initialHero={hero} />
      </div>
    </AdminPageShell>
  );
}
