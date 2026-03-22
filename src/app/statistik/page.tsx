import { PublicFooter } from "@/components/public/footer";
import { PublicNavbar } from "@/components/public/navbar";
import { PublicPageHero } from "@/components/public/page-hero";
import { getPublicHero, getPublicStats } from "@/lib/api";
import {
  BarChart3,
  Fish,
  HandCoins,
  Home,
  House,
  PieChart,
  MapPinned,
  ShieldCheck,
  Users,
} from "lucide-react";

const CHART_COLORS = ["#0f766e", "#0b5ed7", "#f59e0b", "#ef4444", "#7c3aed", "#14b8a6"];

function createPieBackground(items: { total: number }[]) {
  const total = items.reduce((sum, item) => sum + item.total, 0);
  if (!total) return "conic-gradient(#cbd5e1 0deg 360deg)";

  let current = 0;
  return `conic-gradient(${items
    .map((item, index) => {
      const start = current;
      const end = current + (item.total / total) * 360;
      current = end;
      return `${CHART_COLORS[index % CHART_COLORS.length]} ${start}deg ${end}deg`;
    })
    .join(", ")})`;
}

export default async function StatistikPage() {
  const [stats, hero] = await Promise.all([getPublicStats(), getPublicHero()]);
  const maxLindongan = Math.max(...stats.per_lindongan.map((item) => item.total_keluarga), 1);
  const bantuanMax = Math.max(...stats.penerima_bantuan_per_jenis.map((item) => item.total), 1);
  const ekonomiMax = Math.max(...stats.komposisi_status_ekonomi.map((item) => item.total), 1);
  const pekerjaanLegend = stats.komposisi_pekerjaan.map((item, index) => ({
    ...item,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));
  const headlineCards = [
    {
      label: "Jumlah Keluarga",
      value: stats.jumlah_keluarga,
      Icon: House,
      iconClass: "bg-sky-50 text-sky-700",
      cardClass: "border-sky-100 bg-[linear-gradient(180deg,_#ffffff,_#f3f9ff)]",
    },
    {
      label: "Jumlah Penduduk",
      value: stats.jumlah_penduduk,
      Icon: Users,
      iconClass: "bg-blue-50 text-blue-700",
      cardClass: "border-blue-100 bg-[linear-gradient(180deg,_#ffffff,_#f5f8ff)]",
    },
    {
      label: "Keluarga DTKS",
      value: stats.jumlah_dtks,
      Icon: ShieldCheck,
      iconClass: "bg-violet-50 text-violet-700",
      cardClass: "border-violet-100 bg-[linear-gradient(180deg,_#ffffff,_#faf5ff)]",
    },
    {
      label: "Keluarga Nelayan",
      value: stats.jumlah_nelayan,
      Icon: Fish,
      iconClass: "bg-emerald-50 text-emerald-700",
      cardClass: "border-emerald-100 bg-[linear-gradient(180deg,_#ffffff,_#f1fff8)]",
    },
  ];
  const summaryCards = [
    {
      label: "Jumlah Rumah",
      value: stats.jumlah_rumah,
      caption: "Total rumah warga yang tersimpan di database.",
      Icon: Home,
      iconClass: "bg-amber-50 text-amber-700",
      cardClass: "border-amber-100 bg-[linear-gradient(180deg,_#ffffff,_#fffaf1)]",
    },
    {
      label: "Penerima Bantuan",
      value: stats.jumlah_penerima_bantuan,
      caption: "Keluarga penerima bantuan yang tercatat pada database.",
      Icon: HandCoins,
      iconClass: "bg-emerald-50 text-emerald-700",
      cardClass: "border-emerald-100 bg-[linear-gradient(180deg,_#ffffff,_#f1fff8)]",
    },
    {
      label: "Rata-rata per Rumah",
      value: Math.round((stats.jumlah_penduduk / Math.max(stats.jumlah_rumah, 1)) * 10) / 10,
      caption: "Nilai turunan dari total penduduk dan total rumah database.",
      Icon: Users,
      iconClass: "bg-rose-50 text-rose-700",
      cardClass: "border-rose-100 bg-[linear-gradient(180deg,_#ffffff,_#fff5f6)]",
    },
    {
      label: "Lindongan Aktif",
      value: stats.per_lindongan.length,
      caption: "Jumlah lindongan yang muncul pada rekap data rumah dan keluarga.",
      Icon: MapPinned,
      iconClass: "bg-cyan-50 text-cyan-700",
      cardClass: "border-cyan-100 bg-[linear-gradient(180deg,_#ffffff,_#f2fcff)]",
    },
  ];

  return (
    <div>
      <div className="relative">
        <PublicNavbar variant="overlay" activeHref="/statistik" />
        <PublicPageHero
          hero={hero}
          eyebrow="Infografis Penduduk"
          title="Infografis penduduk Kampung Palareng"
          description="Semua angka di halaman ini diambil dari data agregat database aktif Kampung Palareng, lalu divisualisasikan dalam bentuk kartu dan grafik yang lebih nyaman dibaca warga."
          stats={[
            {
              label: "Keluarga",
              value: stats.jumlah_keluarga,
              caption: "Keluarga aktif yang tercatat pada database kampung.",
              tone: "sky",
            },
            {
              label: "Penduduk",
              value: stats.jumlah_penduduk,
              caption: "Jumlah penduduk dari akumulasi data keluarga aktif.",
              tone: "emerald",
            },
            {
              label: "Rumah",
              value: stats.jumlah_rumah,
              caption: "Rumah warga yang sudah memiliki data lokasi dan identitas.",
              tone: "amber",
            },
          ]}
          shortcuts={[
            {
              href: "#statistik-utama",
              label: "Ringkasan",
              icon: <BarChart3 className="h-7 w-7" />,
            },
            {
              href: "#statistik-utama",
              label: "Komposisi",
              icon: <PieChart className="h-7 w-7" />,
            },
            {
              href: "/peta",
              label: "Peta Data",
              icon: <MapPinned className="h-7 w-7" />,
            },
          ]}
        />
      </div>
      <main id="statistik-utama" className="container-shell relative z-10 -mt-10 py-10 md:-mt-12 md:py-14">
        <section className="relative overflow-hidden rounded-[2.4rem] border border-white/70 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(245,250,255,0.96))] px-6 py-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)] md:px-8 md:py-10">
          <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,_rgba(191,219,254,0.32),_rgba(255,255,255,0))]" />

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {headlineCards.map(({ label, value, Icon, iconClass, cardClass }) => (
              <div
                key={label}
                className={`rounded-[1.65rem] border p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)] ${cardClass}`}
              >
                <div className={`inline-flex rounded-2xl p-3 ${iconClass}`}>
                  <Icon className="h-6 w-6" strokeWidth={2.2} />
                </div>
                <p className="mt-4 text-sm text-slate-500">{label}</p>
                <p className="mt-1 text-3xl font-black text-slate-950">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map(({ label, value, caption, Icon, iconClass, cardClass }) => (
              <div
                key={label}
                className={`rounded-[1.5rem] border p-5 shadow-[0_14px_40px_rgba(15,23,42,0.04)] ${cardClass}`}
              >
                <div className={`inline-flex rounded-2xl p-3 ${iconClass}`}>
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                </div>
                <p className="mt-4 text-sm text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">{caption}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
              <h3 className="text-xl font-bold text-slate-950">
                Sebaran keluarga dan penduduk per lindongan
              </h3>
              <div className="mt-6 flex h-[320px] items-end gap-5 rounded-[1.5rem] bg-[linear-gradient(180deg,_#f8fbff,_#eef5ff)] p-5">
                {stats.per_lindongan.map((item, index) => (
                  <div key={item.lindongan} className="flex flex-1 flex-col items-center justify-end gap-3">
                    <span className="text-sm font-semibold text-slate-600">{item.total_keluarga}</span>
                    <div
                      className={`w-full rounded-t-[1.25rem] ${
                        index % 3 === 0
                          ? "bg-sky-600"
                          : index % 3 === 1
                            ? "bg-emerald-600"
                            : "bg-amber-500"
                      }`}
                      style={{
                        height: `${Math.max((item.total_keluarga / maxLindongan) * 210, 40)}px`,
                      }}
                    />
                    <span className="text-center text-sm font-medium text-slate-700">{item.lindongan}</span>
                    <span className="text-center text-xs text-slate-500">{item.total_penduduk} jiwa</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
              <h3 className="text-xl font-bold text-slate-950">Komposisi pekerjaan warga</h3>
              <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
                <div
                  className="mx-auto flex h-[220px] w-[220px] items-center justify-center rounded-full"
                  style={{ background: createPieBackground(stats.komposisi_pekerjaan) }}
                >
                  <div className="flex h-[92px] w-[92px] items-center justify-center rounded-full bg-white text-center text-xs font-semibold text-slate-600 shadow-inner">
                    Pekerjaan
                    <br />
                    Warga
                  </div>
                </div>

                <div className="space-y-3">
                  {pekerjaanLegend.map((item) => (
                    <div key={item.label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm font-medium text-slate-700">{item.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{item.total}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
              <h3 className="text-xl font-bold text-slate-950">Penerima bantuan per jenis</h3>
              <div className="mt-6 space-y-4">
                {stats.penerima_bantuan_per_jenis.map((item, index) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-700">{item.label}</span>
                      <span className="font-bold text-slate-950">{item.total}</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100">
                      <div
                        className="h-3 rounded-full"
                        style={{
                          width: `${Math.max((item.total / bantuanMax) * 100, 8)}%`,
                          backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
                <h3 className="text-xl font-bold text-slate-950">Komposisi DTKS</h3>
                <div className="mt-6 grid items-center gap-5 sm:grid-cols-[180px_1fr]">
                  <div
                    className="mx-auto flex h-[180px] w-[180px] items-center justify-center rounded-full"
                    style={{ background: createPieBackground(stats.komposisi_dtks) }}
                  >
                    <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-white text-center text-xs font-semibold text-slate-600 shadow-inner">
                      DTKS
                    </div>
                  </div>
                  <div className="space-y-3">
                    {stats.komposisi_dtks.map((item, index) => (
                      <div key={item.label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                          <span className="text-sm font-medium text-slate-700">{item.label}</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{item.total}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
                <h3 className="text-xl font-bold text-slate-950">Status ekonomi keluarga</h3>
                <div className="mt-5 space-y-3">
                  {stats.komposisi_status_ekonomi.map((item, index) => (
                    <div key={item.label} className="rounded-2xl bg-slate-50 px-4 py-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-slate-700">{item.label}</span>
                        <span className="font-bold text-slate-950">{item.total}</span>
                      </div>
                      <div className="mt-3 h-2.5 rounded-full bg-white">
                        <div
                          className="h-2.5 rounded-full"
                          style={{
                            width: `${Math.max((item.total / ekonomiMax) * 100, 6)}%`,
                            backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[1.65rem] border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-600 shadow-[0_18px_50px_rgba(15,23,42,0.04)]">
            Statistik publik disajikan dalam bentuk agregat agar mudah dibaca masyarakat
            tanpa menampilkan data pribadi keluarga.
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
